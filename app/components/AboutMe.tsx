"use client";

import { Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 12;

export default function AboutMe() {
	const containerRef = useRef<HTMLDivElement>(null);
	const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
	const textRef = useRef<HTMLDivElement>(null);
	const socialsRef = useRef<HTMLDivElement>(null);
	const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
	const isAnimatingRef = useRef(false);

	useEffect(() => {
		if (isAnimatingRef.current) return;
		isAnimatingRef.current = true;

		// Create ScrollTrigger for the section
		const scrollTrigger = ScrollTrigger.create({
			trigger: containerRef.current,
			start: "top top",
			end: "bottom top",
			pin: true,
			pinSpacing: false,
			onEnter: () => {
				// Start animations when section enters viewport
				startAnimations();
			},
			onLeaveBack: () => {
				// Reset animations when scrolling back up
				resetAnimations();
			}
		});

		function startAnimations() {
			// Initial animation timeline with optimized settings
			const tl = gsap.timeline({ 
				defaults: { ease: "power3.out" },
				onComplete: () => {
					isAnimatingRef.current = false;
				}
			});

			// Setup initial states
			gsap.set([imagesRef.current, textRef.current, socialsRef.current], {
				opacity: 0,
				y: 30
			});

			gsap.set(particlesRef.current, {
				opacity: 0,
				scale: 0
			});

			// Optimized animation sequence
			tl.to(particlesRef.current, {
				opacity: 0.4,
				scale: 1,
				duration: 0.8,
				stagger: 0.03
			})
			.to(textRef.current, {
				opacity: 1,
				y: 0,
				duration: 1,
				ease: "power2.out"
			}, "-=0.3")
			.to(imagesRef.current, {
				opacity: 1,
				y: 0,
				duration: 0.8,
				stagger: 0.15,
				rotate: "random(-5, 5)"
			}, "-=0.8")
			.to(socialsRef.current, {
				opacity: 1,
				y: 0,
				duration: 0.4
			}, "-=0.4");
		}

		function resetAnimations() {
			gsap.set([imagesRef.current, textRef.current, socialsRef.current, particlesRef.current], {
				clearProps: "all"
			});
			isAnimatingRef.current = false;
		}

		// Optimized mouse parallax effect with throttling
		const handleMouseMove = (e: MouseEvent) => {
			if (isAnimatingRef.current) return;
			
			const { clientX, clientY } = e;
			const x = (clientX / window.innerWidth - 0.5) * 15;
			const y = (clientY / window.innerHeight - 0.5) * 15;

			// Reduced parallax intensity for better performance
			imagesRef.current.forEach((image, index) => {
				if (image) {
					gsap.to(image, {
						x: x * (index + 1) * 0.3,
						y: y * (index + 1) * 0.3,
						rotateX: -y * 0.1,
						rotateY: x * 0.1,
						duration: 0.8,
						ease: "power1.out"
					});
				}
			});

			// Simplified particle movement
			gsap.to(particlesRef.current, {
				x: x * 0.2,
				y: y * 0.2,
				duration: 1,
				ease: "power1.out",
				stagger: 0.02
			});
		};

		const debouncedHandleMouseMove = debounce(handleMouseMove, 16);
		window.addEventListener("mousemove", debouncedHandleMouseMove);

		// Simplified floating animation for particles
		particlesRef.current.forEach((particle, i) => {
			if (particle) {
				gsap.to(particle, {
					y: "random(-15, 15)",
					x: "random(-15, 15)",
					rotation: "random(-90, 90)",
					duration: "random(3, 5)",
					repeat: -1,
					yoyo: true,
					ease: "sine.inOut",
					delay: i * 0.1
				});
			}
		});

		return () => {
			window.removeEventListener("mousemove", debouncedHandleMouseMove);
			scrollTrigger.kill();
		};
	}, []);

	// Debounce function for performance
	function debounce(func: Function, wait: number) {
		let timeout: NodeJS.Timeout;
		return function executedFunction(...args: any[]) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}

	return (
		<section className="relative h-screen w-screen overflow-hidden bg-light-purple">
			{/* Background elements */}
			<div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-purple-900/5" />
			<div className="absolute left-[50%] top-[20%] h-[60vh] w-[60vh] rounded-full bg-[#60367B]/30 blur-[80px] transform -translate-x-1/2" />

			{/* Main content */}
			<div ref={containerRef} className="relative w-full h-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
				{/* Text content with improved positioning */}
				<div
					ref={textRef}
					className="absolute top-[15%] left-[8%] z-20"
				>
					<h1 className="text-[4.5rem] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[7.5rem] leading-[0.9] font-super-funky font-outline text-[#A8F584] tracking-wider">
						Shelsey<br />Boermans
					</h1>
					<p className="text-2xl sm:text-3xl md:text-4xl mt-3 font-super-funky text-[#00B4D8] relative tracking-wide">
						Makeup Artist
					</p>
				</div>

				{/* Optimized image positioning */}
				<div className="absolute inset-0">
					<div
						ref={(el: HTMLDivElement | null) => {
							imagesRef.current[0] = el;
						}}
						className="absolute right-[5%] top-[10%] w-[55vh] h-[55vh]"
					>
						<Image
							src="/assets/about/shell_extra_cool.png"
							alt="Artistic Portrait 1"
							fill
							priority
							sizes="(max-width: 640px) 45vh, (max-width: 768px) 50vh, 55vh"
							className="object-contain transform-gpu hover:scale-105 transition-transform duration-300"
						/>
					</div>

					<div
						ref={(el: HTMLDivElement | null) => {
							imagesRef.current[1] = el;
						}}
						className="absolute right-[25%] bottom-[15%] w-[45vh] h-[45vh]"
					>
						<Image
							src="/assets/about/shell_3.png"
							alt="Artistic Portrait 2"
							fill
							priority
							sizes="(max-width: 640px) 35vh, (max-width: 768px) 40vh, 45vh"
							className="object-contain transform-gpu hover:scale-105 transition-transform duration-300"
						/>
					</div>

					<div
						ref={(el: HTMLDivElement | null) => {
							imagesRef.current[2] = el;
						}}
						className="absolute right-[5%] bottom-[5%] w-[45vh] h-[45vh]"
					>
						<Image
							src="/assets/about/shell_2.png"
							alt="Artistic Portrait 3"
							fill
							priority
							sizes="(max-width: 640px) 35vh, (max-width: 768px) 40vh, 45vh"
							className="object-contain transform-gpu hover:scale-105 transition-transform duration-300"
						/>
					</div>
				</div>

				{/* Enhanced social links with improved positioning */}
				<div
					ref={socialsRef}
					className="absolute bottom-8 left-8 z-30"
				>
					<div className="flex gap-4">
						<a
							href="https://www.linkedin.com/in/shelsey-boermans-207147200/"
							target="_blank"
							rel="noopener noreferrer"
							className="group relative bg-white/95 p-3 rounded-full border-2 border-black shadow-lg 
								hover:bg-white hover:scale-110 transition-all duration-300"
							aria-label="Visit LinkedIn Profile"
						>
							<Linkedin
								size={24}
								className="text-black group-hover:scale-110 transition-transform duration-300"
							/>
						</a>
						<a
							href="https://www.instagram.com/the_shell_sea_/"
							target="_blank"
							rel="noopener noreferrer"
							className="group relative bg-white/95 p-3 rounded-full border-2 border-black shadow-lg 
								hover:bg-white hover:scale-110 transition-all duration-300"
							aria-label="Visit Instagram Profile"
						>
							<Instagram
								size={24}
								className="text-black group-hover:scale-110 transition-transform duration-300"
							/>
						</a>
					</div>
				</div>
			</div>

			{/* Optimized particle effects */}
			{Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
				<div
					key={i}
					ref={(el: HTMLDivElement | null) => {
						particlesRef.current[i] = el;
					}}
					className="absolute w-2 h-2 rounded-full bg-white/15 backdrop-blur-sm"
					style={{
						left: `${Math.random() * 90 + 5}%`,
						top: `${Math.random() * 90 + 5}%`,
						transform: `scale(${Math.random() * 1.2 + 0.3})`,
					}}
				/>
			))}
		</section>
	);
}