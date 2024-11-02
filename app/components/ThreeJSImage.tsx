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

export default function ThreeJSImage({ src, alt, priority = false, className = '' }: ThreeJSImageProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const materialRef = useRef<THREE.ShaderMaterial | null>(null);
	const mouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
	const isHoveringRef = useRef(false);

	useEffect(() => {
		// Check if we're on mobile
		if (window.matchMedia('(max-width: 768px)').matches) {
			return; // Don't initialize ThreeJS on mobile
		}

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
		rendererRef.current = renderer;

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
      uniform bool uIsHovering;
      uniform vec2 uResolution;
      uniform float uAspectRatio;
      varying vec2 vUv;

      void main() {
        vec2 pixelCoord = vUv * uResolution;
        vec2 mousePixel = uMouse * uResolution;
        
        // Adjust coordinates for aspect ratio
        pixelCoord.x *= uAspectRatio;
        mousePixel.x *= uAspectRatio;
        
        float dist = distance(pixelCoord, mousePixel);
        float radius = min(uResolution.x, uResolution.y) * 0.1; // 10% of smallest dimension
        
        vec2 zoomedUv = vUv;
        float mask = step(dist, radius);
        
        if (dist < radius) {
          vec2 offset = (pixelCoord - mousePixel) / uAspectRatio;
          vec2 zoomedPixel = mousePixel + offset / 2.0; // Zoom factor of 2
          zoomedUv = zoomedPixel / uResolution;
          zoomedUv.x /= uAspectRatio;
        }

        vec4 originalColor = texture2D(uTexture, vUv);
        vec4 zoomedColor = texture2D(uTexture, zoomedUv);
        
        gl_FragColor = mix(originalColor, zoomedColor, mask * float(uIsHovering));
      }
    `;

		// Load texture
		const textureLoader = new THREE.TextureLoader();
		textureLoader.load(
			src,
			(texture) => {
				texture.minFilter = THREE.LinearFilter;
				texture.magFilter = THREE.LinearFilter;
				texture.generateMipmaps = false;

				const imageAspect = texture.image.width / texture.image.height;
				const containerAspect = width / height;

				const material = new THREE.ShaderMaterial({
					uniforms: {
						uTexture: { value: texture },
						uMouse: { value: new THREE.Vector2(0.5, 0.5) },
						uIsHovering: { value: false },
						uResolution: { value: new THREE.Vector2(width, height) },
						uAspectRatio: { value: imageAspect }
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
				if (imageAspect > containerAspect) {
					mesh.scale.y = 1 / imageAspect * containerAspect;
				} else {
					mesh.scale.x = imageAspect / containerAspect;
				}

				// Initial render
				renderer.render(scene, camera);
			},
			undefined,
			(error) => {
				console.error('Error loading texture:', error);
			}
		);

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
			if (!isHoveringRef.current) return;
			const rect = container.getBoundingClientRect();
			mouseRef.current = {
				x: (event.clientX - rect.left) / rect.width,
				y: 1.0 - (event.clientY - rect.top) / rect.height
			};
		};

		const handleMouseEnter = () => {
			isHoveringRef.current = true;
		};

		const handleMouseLeave = () => {
			isHoveringRef.current = false;
		};

		const handleResize = () => {
			if (!containerRef.current || !materialRef.current || !renderer) return;

			const { width, height } = containerRef.current.getBoundingClientRect();
			renderer.setSize(width, height);
			materialRef.current.uniforms.uResolution.value.set(width, height);
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
			if (container.contains(renderer.domElement)) {
				container.removeChild(renderer.domElement);
			}
		};
	}, [src]);

	// For mobile, render a simple image
	if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
		return (
			<div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
				<img src={src} alt={alt} className="w-full h-full object-cover" />
			</div>
		);
	}

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