"use client";

import { Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const PARTICLE_COUNT = 20;

export default function AboutMe() {
	const containerRef = useRef<HTMLDivElement>(null);
	const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
	const textRef = useRef<HTMLDivElement>(null);
	const socialsRef = useRef<HTMLDivElement>(null);
	const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
	const brushStrokeRef = useRef<SVGPathElement>(null);

	useEffect(() => {
		// Initial animation timeline
		const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

		// Setup initial states
		gsap.set([imagesRef.current, textRef.current, socialsRef.current], {
			opacity: 0,
			y: 50
		});

		gsap.set(particlesRef.current, {
			opacity: 0,
			scale: 0,
			rotate: "random(-180, 180)"
		});

		// Animate particles
		tl.to(particlesRef.current, {
			opacity: 0.6,
			scale: 1,
			duration: 1,
			stagger: 0.05,
			rotate: "random(-180, 180)",
		})
			.to(textRef.current, {
				opacity: 1,
				y: 0,
				duration: 1.5,
				ease: "elastic.out(1, 0.5)"
			}, "-=0.5")
			.to(imagesRef.current, {
				opacity: 1,
				y: 0,
				duration: 1,
				stagger: {
					each: 0.2,
					ease: "power4.out"
				},
				rotate: "random(-10, 10)"
			}, "-=1")
			.to(socialsRef.current, {
				opacity: 1,
				y: 0,
				duration: 0.5
			}, "-=0.5");

		// Mouse parallax effect
		const handleMouseMove = (e: MouseEvent) => {
			const { clientX, clientY } = e;
			const x = (clientX / window.innerWidth - 0.5) * 20;
			const y = (clientY / window.innerHeight - 0.5) * 20;

			// Parallax for images
			imagesRef.current.forEach((image, index) => {
				if (image) {
					gsap.to(image, {
						x: x * (index + 1) * 0.5,
						y: y * (index + 1) * 0.5,
						rotateX: -y * 0.2,
						rotateY: x * 0.2,
						duration: 1,
						ease: "power2.out"
					});
				}
			});

			// Particles follow mouse with delay
			particlesRef.current.forEach((particle, i) => {
				if (particle) {
					gsap.to(particle, {
						x: x * (i % 3 + 1) * 0.3,
						y: y * (i % 3 + 1) * 0.3,
						duration: 2,
						ease: "power1.out",
						delay: i * 0.02
					});
				}
			});
		};

		window.addEventListener("mousemove", handleMouseMove);

		// Floating animation for particles
		particlesRef.current.forEach((particle, i) => {
			if (particle) {
				gsap.to(particle, {
					y: "random(-20, 20)",
					x: "random(-20, 20)",
					rotation: "random(-180, 180)",
					duration: "random(2, 4)",
					repeat: -1,
					yoyo: true,
					ease: "sine.inOut",
					delay: i * 0.1
				});
			}
		});

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	return (
		<section className="relative h-screen w-screen overflow-hidden bg-light-purple">
			{/* Particle effects */}
			{Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
				<div
					key={i}
					ref={el => particlesRef.current[i] = el}
					className="absolute w-2 h-2 rounded-full bg-white/30 backdrop-blur-sm"
					style={{
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
						transform: `scale(${Math.random() * 2 + 1})`,
					}}
				/>
			))}

			{/* Main content */}
			<div ref={containerRef} className="relative w-full h-full max-w-[2000px] mx-auto">
				{/* Background elements */}
				<div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-purple-900/10" />
				<div className="absolute left-[30%] top-[-4%] h-[100vh] w-[100vh] rounded-full bg-[#60367B]/50 blur-lg" />

				{/* Text content */}
				<div
					ref={textRef}
					className="absolute top-[15%] left-[10%] z-20"
				>
					<h1 className="text-[5rem] md:text-[6rem] lg:text-[7rem] leading-none font-super-funky font-outline text-[#A8F584]">
						Shelsey<br /> Boermans
					</h1>
					<p className="text-2xl md:text-3xl mt-4 font-super-funky text-light-blue relative">
						Makeup Artist
					</p>
				</div>

				{/* Images with creative positioning */}
				<div className="absolute inset-0">
					<div
						ref={el => imagesRef.current[0] = el}
						className="absolute left-[35%] bottom-[5%] w-[90vh] h-[90vh]"
					>
						<Image
							src="/assets/about/shell_extra_cool.png"
							alt="Artistic Portrait 1"
							fill
							priority
							className="object-contain transform-gpu hover:scale-105 transition-transform duration-300"
						/>
					</div>

					<div
						ref={el => imagesRef.current[1] = el}
						className="absolute left-[25%] bottom-[-4%] w-[60vh] h-[60vh]"
					>
						<Image
							src="/assets/about/shell_3.png"
							alt="Artistic Portrait 2"
							fill
							priority
							className="object-contain transform-gpu hover:scale-105 transition-transform duration-300"
						/>
					</div>

					<div
						ref={el => imagesRef.current[2] = el}
						className="absolute right-[15%] bottom-[-5%] w-[60vh] h-[60vh]"
					>
						<Image
							src="/assets/about/shell_2.png"
							alt="Artistic Portrait 3"
							fill
							priority
							className="object-contain transform-gpu hover:scale-105 transition-transform duration-300"
						/>
					</div>
				</div>

				{/* Enhanced social links */}
				<div
					ref={socialsRef}
					className="absolute bottom-10 left-10 z-30"
				>
					<div className="flex gap-6">
						<a
							href="https://www.linkedin.com/in/shelsey-boermans-207147200/"
							target="_blank"
							rel="noopener noreferrer"
							className="group relative bg-white/90 p-4 rounded-full border-2 border-black shadow-lg 
                       hover:bg-white hover:scale-110 transition-all duration-300"
							aria-label="Visit LinkedIn Profile"
						>
							<Linkedin
								size={32}
								className="text-black group-hover:scale-110 transition-transform duration-300"
							/>
							<span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                           transition-opacity duration-300 text-white text-sm whitespace-nowrap">
								Connect on LinkedIn
							</span>
						</a>
						<a
							href="https://www.instagram.com/the_shell_sea_/"
							target="_blank"
							rel="noopener noreferrer"
							className="group relative bg-white/90 p-4 rounded-full border-2 border-black shadow-lg 
                       hover:bg-white hover:scale-110 transition-all duration-300"
							aria-label="Visit Instagram Profile"
						>
							<Instagram
								size={32}
								className="text-black group-hover:scale-110 transition-transform duration-300"
							/>
							<span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                           transition-opacity duration-300 text-white text-sm whitespace-nowrap">
								Follow on Instagram
							</span>
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}