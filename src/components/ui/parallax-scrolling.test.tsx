import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const m = vi.hoisted(() => {
  const trigger = { kill: vi.fn() };
  const timeline = { to: vi.fn(), kill: vi.fn(), scrollTrigger: trigger };
  return {
    trigger,
    timeline,
    useLenis: vi.fn(),
    gsap: { registerPlugin: vi.fn(), timeline: vi.fn(() => timeline) },
    update: vi.fn(),
  };
});

vi.mock("gsap", () => ({ default: m.gsap, gsap: m.gsap }));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { update: m.update } }));
vi.mock("lenis/react", () => ({ useLenis: m.useLenis }));

import { ParallaxScrolling } from "./parallax-scrolling";

function setReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches: reduce }) as never;
}

const tree = (
  <ParallaxScrolling>
    <div data-parallax-layer="70" />
    <div data-parallax-layer="10" />
  </ParallaxScrolling>
);

beforeEach(() => vi.clearAllMocks());

describe("ParallaxScrolling", () => {
  it("keeps ScrollTrigger in step with the site's smooth scroll", () => {
    setReducedMotion(false);
    render(tree);
    expect(m.useLenis).toHaveBeenCalledWith(m.update);
  });

  it("never builds the timeline when reduced motion is on", () => {
    setReducedMotion(true);
    render(tree);
    expect(m.gsap.timeline).not.toHaveBeenCalled();
  });

  it("moves each layer by its speed as yPercent", () => {
    setReducedMotion(false);
    const { container } = render(tree);
    const layers = container.querySelectorAll("[data-parallax-layer]");
    expect(m.timeline.to).toHaveBeenCalledWith(layers[0], { yPercent: 70, ease: "none" }, 0);
    expect(m.timeline.to).toHaveBeenCalledWith(layers[1], { yPercent: 10, ease: "none" }, 0);
  });

  it("kills its trigger and timeline on unmount", () => {
    setReducedMotion(false);
    const { unmount } = render(tree);
    unmount();
    expect(m.trigger.kill).toHaveBeenCalledTimes(1);
    expect(m.timeline.kill).toHaveBeenCalledTimes(1);
  });
});
