/**
 * What it does: Renders the Home page with the cover banner, prototype description, and 4 alternating zig-zag cards
 *               (Capacity, Generation, Transmission, Inventory) covering the three monitored power plants.
 * Who uses it: Rendered by `frontend/src/App.jsx` at the `/` address.
 * What it talks to: Calls `useFleetSummary` hook (`Page -> Hook -> Service -> Supabase`) and uses `HomeCoverCarousel` and `Reveal`.
 */

import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useFleetSummary } from "../hooks/useFleetSummary";
import HomeCoverCarousel from "../components/ui/HomeCoverCarousel";
import Reveal from "../components/ui/Reveal";
import capacityIllustration from "../assets/home/capacity-illustration.svg";
import generationIllustration from "../assets/home/generation-illustration.svg";
import transmissionIllustration from "../assets/home/transmission-illustration.svg";
import inventoryIllustration from "../assets/home/inventory-illustration.svg";

export default function HomePage() {
  const navigate = useNavigate();
  const summary = useFleetSummary();

  const zigZagCards = [
    {
      id: "capacity",
      badge: "01 • INSTALLED FLEET CAPACITY",
      title: "Capacity",
      description:
        "Combined nameplate rating across the three monitored stations—spanning ultra-supercritical coal, combined-cycle natural gas, and utility-scale solar PV.",
      illustration: capacityIllustration,
      illustrationAlt: "Installed Capacity Illustration",
      stats: [
        {
          label: "Payra Thermal (Coal)",
          value: summary.capacity.thermalMw,
          dotClass: "bg-series-thermal",
        },
        {
          label: "Titas Combined Cycle (Gas)",
          value: summary.capacity.gasMw,
          dotClass: "bg-series-gas",
        },
        {
          label: "Sirajganj Solar Park",
          value: summary.capacity.solarMw,
          dotClass: "bg-series-solar",
        },
        {
          label: "Combined 3-Plant Capacity",
          value: summary.capacity.totalMw,
          highlight: true,
        },
      ],
      buttonLabel: "Explore Plant Capacities",
    },
    {
      id: "generation",
      badge: "02 • REAL-TIME DISPATCH OUTPUT",
      title: "Generation",
      description:
        "Live 5-second active power output (MW) streamed directly from each station's telemetry table.",
      illustration: generationIllustration,
      illustrationAlt: "Live Generation Telemetry Illustration",
      stats: [
        {
          label: "Payra Thermal Live Output",
          value: summary.generation.thermalMw,
          dotClass: "bg-series-thermal",
        },
        {
          label: "Titas Gas Live Output",
          value: summary.generation.gasMw,
          dotClass: "bg-series-gas",
        },
        {
          label: "Sirajganj Solar Live Output",
          value: summary.generation.solarMw,
          dotClass: "bg-series-solar",
        },
        {
          label: "Combined Live Generation",
          value: summary.generation.totalMw,
          highlight: true,
        },
      ],
      buttonLabel: "View Live Generation",
    },
    {
      id: "transmission",
      badge: "03 • SUBSTATION BUSBAR & SYNCHRONIZATION",
      title: "Transmission",
      description:
        "High-voltage substation busbar levels (kV) and synchronous grid frequency (Hz) reported by the three monitored facilities.",
      illustration: transmissionIllustration,
      illustrationAlt: "Transmission Busbar Illustration",
      stats: [
        {
          label: "Payra Substation Bus",
          value: summary.transmission.payraKv,
          dotClass: "bg-series-thermal",
        },
        {
          label: "Titas Substation Bus",
          value: summary.transmission.titasKv,
          dotClass: "bg-series-gas",
        },
        {
          label: "Sirajganj Substation Bus",
          value: summary.transmission.sirajganjKv,
          dotClass: "bg-series-solar",
        },
        {
          label: "Synchronous Frequency",
          value: summary.transmission.frequencyHz,
          highlight: true,
        },
      ],
      buttonLabel: "Inspect Busbar Telemetry",
    },
    {
      id: "inventory",
      badge: "04 • FUEL STOCKPILES & PIPELINE PRESSURE",
      title: "Inventory",
      description:
        "On-site sub-bituminous coal reserves at Payra Port and pipeline natural gas supply pressure at Titas.",
      illustration: inventoryIllustration,
      illustrationAlt: "Fuel Inventory Illustration",
      stats: [
        {
          label: "Payra Coal Stockpile",
          value: summary.inventory.coalStockMt,
          dotClass: "bg-series-thermal",
        },
        {
          label: "Payra Days of Burn",
          value: summary.inventory.coalDays,
          dotClass: "bg-series-thermal",
        },
        {
          label: "Titas Pipeline Pressure",
          value: summary.inventory.gasPressurePsi,
          dotClass: "bg-series-gas",
        },
        {
          label: "Titas Gas Supply",
          value: summary.inventory.gasStockMmscfd,
          highlight: true,
        },
      ],
      buttonLabel: "Open Station Telemetry",
    },
  ];

  return (
    <div>
      <HomeCoverCarousel />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12 sm:space-y-16">
        {zigZagCards.map((card, idx) => {
          const isReversed = idx % 2 === 1;
          return (
            <Reveal key={card.id} maxTranslateY={110}>
              <section className="bg-surface border border-border rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Illustration Column */}
                <div
                  className={`lg:col-span-5 ${
                    isReversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <Reveal maxTranslateY={85} delayOffsetPx={35}>
                    <div className="rounded-xl overflow-hidden border border-border bg-bg">
                      <img
                        src={card.illustration}
                        alt={card.illustrationAlt}
                        className="w-full h-auto block"
                      />
                    </div>
                  </Reveal>
                </div>

                {/* Content & Stat Boxes Column */}
                <div
                  className={`lg:col-span-7 space-y-6 ${
                    isReversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <Reveal maxTranslateY={75} delayOffsetPx={20}>
                    <div className="space-y-2">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-accent block">
                        {card.badge}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
                        {card.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
                        {card.description}
                      </p>
                    </div>
                  </Reveal>

                  {/* 4 Stat Boxes with Staggered Scroll Reveal */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {card.stats.map((st, stIdx) => (
                      <Reveal
                        key={st.label}
                        maxTranslateY={65}
                        delayOffsetPx={45 + stIdx * 20}
                      >
                        <div
                          className={`p-3.5 rounded-xl border h-full ${
                            st.highlight
                              ? "bg-bg border-accent"
                              : "bg-bg border-border"
                          }`}
                        >
                          <span className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold flex items-center gap-1.5">
                            {st.dotClass && (
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${st.dotClass}`}
                              />
                            )}
                            {st.label}
                          </span>
                          <span
                            className={`text-base sm:text-lg font-mono font-bold mt-1.5 block ${
                              st.highlight
                                ? "text-accent"
                                : "text-text-primary"
                            }`}
                          >
                            {st.value}
                          </span>
                        </div>
                      </Reveal>
                    ))}
                  </div>

                  <Reveal maxTranslateY={55} delayOffsetPx={90}>
                    <div>
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-heading font-bold tracking-wider uppercase rounded-lg transition-colors cursor-pointer"
                      >
                        <span>{card.buttonLabel}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </Reveal>
                </div>
              </section>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
