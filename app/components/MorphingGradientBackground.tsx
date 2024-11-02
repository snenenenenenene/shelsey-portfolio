"use client";

import { useRef, useEffect } from "react";

export default function MorphingGradientBackground() {
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

		const handleMouseMove = (event: MouseEvent) => {
			tgX = event.clientX;
			tgY = event.clientY;
		};

		window.addEventListener('mousemove', handleMouseMove);
		const animationFrame = requestAnimationFrame(move);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			cancelAnimationFrame(animationFrame);
		};
	}, []);

	return (
		<div className="absolute inset-0 overflow-hidden">
			<svg className="hidden">
				<filter id="goo">
					<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
					<feColorMatrix
						in="blur"
						mode="matrix"
						values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
						result="goo"
					/>
					<feBlend in="SourceGraphic" in2="goo" />
				</filter>
			</svg>
			<div
				className="gradients-container absolute inset-0"
				style={{ filter: 'url(#goo) blur(40px)' }}
			>
				<div
					className="g1 absolute rounded-full"
					style={{
						width: '80%',
						height: '80%',
						top: '10%',
						left: '10%',
						background: 'radial-gradient(circle at center, rgba(18, 113, 255, 0.8) 0, rgba(18, 113, 255, 0) 50%)',
						mixBlendMode: 'hard-light',
						animation: 'moveVertical 30s ease infinite'
					}}
				/>
				<div
					className="g2 absolute rounded-full"
					style={{
						width: '80%',
						height: '80%',
						top: '10%',
						left: '10%',
						background: 'radial-gradient(circle at center, rgba(221, 74, 255, 0.8) 0, rgba(221, 74, 255, 0) 50%)',
						mixBlendMode: 'hard-light',
						animation: 'moveInCircle 20s reverse infinite'
					}}
				/>
				<div
					className="g3 absolute rounded-full"
					style={{
						width: '80%',
						height: '80%',
						top: '30%',
						left: '-10%',
						background: 'radial-gradient(circle at center, rgba(100, 220, 255, 0.8) 0, rgba(100, 220, 255, 0) 50%)',
						mixBlendMode: 'hard-light',
						animation: 'moveInCircle 40s linear infinite'
					}}
				/>
				<div
					ref={interBubbleRef}
					className="interactive absolute rounded-full"
					style={{
						width: '100%',
						height: '100%',
						top: '-50%',
						left: '-50%',
						background: 'radial-gradient(circle at center, rgba(140, 100, 255, 0.8) 0, rgba(140, 100, 255, 0) 50%)',
						mixBlendMode: 'hard-light',
						opacity: 0.7
					}}
				/>
			</div>
		</div>
	);
}