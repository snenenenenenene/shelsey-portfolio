"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeJSImage from "./ThreeJSImage";
import MorphingGradientBackground from "./MorphingGradientBackground";
import Marquee from "react-fast-marquee";

gsap.registerPlugin(ScrollTrigger);

// Reorganized and grouped images for better visual flow
const images = [
	// Group 1: Vertical portraits
	{ id: 1, src: "over_the_top_glamour_1.jpg", alt: "Over the Top Glamour 1", orientation: "vertical" },
	{ id: 3, src: "over_the_top_glamour_3.jpg", alt: "Over the Top Glamour 3", orientation: "vertical" },
	{ id: 2, src: "over_the_top_glamour_2.jpg", alt: "Over the Top Glamour 2", orientation: "vertical" },

	// Group 2: Colorful compositions
	{ id: 5, src: "colorful_trend.jpg", alt: "Colorful Trend", orientation: "horizontal" },
	{ id: 8, src: "lilac_makeup.jpg", alt: "Lilac Makeup", orientation: "vertical" },
	{ id: 6, src: "experimental_1.jpg", alt: "Experimental 1", orientation: "horizontal" },

	// Group 3: Artistic shots
	{ id: 9, src: "new_retro.jpg", alt: "New Retro", orientation: "vertical" },
	{ id: 4, src: "retro_60s.jpg", alt: "Retro 60s", orientation: "horizontal" },
	{ id: 7, src: "experimental_2.jpg", alt: "Experimental 2", orientation: "vertical" },

	// Group 4: Bold looks
	{ id: 10, src: "ornamental.jpg", alt: "Ornamental", orientation: "vertical" },
	{ id: 11, src: "retro_80s_1.jpg", alt: "Retro 80s 1", orientation: "horizontal" },
	{ id: 12, src: "retro_80s_2.jpg", alt: "Retro 80s 2", orientation: "vertical" },
];

const groupedImages = images.reduce((acc, _, index) => {
	if (index % 3 === 0) {
		acc.push(images.slice(index, index + 3));
	}
	return acc;
}, [] as typeof images[]);

export default function BeautyAndEditorial() {
	const containerRef = useRef<HTMLDivElement>(null);
	const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
	const currentGroupRef = useRef(0);
	const isAnimatingRef = useRef(false);
	const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const lastWheelTime = useRef(Date.now());
	const wheelDeltaY = useRef(0);
	const hasReachedEndRef = useRef(false);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const cards = cardsRef.current.filter(Boolean);
		const totalGroups = groupedImages.length;

		const scrollHeight = window.innerHeight * totalGroups;
		container.style.height = `${scrollHeight}px`;

		const snapToGroup = (groupIndex: number) => {
			if (isAnimatingRef.current || groupIndex === currentGroupRef.current) return;
			isAnimatingRef.current = true;

			const currentCards = groupedImages[currentGroupRef.current].map(
				(_, i) => cards[currentGroupRef.current * 3 + i]
			);
			const nextCards = groupedImages[groupIndex].map(
				(_, i) => cards[groupIndex * 3 + i]
			);

			// Hide all other cards
			cards.forEach((card, i) => {
				if (!currentCards.includes(card) && !nextCards.includes(card)) {
					gsap.set(card, { opacity: 0 });
				}
			});

			// Fade out current group
			gsap.to(currentCards, {
				opacity: 0,
				scale: 0.8,
				duration: 0.4,
				ease: "power2.inOut",
				stagger: 0.1,
			});

			// Fade in next group
			nextCards.forEach((card, i) => {
				if (card) {
					const xOffset = i === 1 ? 0 : i === 0 ? -window.innerWidth * 0.25 : window.innerWidth * 0.25;
					const rotation = i === 1 ? 0 : i === 0 ? 2 : -2;

					gsap.fromTo(card,
						{
							opacity: 0,
							scale: 0.8,
							x: xOffset,
							rotation: rotation,
						},
						{
							opacity: 1,
							scale: 1,
							x: xOffset,
							rotation: rotation,
							duration: 0.5,
							delay: 0.2 + i * 0.1,
							ease: "power2.out",
							onComplete: () => {
								if (i === 1) {
									isAnimatingRef.current = false;
									currentGroupRef.current = groupIndex;
									hasReachedEndRef.current = groupIndex === totalGroups - 1;
								}
							}
						}
					);
				}
			});
		};

		// Set initial states
		groupedImages[0].forEach((_, i) => {
			const card = cards[i];
			if (card) {
				const xOffset = i === 1 ? 0 : i === 0 ? -window.innerWidth * 0.2 : window.innerWidth * 0.2;
				const rotation = i === 1 ? 0 : i === 0 ? 2 : -2;

				gsap.set(card, {
					opacity: 1,
					scale: 1,
					x: xOffset,
					rotation: rotation,
				});
			}
		});

		// Hide other cards
		cards.slice(3).forEach(card => {
			if (card) gsap.set(card, { opacity: 0 });
		});

		const handleWheel = (e: WheelEvent) => {
			if (hasReachedEndRef.current && e.deltaY > 0) return;
			e.preventDefault();

			const now = Date.now();
			const timeDiff = now - lastWheelTime.current;

			if (timeDiff > 150) {
				wheelDeltaY.current = 0;
			}

			wheelDeltaY.current += Math.abs(e.deltaY);
			lastWheelTime.current = now;

			if (wheelTimeoutRef.current) {
				clearTimeout(wheelTimeoutRef.current);
			}

			wheelTimeoutRef.current = setTimeout(() => {
				if (wheelDeltaY.current > 50) {
					let nextGroup = currentGroupRef.current;
					if (e.deltaY > 0 && nextGroup < totalGroups - 1) {
						nextGroup++;
					} else if (e.deltaY < 0 && nextGroup > 0) {
						nextGroup--;
					}

					snapToGroup(nextGroup);
				}
				wheelDeltaY.current = 0;
			}, 30);
		};

		container.addEventListener('wheel', handleWheel, { passive: false });

		return () => {
			container.removeEventListener('wheel', handleWheel);
			if (wheelTimeoutRef.current) {
				clearTimeout(wheelTimeoutRef.current);
			}
		};
	}, []);

	// ... (previous imports and setup remain the same)

	return (
		<section
			ref={containerRef}
			className="relative w-screen border-b-4 border-black bg-light-purple overflow-hidden"
		>
			<div className="sticky top-0 h-screen overflow-hidden">
				<MorphingGradientBackground />

				<div className="absolute top-0 left-0 w-full z-10">
					<Marquee
						direction="right"
						speed={50}
						className="w-screen h-48 text-[10rem] font-rumble"
					>
						BEAUTY &amp; EDITORIAL &amp;
					</Marquee>
				</div>

				<div className="absolute inset-0 flex items-center justify-center">
					<div className="relative w-[90vw] h-[70vh]">
						{images.map((image, index) => (
							<div
								key={image.id}
								ref={el => cardsRef.current[index] = el}
								className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
								style={{
									width: image.orientation === 'vertical' ? '20%' : '25%',
									height: '100%',
									opacity: 0,
								}}
							>
								<ThreeJSImage
									src={`/assets/beauty_and_editorial/${image.src}`}
									alt={image.alt}
									priority={index < 3}
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