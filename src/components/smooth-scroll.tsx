"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { type ReactNode, Suspense, useEffect, useRef, useState } from "react";

// Leaves room for the 64px sticky header when gliding to #anchors.
const HEADER_OFFSET = -80;

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduce;
}

/** A new page starts at the top, unless the link points at an #anchor. */
function ResetOnNavigate() {
  const lenis = useLenis();
  const pathname = usePathname();
  const first = useRef(true);
  // biome-ignore lint/correctness/useExhaustiveDependencies: a pathname change is the trigger
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname, lenis]);
  return null;
}

/** Smooth scrolling for the whole site; plain scrolling when the user prefers reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <ReactLenis
      root
      options={{
        smoothWheel: !reduce,
        anchors: reduce ? { offset: HEADER_OFFSET, immediate: true } : { offset: HEADER_OFFSET },
      }}
    >
      {/* reads the URL, so it must not block prerendering */}
      <Suspense fallback={null}>
        <ResetOnNavigate />
      </Suspense>
      {children}
    </ReactLenis>
  );
}
