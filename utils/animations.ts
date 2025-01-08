import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { random } from "gsap/gsap-core";

gsap.registerPlugin(ScrollTrigger);

// Types
export interface AnimationConfig {
  duration?: number;
  ease?: string;
  snapThreshold?: number;
  cardFlickForce?: {
    min: number;
    max: number;
  };
  rotationRange?: {
    min: number;
    max: number;
  };
}

export interface MainPageRefs {
  main: HTMLElement | null;
  horizontal: HTMLElement | null;
  sections: HTMLElement | null;
}

const DEFAULT_CONFIG: AnimationConfig = {
  duration: 0.5,
  ease: "power2.out",
  snapThreshold: 0.1,
  cardFlickForce: {
    min: -150,
    max: 150
  },
  rotationRange: {
    min: -45,
    max: 45
  }
};

// Global state for section control
const sectionState = {
  beautyCompleted: false,
  setBeautyCompleted: (value: boolean) => {
    sectionState.beautyCompleted = value;
    if (value) {
      ScrollTrigger.refresh();
    }
  }
};

// Utility functions
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// Main page animation initialization
export function initMainPageAnimations(
  refs: MainPageRefs,
  config: Partial<AnimationConfig> = {}
) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  if (!refs.main || !refs.horizontal || !refs.sections) {
    console.warn('Required refs are not available');
    return () => {};
  }

  const sections = gsap.utils.toArray("main > section");

  // Pin all sections with conditional scrolling
  sections.forEach((section, i) => {
    if (i !== 2) {
      ScrollTrigger.create({
        trigger: section as Element,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: false,
        onEnter: (self) => {
          // Prevent scrolling to next section if beauty isn't completed
          if (i === 1 && !sectionState.beautyCompleted) {
            self.scroll(self.start);
          }
        }
      });
    }
  });

  // Create context for horizontal scroll
  const ctx = gsap.context(() => {
    const horizontalScroll = gsap.to(refs.sections, {
      x: () => {
        if (!refs.sections) return 0;
        return -(refs.sections.scrollWidth - window.innerWidth);
      },
      ease: "none",
      scrollTrigger: {
        trigger: refs.horizontal,
        start: "top top",
        end: () => {
          if (!refs.sections) return "+=0";
          return `+=${refs.sections.scrollWidth - window.innerWidth}`;
        },
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (self.progress === 1) {
            window.scrollTo(0, self.end - 1);
          }
          if (self.progress === 0 && self.direction < 0) {
            window.scrollTo(0, self.start - 1);
          }
        }
      }
    });

    return () => horizontalScroll.kill();
  }, refs.main);

  const handleResize = () => {
    ScrollTrigger.refresh();
  };

  window.addEventListener('resize', handleResize);

  return () => {
    ctx.revert();
    ScrollTrigger.getAll().forEach(t => t.kill());
    window.removeEventListener('resize', handleResize);
  };
}

// Beauty & Editorial animations initialization
export const initBeautyEditorialAnimations = (
  container: HTMLElement | null,
  cards: HTMLElement[],
  isMobile: boolean,
  config: Partial<AnimationConfig> = {}
) => {
  if (!container) {
    console.warn('Container ref is not available');
    return () => {};
  }

  // Reset beauty section state
  sectionState.setBeautyCompleted(false);

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  if (isMobile) {
    return initMobileCardStack(container, cards, finalConfig);
  }
  return initDesktopGallery(container, cards, finalConfig);
};

// Mobile card stack implementation
function initMobileCardStack(
  container: HTMLElement, 
  cards: HTMLElement[],
  config: AnimationConfig
) {
  // Initial card stack setup
  cards.forEach((card, i) => {
    const rotation = randomRange(-3, 3);
    gsap.set(card, {
      zIndex: cards.length - i,
      rotation,
      y: i * -2,
      x: i * -1,
      opacity: 1
    });
  });

  let currentIndex = 0;
  let isAnimating = false;

  // Section scroll trigger
  const sectionTrigger = ScrollTrigger.create({
    trigger: container,
    start: "top top",
    end: `+=${window.innerHeight * 2}`,
    pin: true,
    anticipatePin: 1,
    onUpdate: (self) => {
      // Prevent scrolling until stack is complete
      if (!sectionState.beautyCompleted) {
        window.scrollTo(0, self.start);
      }
    }
  });

  // Card animation trigger
  const cardTrigger = ScrollTrigger.create({
    trigger: container,
    start: "top top",
    end: `+=${cards.length * 100}`,
    onUpdate: (self) => {
      if (isAnimating || sectionState.beautyCompleted) return;

      const progress = self.progress;
      const nextIndex = Math.min(
        Math.floor(progress * cards.length),
        cards.length - 1
      );

      if (nextIndex !== currentIndex) {
        isAnimating = true;

        // Card flick animation
        const direction = {
          x: randomRange(-window.innerWidth * 0.5, window.innerWidth * 0.5),
          y: -window.innerHeight * randomRange(0.5, 1),
          rotation: randomRange(-90, 90)
        };

        gsap.to(cards[currentIndex], {
          x: direction.x,
          y: direction.y,
          rotation: direction.rotation,
          opacity: 0,
          duration: 0.6,
          ease: "power2.in",
          onComplete: () => {
            isAnimating = false;
            
            // Handle completion
            if (currentIndex === cards.length - 1) {
              sectionState.setBeautyCompleted(true);
              sectionTrigger.kill();
            } else {
              // Snap to next card
              const nextScrollPosition = sectionTrigger.start + 
                ((currentIndex + 1) / cards.length) * window.innerHeight;
              window.scrollTo(0, nextScrollPosition);
            }
          }
        });

        // Adjust remaining cards
        cards.slice(currentIndex + 1).forEach((card, i) => {
          gsap.to(card, {
            y: i * -2,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        currentIndex = nextIndex;
      }
    }
  });

  // Scroll control
  let lastScrollTime = Date.now();
  let scrollTimeout: NodeJS.Timeout;

  const handleScroll = () => {
    const now = Date.now();
    const timeDiff = now - lastScrollTime;

    if (timeDiff < 300 && !sectionState.beautyCompleted) {
      window.scrollTo(0, sectionTrigger.start + 
        (currentIndex / cards.length) * window.innerHeight);
    }

    lastScrollTime = now;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (!sectionState.beautyCompleted) {
        window.scrollTo(0, sectionTrigger.start + 
          (currentIndex / cards.length) * window.innerHeight);
      }
    }, 100);
  };

  window.addEventListener('scroll', handleScroll);

  return () => {
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(scrollTimeout);
    sectionTrigger.kill();
    cardTrigger.kill();
  };
}

// Desktop gallery implementation
function initDesktopGallery(
  container: HTMLElement, 
  cards: HTMLElement[],
  config: AnimationConfig
) {
  const snapPoints = cards.map((_, i) => i / (cards.length - 1));
  
  const ctx = gsap.context(() => {
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "+=300%",
      pin: true,
      snap: snapPoints,
      onUpdate: (self) => {
        const progress = self.progress;
        cards.forEach((card, i) => {
          const cardProgress = (progress * (cards.length - 1)) - i;
          gsap.to(card, {
            opacity: 1 - Math.abs(cardProgress),
            scale: 1 - Math.abs(cardProgress) * 0.2,
            duration: config.duration,
            ease: config.ease
          });
        });
      },
      onLeave: () => {
        sectionState.setBeautyCompleted(true);
      }
    });
  }, container);

  return () => {
    ctx.revert();
  };
}