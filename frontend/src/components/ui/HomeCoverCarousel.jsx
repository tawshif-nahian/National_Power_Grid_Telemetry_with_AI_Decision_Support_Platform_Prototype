/**
 * What it does: Renders the auto-sliding cover banner and updated prototype description strip at the top of the Home page.
 * Who uses it: Imported by `frontend/src/pages/HomePage.jsx`.
 * What it talks to: Reads slide data from `frontend/src/data/homeCoverSlides.js`.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { COVER_SLIDES } from "../../data/homeCoverSlides";
import Reveal from "./Reveal";

export default function HomeCoverCarousel() {
  const [slideIdx, setSlideIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % COVER_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const activeSlide = COVER_SLIDES[slideIdx];

  return (
    <div>
      {/* FULL-WIDTH AUTO-SLIDING COVER BANNER (Editorial Dark Section) */}
      <section className="relative w-full bg-dark text-white overflow-hidden border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[340px]">
          <div className="lg:col-span-5 flex justify-center">
            <Reveal>
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-border/20 bg-series-thermal/40 flex flex-col items-center justify-center p-6 text-center">
                <div className="px-3 py-1 rounded-full bg-accent text-[10px] font-mono font-semibold tracking-widest uppercase text-white mb-2 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" /> TRANSMISSION (kV)
                </div>

                <div className="w-20 h-20 rounded-full bg-series-solar/15 border border-series-solar flex items-center justify-center my-1">
                  <Zap className="h-10 w-10 text-series-solar" />
                </div>

                <div className="flex items-center justify-between w-full gap-2 mt-2 font-mono">
                  <span className="flex-1 py-1 px-2 rounded bg-status-info text-[10px] font-semibold uppercase tracking-wider text-white">
                    CAPACITY
                  </span>
                  <span className="flex-1 py-1 px-2 rounded bg-series-gas text-[10px] font-semibold uppercase tracking-wider text-white">
                    GENERATION
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 text-center lg:text-left space-y-4">
            <Reveal>
              <span className="inline-block text-[11px] font-mono tracking-widest uppercase px-3 py-1 rounded bg-white/10 text-white border border-white/15">
                {activeSlide.badge}
              </span>

              <h1 className="text-2xl sm:text-4xl font-heading font-bold leading-snug tracking-tight text-white mt-4">
                {activeSlide.headlineMain}{" "}
                <span style={{ color: activeSlide.accentVar }}>
                  {activeSlide.headlineAccent}
                </span>{" "}
                {activeSlide.headlineSub}
              </h1>

              <p className="text-sm sm:text-base text-white/80 italic font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed mt-3">
                {activeSlide.quote}
              </p>

              <div className="pt-4 flex items-center justify-center lg:justify-start gap-2">
                {COVER_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIdx(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      slideIdx === i
                        ? "w-8 bg-accent"
                        : "w-2.5 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <button
          onClick={() =>
            setSlideIdx(
              (prev) => (prev - 1 + COVER_SLIDES.length) % COVER_SLIDES.length
            )
          }
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        <button
          onClick={() =>
            setSlideIdx((prev) => (prev + 1) % COVER_SLIDES.length)
          }
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </section>

      {/* UPDATED PROTOTYPE DESCRIPTION STRIP (Links only to Dashboard) */}
      <section className="bg-surface border-b border-border py-7 px-6">
        <Reveal className="max-w-4xl mx-auto text-center">
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            <strong className="text-text-primary font-heading">
              National Power Telemetry
            </strong>{" "}
            is a prototype portal showing live telemetry (updated every 5
            seconds) from three monitored power plants:{" "}
            <strong className="text-text-primary">
              Payra 1320 MW thermal
            </strong>
            ,{" "}
            <strong className="text-text-primary">
              Titas 450 MW combined cycle
            </strong>
            , and{" "}
            <strong className="text-text-primary">
              Sirajganj 68 MW solar
            </strong>
            . Explore live station readings and interactive charts in the{" "}
            <button
              onClick={() => navigate("/dashboard")}
              className="text-accent hover:text-accent-hover font-semibold underline cursor-pointer"
            >
              Dashboard
            </button>
            .
          </p>
        </Reveal>
      </section>
    </div>
  );
}
