/**
 * What it does: Renders the auto-sliding cover banner and description strip at the top of the Home page.
 * Who uses it: Imported by `frontend/src/pages/HomePage.jsx`.
 * What it talks to: Reads slide data from `frontend/src/data/homeCoverSlides.js`.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { COVER_SLIDES } from "../../data/homeCoverSlides";

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
      {/* FULL-WIDTH AUTO-SLIDING COVER BANNER (NPP India Benchmark) */}
      <section
        className={`relative w-full bg-gradient-to-r ${activeSlide.bgGradient} text-white overflow-hidden transition-all duration-700`}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[340px]">
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-white/10 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center shadow-xl">
              <div className="px-3 py-1 rounded-full bg-rose-700/90 text-[10px] font-bold tracking-widest uppercase text-white mb-2 flex items-center gap-1.5 shadow">
                <Activity className="h-3.5 w-3.5" /> TRANSMISSION (kV)
              </div>

              <div className="w-20 h-20 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center my-1 shadow-inner">
                <Zap className="h-10 w-10 text-amber-400 fill-amber-400" />
              </div>

              <div className="flex items-center justify-between w-full gap-2 mt-2">
                <span className="flex-1 py-1 px-2 rounded bg-sky-600/90 text-[10px] font-bold uppercase tracking-wider text-white">
                  CAPACITY
                </span>
                <span className="flex-1 py-1 px-2 rounded bg-amber-600/90 text-[10px] font-bold uppercase tracking-wider text-white">
                  GENERATION
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 text-center lg:text-left space-y-4">
            <span className="inline-block text-[11px] font-mono tracking-widest uppercase px-3 py-1 rounded bg-white/10 text-slate-200 border border-white/15">
              {activeSlide.badge}
            </span>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold leading-snug tracking-wide text-white">
              {activeSlide.headlineMain}{" "}
              <span style={{ color: activeSlide.accentColor }}>
                {activeSlide.headlineAccent}
              </span>{" "}
              {activeSlide.headlineSub}
            </h1>

            <p className="text-sm sm:text-base text-slate-200 italic font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {activeSlide.quote}
            </p>

            <div className="pt-2 flex items-center justify-center lg:justify-start gap-2">
              {COVER_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIdx(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    slideIdx === i
                      ? "w-8 bg-[#F59E0B]"
                      : "w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
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
          <ChevronLeft className="h-9 w-9" />
        </button>
        <button
          onClick={() =>
            setSlideIdx((prev) => (prev + 1) % COVER_SLIDES.length)
          }
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="h-9 w-9" />
        </button>
      </section>

      {/* NPP-STYLE PLATFORM DESCRIPTION STRIP RIGHT UNDER COVER PHOTOS */}
      <section className="bg-[#EEF2F6] border-b border-slate-200 py-6 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong>National Power Portal (NPP Blueprint)</strong> is a unified
            supervisory system for the national power sector that facilitates
            real-time telemetry capture (every 5 seconds) from coal, gas, and
            solar utilities. Main operational telemetry can be viewed in the{" "}
            <button
              onClick={() => navigate("/dashboard")}
              className="text-[#1D4ED8] font-semibold underline cursor-pointer"
            >
              Dashboard
            </button>
            , thermodynamic $/kWh generation formulas in the{" "}
            <button
              onClick={() => navigate("/admin/cost-modelling")}
              className="text-[#1D4ED8] font-semibold underline cursor-pointer"
            >
              Cost Model
            </button>
            , coal stockpiles and gas pressures in{" "}
            <button
              onClick={() => navigate("/dashboard")}
              className="text-[#1D4ED8] font-semibold underline cursor-pointer"
            >
              Inventory
            </button>
            , and automated dispatch guidance in the{" "}
            <button
              onClick={() => navigate("/dashboard")}
              className="text-[#1D4ED8] font-semibold underline cursor-pointer"
            >
              AI Assistant
            </button>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

