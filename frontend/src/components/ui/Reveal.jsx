/**
 * What it does: Reveals headings, cards, and sections by rising upward out of a clipping container tied directly to scroll position.
 * Who uses it: Imported by pages and components across the website.
 * What it talks to: Uses browser scroll position and `prefers-reduced-motion` media query (no external animation library).
 */

import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  className = "",
  maxTranslateY = 110,
  delayOffsetPx = 0,
}) {
  const containerRef = useRef(null);
  const [offsetY, setOffsetY] = useState(maxTranslateY);
  const [scale, setScale] = useState(0.96);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frameId = null;

    const updatePosition = () => {
      frameId = null;
      if (mediaQuery.matches) {
        setOffsetY(0);
        setScale(1);
        setOpacity(1);
        return;
      }

      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 800;

      // Deep, immersive scroll-scrubbing window:
      // Starts rising as soon as it touches the bottom of the viewport (105%)
      // and continues rising smoothly until it reaches the upper-middle reading zone (42%).
      const startLine = viewportHeight * 1.05 - delayOffsetPx;
      const endLine = viewportHeight * 0.42 - delayOffsetPx * 0.5;

      if (rect.top <= endLine) {
        setOffsetY(0);
        setScale(1);
        setOpacity(1);
      } else if (rect.top >= startLine) {
        setOffsetY(maxTranslateY);
        setScale(0.96);
        setOpacity(0);
      } else {
        const progress = (startLine - rect.top) / (startLine - endLine);
        const clamped = Math.max(0, Math.min(1, progress));
        // Smooth cubic ease-out tied directly to scroll wheel position
        const eased = 1 - Math.pow(1 - clamped, 2.6);
        setOffsetY(Number(((1 - eased) * maxTranslateY).toFixed(1)));
        setScale(Number((0.96 + eased * 0.04).toFixed(4)));
        setOpacity(Number(Math.min(1, eased * 1.15).toFixed(3)));
      }
    };

    const handleScroll = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updatePosition);
      }
    };

    frameId = window.requestAnimationFrame(updatePosition);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    mediaQuery.addEventListener?.("change", handleScroll);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      mediaQuery.removeEventListener?.("change", handleScroll);
    };
  }, [maxTranslateY, delayOffsetPx]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div
        style={{
          transform: `translate3d(0, ${offsetY}px, 0) scale(${scale})`,
          transformOrigin: "center bottom",
          opacity,
          transition: "transform 110ms ease-out, opacity 110ms ease-out",
          willChange: "transform, opacity",
        }}
      >
        {children}
      </div>
    </div>
  );
}
