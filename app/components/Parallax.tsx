"use client"
import { useWindowSize } from "@studio-freight/hamo";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";

export function Parallax({ className, children, speed = 1, id = "parallax" }: {
	className?: string;
	children: React.ReactNode;
	speed?: number;
	id?: string;
}) {
	const trigger = useRef();
	const target: any = useRef();
	const timeline: any = useRef();
	const { width: windowWidth }: any = useWindowSize();

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger);

		const y = windowWidth * speed * 0.1;
		const setY = gsap.quickSetter(target.current, "y", "px");

		timeline.current = gsap.timeline({
			scrollTrigger: {
				id: id,
				trigger: trigger.current,
				scrub: true,
				start: "top bottom",
				end: "bottom top",
				onUpdate: (e) => {
					setY(e.progress * y);
				},
			},
		});

		return () => {
			timeline?.current?.kill();
		};
	}, [id, speed, windowWidth]);

	return (
		<div ref={trigger as any} className={className}>
			<div ref={target}>{children}</div>
		</div>
	);
}
