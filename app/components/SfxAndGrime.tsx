"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const images = [
	"/assets/sfx_and_grime/grime_heks.jpg",
	"/assets/sfx_and_grime/grime_kikker.jpg",
	"/assets/sfx_and_grime/distortion.jpg",
	"/assets/sfx_and_grime/grime_snor_en_sik.jpg",
	"/assets/sfx_and_grime/grime_snor_en_sik_2.jpg",
	"/assets/sfx_and_grime/veroudering.jpg",
	"/assets/sfx_and_grime/veroudering.gif",
];

export default function SFXAndGrime() {
	const containerRef = useRef<HTMLDivElement>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const materialRef = useRef<THREE.ShaderMaterial | null>(null);
	const currentImageRef = useRef(0);
	const isTransitioningRef = useRef(false);
	const mouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
	const [isMobile, setIsMobile] = useState(false);
	const touchStartXRef = useRef(0);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.matchMedia('(max-width: 768px)').matches);
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Mobile-specific image navigation
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartXRef.current = e.touches[0].clientX;
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		if (isTransitioningRef.current) return;
		const touchEnd = e.changedTouches[0].clientX;
		const diff = touchStartXRef.current - touchEnd;

		if (Math.abs(diff) > 50) { // Minimum swipe distance
			if (diff > 0 && currentImageIndex < images.length - 1) {
				setCurrentImageIndex(prev => prev + 1);
			} else if (diff < 0 && currentImageIndex > 0) {
				setCurrentImageIndex(prev => prev - 1);
			}
		}
	};

	// Desktop ThreeJS setup
	useEffect(() => {
		if (isMobile || !containerRef.current) return;

		const container = containerRef.current;
		const { width, height } = container.getBoundingClientRect();

		const scene = new THREE.Scene();
		const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
		camera.position.z = 1;

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(width, height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		container.appendChild(renderer.domElement);
		rendererRef.current = renderer;

		const fragmentShader = `
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      varying vec2 vUv;

      void main() {
        vec2 pixelCoord = vUv * uResolution;
        vec2 mousePixel = uMouse * uResolution;
        
        float dist = distance(pixelCoord, mousePixel);
        float radius = 300.0;
        float softness = 200.0;
        
        vec4 color = texture2D(uTexture, vUv);
        
        float brightness = 1.0 - smoothstep(radius - softness, radius + softness, dist);
        brightness = pow(brightness, 1.5);
        
        float ambientLight = 0.1;
        vec3 finalColor = mix(
          color.rgb * ambientLight,
          color.rgb,
          brightness
        );
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

		const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

		const loadTexture = (index: number) => {
			new THREE.TextureLoader().load(images[index], (texture) => {
				texture.minFilter = THREE.LinearFilter;
				texture.magFilter = THREE.LinearFilter;

				const material = new THREE.ShaderMaterial({
					uniforms: {
						uTexture: { value: texture },
						uMouse: { value: new THREE.Vector2(0.5, 0.5) },
						uResolution: { value: new THREE.Vector2(width, height) }
					},
					vertexShader,
					fragmentShader,
				});

				materialRef.current = material;

				const geometry = new THREE.PlaneGeometry(2, 2);
				const mesh = new THREE.Mesh(geometry, material);

				scene.clear();
				scene.add(mesh);

				const imageAspect = texture.image.width / texture.image.height;
				const containerAspect = width / height;

				if (imageAspect > containerAspect) {
					mesh.scale.y = 1 / imageAspect * containerAspect;
				} else {
					mesh.scale.x = imageAspect / containerAspect;
				}

				isTransitioningRef.current = false;
			});
		};

		loadTexture(0);

		const animate = () => {
			if (materialRef.current) {
				materialRef.current.uniforms.uMouse.value.x = mouseRef.current.x;
				materialRef.current.uniforms.uMouse.value.y = mouseRef.current.y;
			}
			renderer.render(scene, camera);
			requestAnimationFrame(animate);
		};

		const animationId = requestAnimationFrame(animate);

		const handleMouseMove = (e: MouseEvent) => {
			const rect = container.getBoundingClientRect();
			mouseRef.current = {
				x: (e.clientX - rect.left) / rect.width,
				y: 1.0 - ((e.clientY - rect.top) / rect.height)
			};
		};

		const handleClick = () => {
			if (isTransitioningRef.current) return;
			isTransitioningRef.current = true;

			currentImageRef.current = (currentImageRef.current + 1) % images.length;
			loadTexture(currentImageRef.current);
		};

		const handleResize = () => {
			if (!containerRef.current || !renderer || !materialRef.current) return;

			const { width, height } = containerRef.current.getBoundingClientRect();
			renderer.setSize(width, height);
			materialRef.current.uniforms.uResolution.value.set(width, height);
		};

		container.addEventListener('mousemove', handleMouseMove);
		container.addEventListener('click', handleClick);
		window.addEventListener('resize', handleResize);

		return () => {
			cancelAnimationFrame(animationId);
			container.removeEventListener('mousemove', handleMouseMove);
			container.removeEventListener('click', handleClick);
			window.removeEventListener('resize', handleResize);
			renderer.dispose();
			if (container.contains(renderer.domElement)) {
				container.removeChild(renderer.domElement);
			}
		};
	}, [isMobile]);

	if (isMobile) {
		return (
			<section className="relative w-screen h-screen flex-shrink-0 bg-black overflow-hidden">
				<h1 className="absolute top-8 left-0 w-full text-center text-5xl font-rumble text-white z-10">
					SFX & GRIME
				</h1>

				<div
					className="w-full h-full flex items-center justify-center"
					onTouchStart={handleTouchStart}
					onTouchEnd={handleTouchEnd}
				>
					<div className="relative w-full h-full">
						{images.map((src, index) => (
							<div
								key={index}
								className={`absolute inset-0 transition-opacity duration-500
                  ${index === currentImageIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={src}
									alt={`SFX and Grime ${index + 1}`}
									className="w-full h-full object-contain"
								/>
							</div>
						))}
					</div>

					{/* Navigation dots */}
					<div className="absolute bottom-8 left-0 w-full flex justify-center gap-2 z-10">
						{images.map((_, index) => (
							<button
								key={index}
								className={`w-2 h-2 rounded-full transition-all duration-300
                  ${index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'}`}
								onClick={() => setCurrentImageIndex(index)}
								aria-label={`Go to image ${index + 1}`}
							/>
						))}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="relative w-screen h-screen flex-shrink-0 bg-black overflow-hidden">
			<h1 className="absolute z-10 text-white text-[8rem] font-rumble leading-none transform -rotate-90 origin-top-left top-full left-20">
				SFX & GRIME
			</h1>

			<div
				ref={containerRef}
				className="w-full h-full cursor-pointer"
			/>
		</section>
	);
}