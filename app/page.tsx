"use client";

import React, { useEffect, useRef } from "react";
import AboutMe from "./components/AboutMe";
import BeautyAndEditorial from "./components/BeautyAndEditorial";
import FaceAndBodypaint from './components/FaceAndBodypaint';
import SFXAndGrime from './components/SfxAndGrime';
import { initMainPageAnimations } from "@/utils/animations";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanup = initMainPageAnimations({
      main: mainRef.current,
      horizontal: horizontalRef.current,
      sections: sectionsRef.current
    });

    return cleanup;
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