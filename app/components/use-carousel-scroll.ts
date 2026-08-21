"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface CarouselScroll {
  /** Attach to the scroll-snap container holding the slides. */
  viewportRef: React.RefObject<HTMLDivElement | null>;
  /** Index of the slide currently snapped into view. */
  activeIndex: number;
  /** Scrolls the given slide into view, smoothly where motion is allowed. */
  goTo: (index: number) => void;
}

/**
 * Tracks which slide a scroll-snap carousel is showing.
 *
 * Scroll position is the source of truth: the browser owns the motion (touch
 * swipe, momentum, snapping) and this hook only observes where it landed. That
 * keeps one mechanism for touch and for the desktop chevrons, which call goTo.
 */
export function useCarouselScroll(total: number): CarouselScroll {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || total === 0) return;

    let frame = 0;
    let pending = false;
    const readActiveIndex = () => {
      pending = false;
      const { scrollLeft, clientWidth } = viewport;
      if (clientWidth === 0) return;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(Math.min(Math.max(index, 0), total - 1));
    };

    const onScroll = () => {
      // Coalesce the burst of events a single swipe produces. Tracked with a
      // separate flag because a synchronous callback clears it before
      // requestAnimationFrame has returned the handle.
      if (pending) return;
      pending = true;
      frame = requestAnimationFrame(readActiveIndex);
    };

    viewport.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      viewport.removeEventListener("scroll", onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [total]);

  // Clamp if the list shrinks out from under the current position.
  useEffect(() => {
    if (total > 0 && activeIndex > total - 1) setActiveIndex(total - 1);
  }, [total, activeIndex]);

  const goTo = useCallback((index: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.scrollTo({ left: index * viewport.clientWidth, behavior: "smooth" });
    // jsdom and reduced-motion settings may not fire a scroll event, so reflect
    // the intent immediately rather than waiting to observe it.
    setActiveIndex(index);
  }, []);

  return { viewportRef, activeIndex, goTo };
}
