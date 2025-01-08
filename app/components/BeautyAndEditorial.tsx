"use client";

import React, { useEffect, useRef, useState } from "react";
import ThreeJSImage from "./ThreeJSImage";
import MorphingGradientBackground from "./MorphingGradientBackground";
import Marquee from "react-fast-marquee";
import { initBeautyEditorialAnimations } from "@/utils/animations";

const images = [
	{ id: 1, src: "over_the_top_glamour_1.jpg", alt: "Over the Top Glamour 1" },
	{ id: 2, src: "over_the_top_glamour_2.jpg", alt: "Over the Top Glamour 2" },
	{ id: 3, src: "over_the_top_glamour_3.jpg", alt: "Over the Top Glamour 3" },
	{ id: 4, src: "colorful_trend.jpg", alt: "Colorful Trend" },
	{ id: 5, src: "lilac_makeup.jpg", alt: "Lilac Makeup" },
	{ id: 6, src: "experimental_1.jpg", alt: "Experimental 1" },
	{ id: 7, src: "new_retro.jpg", alt: "New Retro" },
	{ id: 8, src: "retro_60s.jpg", alt: "Retro 60s" },
	{ id: 9, src: "experimental_2.jpg", alt: "Experimental 2" },
];
export default function BeautyAndEditorial() {
	const containerRef = useRef<HTMLDivElement>(null);
	const cardsRef = useRef<HTMLDivElement[]>([]);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.matchMedia("(max-width: 768px)").matches);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		const cleanup = initBeautyEditorialAnimations(
			containerRef.current,
			cardsRef.current.filter(Boolean) as HTMLDivElement[],
			isMobile
		);
		return cleanup;
	}, [isMobile]);

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
					<div
						className={`relative ${isMobile
							? 'w-[85vw] h-[70vh]'
							: 'w-[95vw] h-[85vh] xl:w-[90vw] 2xl:w-[85vw]'
							}`}
					>
						{images.map((image, index) => (
							<div
								key={image.id}
								ref={(el) => (cardsRef.current[index] = el as HTMLDivElement)}
								className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                  ${isMobile
										? 'w-full h-full'
										: `w-[35%] xl:w-[40%] 2xl:w-[45%] h-full ${index === 0 ? 'opacity-100' : 'opacity-0'}`
									}`}
								style={{
									transformStyle: 'preserve-3d',
									backfaceVisibility: 'hidden'
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