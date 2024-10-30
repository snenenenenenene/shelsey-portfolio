"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

const MorphingGradientBackground = () => {
	const interBubbleRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let curX = 0;
		let curY = 0;
		let tgX = 0;
		let tgY = 0;

		function move() {
			if (interBubbleRef.current) {
				curX += (tgX - curX) / 20;
				curY += (tgY - curY) / 20;
				interBubbleRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
			}
			requestAnimationFrame(move);
		}

		window.addEventListener('mousemove', (event) => {
			tgX = event.clientX;
			tgY = event.clientY;
		});

		move();

		return () => {
			window.removeEventListener('mousemove', () => { });
		};
	}, []);

	return (
		<div className="absolute inset-0 overflow-hidden">
			<svg className="hidden">
				<filter id="goo">
					<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
					<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
					<feBlend in="SourceGraphic" in2="goo" />
				</filter>
			</svg>
			<div className="gradients-container absolute inset-0" style={{ filter: 'url(#goo) blur(40px)' }}>
				<div className="g1 absolute rounded-full" style={{
					width: '80%', height: '80%',
					top: '10%', left: '10%',
					background: 'radial-gradient(circle at center, rgba(18, 113, 255, 0.8) 0, rgba(18, 113, 255, 0) 50%)',
					mixBlendMode: 'hard-light',
					animation: 'moveVertical 30s ease infinite'
				}} />
				<div className="g2 absolute rounded-full" style={{
					width: '80%', height: '80%',
					top: '10%', left: '10%',
					background: 'radial-gradient(circle at center, rgba(221, 74, 255, 0.8) 0, rgba(221, 74, 255, 0) 50%)',
					mixBlendMode: 'hard-light',
					animation: 'moveInCircle 20s reverse infinite'
				}} />
				<div className="g3 absolute rounded-full" style={{
					width: '80%', height: '80%',
					top: '30%', left: '-10%',
					background: 'radial-gradient(circle at center, rgba(100, 220, 255, 0.8) 0, rgba(100, 220, 255, 0) 50%)',
					mixBlendMode: 'hard-light',
					animation: 'moveInCircle 40s linear infinite'
				}} />
				<div className="g4 absolute rounded-full" style={{
					width: '80%', height: '80%',
					top: '10%', left: '10%',
					background: 'radial-gradient(circle at center, rgba(200, 50, 50, 0.8) 0, rgba(200, 50, 50, 0) 50%)',
					mixBlendMode: 'hard-light',
					animation: 'moveHorizontal 40s ease infinite',
					opacity: 0.7
				}} />
				<div className="g5 absolute rounded-full" style={{
					width: '160%', height: '160%',
					top: '-30%', left: '-30%',
					background: 'radial-gradient(circle at center, rgba(180, 180, 50, 0.8) 0, rgba(180, 180, 50, 0) 50%)',
					mixBlendMode: 'hard-light',
					animation: 'moveInCircle 20s ease infinite'
				}} />
				<div ref={interBubbleRef} className="interactive absolute rounded-full" style={{
					width: '100%', height: '100%',
					top: '-50%', left: '-50%',
					background: 'radial-gradient(circle at center, rgba(140, 100, 255, 0.8) 0, rgba(140, 100, 255, 0) 50%)',
					mixBlendMode: 'hard-light',
					opacity: 0.7
				}} />
			</div>
		</div>
	);
};

export default function BeautyAndEditorial() {
	const containerRef = useRef(null);
	const cardsRef = useRef([]);

	useEffect(() => {
		const container = containerRef.current;
		const cards = cardsRef.current;
		const totalCards = cards.length;

		function flickCard(card: any) {
			const randomAngle = (Math.random() - 0.5) * 60;
			const xMove = (Math.random() - 0.5) * window.innerWidth;
			const yMove = -window.innerHeight;

			gsap.to(card, {
				x: xMove,
				y: yMove,
				rotation: randomAngle,
				scale: 0.8,
				opacity: 0,
				duration: 0.5,
				ease: "power2.in",
			});
		}

		function updateCardProperties() {
			cards.forEach((card, index) => {
				const rect = card.getBoundingClientRect();
				const centerY = rect.top + rect.height / 2;
				const viewportHeight = window.innerHeight;
				const distanceFromTop = Math.max(0, centerY);
				const progress = 1 - (distanceFromTop / viewportHeight);

				gsap.to(card, {
					scale: 0.8 + (0.2 * progress),
					filter: `brightness(${0.5 + 0.5 * progress})`,
					duration: 0.1,
					ease: "none",
				});
			});
		}

		cards.forEach((card, index) => {
			const randomTilt = (Math.random() - 0.5) * 10;

			gsap.set(card, {
				zIndex: totalCards - index,
				rotation: randomTilt,
				scale: 0.8,
				filter: "brightness(0.5)",
			});

			ScrollTrigger.create({
				trigger: container,
				start: `top+=${index * (100 / totalCards)}% top`,
				end: `top+=${(index + 1) * (100 / totalCards)}% top`,
				onEnter: () => flickCard(card),
				onEnterBack: () => {
					gsap.to(card, {
						x: 0,
						y: 0,
						rotation: randomTilt,
						opacity: 1,
						duration: 0.5,
						ease: "power2.out",
						onComplete: updateCardProperties,
					});
				},
				onUpdate: updateCardProperties,
			});
		});

		ScrollTrigger.create({
			trigger: container,
			start: "top top",
			end: "bottom bottom",
			onUpdate: updateCardProperties,
		});

		return () => {
			ScrollTrigger.getAll().forEach(trigger => trigger.kill());
		};
	}, []);

	return (
		<div ref={containerRef} className="h-[500vh] relative">
			<MorphingGradientBackground />
			<div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
				<div className="w-[80%] h-[80%] relative z-10">
					{images.map((image, index) => (
						<div
							key={image.id}
							ref={el => cardsRef.current[index] = el}
							className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full"
						>
							<img
								src={`/assets/beauty_and_editorial/${image.src}`}
								alt={image.alt}
								className="w-full h-full object-contain"
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}