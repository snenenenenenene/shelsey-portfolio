"use client";

import React from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";

const images = [
	"/assets/face_and_bodypaint/bodypaint_Georgia_O_Keeffe.jpg",
	"/assets/face_and_bodypaint/bodypaint_water.jpg",
	"/assets/face_and_bodypaint/grime_clown.jpg",
	"/assets/face_and_bodypaint/grime_monster.jpg",
	"/assets/face_and_bodypaint/muscles.jpg",
];

export default function FaceAndBodypaint() {
	// Calculate the exact width needed for the section
	const totalWidth = `${images.length * 55 + (images.length - 1) * 1 + 1}vw`;

	return (
		<section id="face-and-bodypaint" className="h-screen flex-shrink-0 relative bg-light-blue" style={{ width: totalWidth }}>
			<div className="absolute top-0 left-0 w-full z-10">
				<Marquee direction="right" autoFill={true} className="w-screen text-black bg-light-blue green h-48 text-[10rem] font-rumble">
					FACE &amp; BODYPAINT &amp;
				</Marquee>
			</div>

			<div className="pt-48 h-[calc(100vh-1rem)]">
				<div className="flex gap-4 pl-4 h-full">
					{images.map((imgSrc, index) => (
						<div key={`img-${index}`} className="w-[55vw] h-full flex-shrink-0 relative">
							<Image
								src={imgSrc}
								alt={`Bodypaint ${index + 1}`}
								fill
								sizes="55vw"
								priority={index < 2}
								style={{ objectFit: 'cover' }}
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}