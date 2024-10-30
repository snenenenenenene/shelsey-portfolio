"use client";

import React, { useState, useEffect, useCallback } from 'react';

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
	const [mousePosition, setMousePosition] = useState({ x: '50%', y: '50%' });
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const handleMouseMove = useCallback((event: any) => {
		const x = (event.clientX / window.innerWidth) * 100;
		const y = (event.clientY / window.innerHeight) * 100;
		setMousePosition({ x: `${x}%`, y: `${y}%` });
	}, []);

	const handleImageClick = useCallback(() => {
		setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
	}, []);

	useEffect(() => {
		window.addEventListener('mousemove', handleMouseMove);
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, [handleMouseMove]);

	const maskStyle = {
		maskImage: `radial-gradient(circle at ${mousePosition.x} ${mousePosition.y}, transparent 40px, black 150px)`,
		WebkitMaskImage: `radial-gradient(circle at ${mousePosition.x} ${mousePosition.y}, transparent 40px, black 150px)`,
	};

	return (
		<section id="sfx-and-grime" className="w-screen h-screen flex-shrink-0 bg-black flex items-center justify-center overflow-hidden">
			<div className="relative w-full h-full flex items-center justify-center cursor-pointer" onClick={handleImageClick}>
				<img
					className="max-w-full max-h-full object-contain z-20"
					src={images[currentImageIndex]}
					alt={`SFX and Grime ${currentImageIndex + 1}`}
				/>
				<div
					className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 z-30 pointer-events-none"
					style={maskStyle}
				></div>
			</div>
		</section>
	);
}