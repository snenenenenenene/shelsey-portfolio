"use client";

import React, { useEffect, useRef } from "react";
import AboutMe from "./components/AboutMe";
import BeautyAndEditorial from "./components/BeautyAndEditorial";
import FaceAndBodypaint from './components/FaceAndBodypaint';
import SFXAndGrime from './components/SfxAndGrime';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef(null);
  const horizontalRef = useRef(null);
  const sectionsRef = useRef(null);

  useEffect(() => {
    const sections = gsap.utils.toArray("main > section");

    sections.forEach((section, i) => {
      if (i !== 2) { // Skip FaceAndBodypaint section
        ScrollTrigger.create({
          trigger: section as any,
          start: "top top",
          pin: true,
          pinSpacing: false,
        });
      }
    });

    // Horizontal scroll for FaceAndBodypaint and SFXAndGrime
    const horizontalScroll = gsap.to(sectionsRef.current, {
      x: () => -(sectionsRef.current.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: horizontalRef.current,
        start: "top top",
        end: () => `+=${sectionsRef.current.scrollWidth - window.innerWidth}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Prevent scrolling beyond bounds
          if (self.progress === 1) {
            window.scrollTo(0, self.end - 1);
          }
          if (self.progress === 0 && self.direction < 0) {
            window.scrollTo(0, self.start - 1);
          }
        }
      }
    });

    return () => {
      horizontalScroll.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <main ref={mainRef} className="relative">
      <div className="grain absolute top-0 left-0 z-50 w-full h-full pointer-events-none" />
      <AboutMe />
      <BeautyAndEditorial />
      <div ref={horizontalRef} className="h-screen overflow-hidden">
        <div ref={sectionsRef} className="flex">
          <FaceAndBodypaint />
          <SFXAndGrime />
        </div>
      </div>
    </main>
  );
}