import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const m = vi.hoisted(() => {
  const trigger = { kill: vi.fn() };
  const timeline = { to: vi.fn(), kill: vi.fn(), scrollTrigger: trigger };
  const lenis = { on: vi.fn(), raf: vi.fn(), destroy: vi.fn() };
  return {
    trigger,
    timeline,
    lenis,
    Lenis: vi.fn(function makeLenis() {
      return lenis;
    }),
    gsap: {
      registerPlugin: vi.fn(),
      timeline: vi.fn(() => timeline),
      ticker: { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() },
    },
  };
});

vi.mock("gsap", () => ({ default: m.gsap, gsap: m.gsap }));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { update: vi.fn() } }));
vi.mock("lenis", () => ({ default: m.Lenis }));

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
  it("never starts Lenis or GSAP when reduced motion is on", () => {
    setReducedMotion(true);
    render(tree);
    expect(m.Lenis).not.toHaveBeenCalled();
    expect(m.gsap.timeline).not.toHaveBeenCalled();
  });

  it("moves each layer by its speed as yPercent", () => {
    setReducedMotion(false);
    const { container } = render(tree);
    const layers = container.querySelectorAll("[data-parallax-layer]");
    expect(m.timeline.to).toHaveBeenCalledWith(layers[0], { yPercent: 70, ease: "none" }, 0);
    expect(m.timeline.to).toHaveBeenCalledWith(layers[1], { yPercent: 10, ease: "none" }, 0);
  });

  it("starts once and cleans everything up on unmount", () => {
    setReducedMotion(false);
    const { unmount } = render(tree);
    expect(m.Lenis).toHaveBeenCalledTimes(1);
    expect(m.gsap.ticker.add).toHaveBeenCalledTimes(1);
    const tick = m.gsap.ticker.add.mock.calls[0][0];

    unmount();
    expect(m.lenis.destroy).toHaveBeenCalledTimes(1);
    expect(m.gsap.ticker.remove).toHaveBeenCalledWith(tick);
    expect(m.trigger.kill).toHaveBeenCalledTimes(1);
  });
});
