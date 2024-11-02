"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface ThreeJSImageProps {
	src: string;
	alt: string;
	priority?: boolean;
	className?: string;
}

const normalizeMousePosition = (event: MouseEvent, element: HTMLElement) => {
	const rect = element.getBoundingClientRect();
	const x = (event.clientX - rect.left) / rect.width;
	const y = 1 - (event.clientY - rect.top) / rect.height;
	return { x, y };
};

export default function ThreeJSImage({ src, alt, priority = false, className = '' }: ThreeJSImageProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const materialRef = useRef<THREE.ShaderMaterial | null>(null);
	const mouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
	const isHoveringRef = useRef(false);

	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const { width, height } = container.getBoundingClientRect();

		// Scene setup
		const scene = new THREE.Scene();
		const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
		camera.position.z = 1;

		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			powerPreference: "high-performance"
		});
		renderer.setSize(width, height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		container.appendChild(renderer.domElement);

		// Shaders
		const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

		const fragmentShader = `
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform float uZoom;
      uniform bool uIsHovering;
      varying vec2 vUv;

      void main() {
        if (!uIsHovering) {
          gl_FragColor = texture2D(uTexture, vUv);
          return;
        }

        vec2 mouse = uMouse;
        float dist = distance(vUv, mouse);
        float radius = 0.1;
        float zoomStrength = 2.0; // Zoom magnification factor
        
        vec2 zoomedUv = vUv;
        float zoomMask = 1.0 - smoothstep(radius * 0.8, radius, dist);
        
        if (dist < radius) {
          vec2 offset = vUv - mouse;
          zoomedUv = mouse + offset / zoomStrength;
        }

        vec4 originalColor = texture2D(uTexture, vUv);
        vec4 zoomedColor = texture2D(uTexture, zoomedUv);
        
        // Add a subtle border around the magnified area
        float borderWidth = 0.002;
        float borderMask = smoothstep(radius - borderWidth, radius, dist) * 
                          (1.0 - smoothstep(radius, radius + borderWidth, dist));
        vec3 borderColor = vec3(1.0);
        
        vec4 finalColor = mix(originalColor, zoomedColor, zoomMask);
        finalColor.rgb = mix(finalColor.rgb, borderColor, borderMask * 0.5);
        
        gl_FragColor = finalColor;
      }
    `;

		// Load texture
		const textureLoader = new THREE.TextureLoader();
		textureLoader.load(src, (texture) => {
			texture.minFilter = THREE.LinearFilter;
			texture.magFilter = THREE.LinearFilter;
			texture.generateMipmaps = false;

			const material = new THREE.ShaderMaterial({
				uniforms: {
					uTexture: { value: texture },
					uMouse: { value: new THREE.Vector2(0.5, 0.5) },
					uIsHovering: { value: false },
					uZoom: { value: 0.0 }
				},
				vertexShader,
				fragmentShader,
				transparent: true,
			});
			materialRef.current = material;

			const geometry = new THREE.PlaneGeometry(2, 2);
			const mesh = new THREE.Mesh(geometry, material);
			scene.add(mesh);

			// Scale mesh to maintain aspect ratio
			const imageAspect = texture.image.width / texture.image.height;
			const containerAspect = width / height;

			if (imageAspect > containerAspect) {
				mesh.scale.y = 1 / imageAspect * containerAspect;
			} else {
				mesh.scale.x = imageAspect / containerAspect;
			}
		});

		// Animation loop
		let animationFrame: number;
		const animate = () => {
			if (materialRef.current) {
				materialRef.current.uniforms.uMouse.value.x = mouseRef.current.x;
				materialRef.current.uniforms.uMouse.value.y = mouseRef.current.y;
				materialRef.current.uniforms.uIsHovering.value = isHoveringRef.current;
			}

			renderer.render(scene, camera);
			animationFrame = requestAnimationFrame(animate);
		};

		animationFrame = requestAnimationFrame(animate);

		// Event handlers
		const handleMouseMove = (event: MouseEvent) => {
			const normalized = normalizeMousePosition(event, container);
			mouseRef.current = normalized;
		};

		const handleMouseEnter = () => {
			isHoveringRef.current = true;
			if (materialRef.current) {
				gsap.to(materialRef.current.uniforms.uZoom, {
					value: 1,
					duration: 0.3,
					ease: "power2.out"
				});
			}
		};

		const handleMouseLeave = () => {
			isHoveringRef.current = false;
			if (materialRef.current) {
				gsap.to(materialRef.current.uniforms.uZoom, {
					value: 0,
					duration: 0.3,
					ease: "power2.out"
				});
			}
		};

		// Handle resize
		const handleResize = () => {
			if (!containerRef.current || !materialRef.current || !renderer) return;

			const { width, height } = containerRef.current.getBoundingClientRect();
			renderer.setSize(width, height);
		};

		// Event listeners
		container.addEventListener('mousemove', handleMouseMove);
		container.addEventListener('mouseenter', handleMouseEnter);
		container.addEventListener('mouseleave', handleMouseLeave);
		window.addEventListener('resize', handleResize);

		return () => {
			cancelAnimationFrame(animationFrame);
			container.removeEventListener('mousemove', handleMouseMove);
			container.removeEventListener('mouseenter', handleMouseEnter);
			container.removeEventListener('mouseleave', handleMouseLeave);
			window.removeEventListener('resize', handleResize);

			renderer.dispose();
			container.removeChild(renderer.domElement);
		};
	}, [src]);

	return (
		<div
			ref={containerRef}
			className={`relative ${className}`}
			style={{
				width: '100%',
				height: '100%',
				minHeight: '80vh',
				touchAction: 'none'
			}}
		>
			<noscript>
				<img
					src={src}
					alt={alt}
					className={className}
				/>
			</noscript>
		</div>
	);
}