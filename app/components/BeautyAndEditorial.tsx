"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import ThreeJSImage from "./ThreeJSImage";
import MorphingGradientBackground from "./MorphingGradientBackground";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const images = [
	{ id: 1, src: "over_the_top_glamour_1.jpg", alt: "Over the Top Glamour 1" },
	{ id: 2, src: "over_the_top_glamour_2.jpg", alt: "Over the Top Glamour 2" },
	{ id: 3, src: "over_the_top_glamour_3.jpg", alt: "Over the Top Glamour 3" },
	{ id: 4, src: "retro_60s.jpg", alt: "Retro 60s" },
	{ id: 5, src: "colorful_trend.jpg", alt: "Colorful Trend" },
	{ id: 6, src: "experimental_1.jpg", alt: "Experimental 1" },
	{ id: 7, src: "experimental_2.jpg", alt: "Experimental 2" },
	{ id: 8, src: "lilac_makeup.jpg", alt: "Lilac Makeup" },
	{ id: 9, src: "new_retro.jpg", alt: "New Retro" },
	{ id: 10, src: "ornamental.jpg", alt: "Ornamental" },
	{ id: 11, src: "retro_80s_1.jpg", alt: "Retro 80s 1" },
	{ id: 12, src: "retro_80s_2.jpg", alt: "Retro 80s 2" },
];

export default function BeautyAndEditorial() {
	const containerRef = useRef<HTMLDivElement>(null);
	const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
	const currentIndexRef = useRef(0);
	const isAnimatingRef = useRef(false);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const cards = cardsRef.current.filter(Boolean);
		const totalCards = cards.length;
		let scrollTween: gsap.core.Tween;

		// Set up scroll sections
		const scrollHeight = window.innerHeight * (totalCards + 1); // Added +1 to ensure we reach all cards
		container.style.height = `${scrollHeight}px`;

		const snapToIndex = (index: number) => {
			if (isAnimatingRef.current) return;
			isAnimatingRef.current = true;

			const y = index * window.innerHeight;
			const startCard = cards[currentIndexRef.current];
			const targetCard = cards[index];

			if (startCard && targetCard) {
				// Animate current card out
				gsap.to(startCard, {
					x: (Math.random() - 0.5) * window.innerWidth * 2,
					y: index > currentIndexRef.current ? -window.innerHeight * 1.5 : window.innerHeight * 1.5,
					rotation: (Math.random() - 0.5) * 60,
					scale: 0.8,
					opacity: 0,
					duration: 0.8,
					ease: "power2.in",
				});

				// Animate target card in
				gsap.fromTo(targetCard,
					{
						x: (Math.random() - 0.5) * window.innerWidth * 2,
						y: index > currentIndexRef.current ? window.innerHeight * 1.5 : -window.innerHeight * 1.5,
						rotation: (Math.random() - 0.5) * 60,
						scale: 0.8,
						opacity: 0,
					},
					{
						x: 0,
						y: 0,
						rotation: (Math.random() - 0.5) * 20,
						scale: 1,
						opacity: 1,
						duration: 0.8,
						ease: "power2.out",
						onComplete: () => {
							isAnimatingRef.current = false;
						}
					}
				);
			}

			currentIndexRef.current = index;
		};

		// Set up initial card states
		cards.forEach((card, index) => {
			if (!card) return;
			gsap.set(card, {
				zIndex: totalCards - index,
				rotation: (Math.random() - 0.5) * 20,
				scale: 1,
				opacity: index === 0 ? 1 : 0,
				filter: "brightness(0.8)",
			});
		});

		// Handle wheel events for snapping
		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();

			if (isAnimatingRef.current) return;

			const delta = e.deltaY;
			let nextIndex = currentIndexRef.current;

			if (delta > 0 && nextIndex < totalCards - 1) {
				nextIndex++;
			} else if (delta < 0 && nextIndex > 0) {
				nextIndex--;
			}

			if (nextIndex !== currentIndexRef.current) {
				snapToIndex(nextIndex);
			}
		};

		// Handle keyboard navigation
		const handleKeyDown = (e: KeyboardEvent) => {
			if (isAnimatingRef.current) return;

			let nextIndex = currentIndexRef.current;

			if (e.key === 'ArrowUp' && nextIndex > 0) {
				nextIndex--;
				snapToIndex(nextIndex);
			} else if (e.key === 'ArrowDown' && nextIndex < totalCards - 1) {
				nextIndex++;
				snapToIndex(nextIndex);
			}
		};

		// Add event listeners
		container.addEventListener('wheel', handleWheel, { passive: false });
		window.addEventListener('keydown', handleKeyDown);

		// Set up ScrollTrigger
		const st = ScrollTrigger.create({
			trigger: container,
			start: "top top",
			end: `+=${scrollHeight}`,
			onUpdate: (self) => {
				if (!isAnimatingRef.current) {
					const newIndex = Math.round(self.progress * (totalCards - 1));
					if (newIndex !== currentIndexRef.current) {
						snapToIndex(newIndex);
					}
				}
			}
		});

		return () => {
			container.removeEventListener('wheel', handleWheel);
			window.removeEventListener('keydown', handleKeyDown);
			if (st) st.kill();
			if (scrollTween) scrollTween.kill();
		};
	}, []);

	return (
		<section ref={containerRef} className="relative w-screen border-b-4 border-black bg-light-purple">
			<div className="sticky top-0 h-screen overflow-hidden">
				<MorphingGradientBackground />
				<div className="absolute inset-0 flex items-start justify-center pt-20"> {/* Changed to items-start and pt-20 */}
					<div className="w-[60vw] h-[60vh] md:w-[55vw] md:h-[55vh] lg:w-[50vw] lg:h-[50vh] relative">
						{images.map((image, index) => (
							<div
								key={image.id}
								ref={el => cardsRef.current[index] = el}
								className="absolute inset-0 w-full h-full"
								style={{
									perspective: '1000px',
									transformStyle: 'preserve-3d',
								}}
							>
								<ThreeJSImage
									src={`/assets/beauty_and_editorial/${image.src}`}
									alt={image.alt}
									priority={index < 2}
									className="w-full h-full"
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}