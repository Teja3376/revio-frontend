"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Osmo-style parallax. Mark children with data-parallax-layer="<0–100>": while the
 * container scrolls out of view, each layer moves down by that percent of its height,
 * so higher numbers look farther away. Does nothing with reduced motion.
 */
export function ParallaxScrolling({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0 },
    });
    for (const layer of root.querySelectorAll<HTMLElement>("[data-parallax-layer]")) {
      timeline.to(layer, { yPercent: Number(layer.dataset.parallaxLayer), ease: "none" }, 0);
    }

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={ref} className={cn("relative isolate overflow-hidden", className)}>
      {children}
    </div>
  );
}
