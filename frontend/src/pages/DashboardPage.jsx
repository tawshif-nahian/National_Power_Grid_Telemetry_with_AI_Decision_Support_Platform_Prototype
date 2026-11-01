/**
 * What it does: Renders the `/dashboard` plant list with 3 large clickable zig-zag cards (Payra, Titas, Sirajganj).
 * Who uses it: Rendered by `frontend/src/App.jsx` at `/dashboard`.
 * What it talks to: Calls `useDashboardPlants` hook in `features/dashboard/hooks/` and navigates to `/dashboard/:plantId`.
 */

import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { useDashboardPlants } from "../features/dashboard/hooks/useDashboardPlants";
import Reveal from "../components/ui/Reveal";

export default function DashboardPage({
  plants,
  telemetry,
  inventory,
  handleSelectPlant,
}) {
  const navigate = useNavigate();
  const plantCards = useDashboardPlants({ plants, telemetry, inventory });

  const openPlantDetail = (plantId) => {
    if (handleSelectPlant) {
      handleSelectPlant(plantId);
    }
    navigate(`/dashboard/${plantId}`);
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
      <Reveal maxTranslateY={80}>
        <div className="space-y-2 border-b border-border pb-6">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent block">
            SUPERVISORY TELEMETRY DIRECTORY • 3 MONITORED STATIONS
          </span>
          <h1 className="text-2xl sm:text-4xl font-heading font-bold text-text-primary">
            Monitored Power Generation Facilities
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
            Select any power plant below to inspect its dedicated 5-second SCADA
            telemetry stream, thermodynamic efficiency, busbar voltage, and
            interactive charts.
          </p>
        </div>
      </Reveal>

      <div className="space-y-10 sm:space-y-14">
        {plantCards.map((plant, idx) => {
          const isReversed = idx % 2 === 1;
          return (
            <Reveal key={plant.id} maxTranslateY={110}>
              <article
                onClick={() => openPlantDetail(plant.id)}
                className="bg-surface border border-border hover:border-accent rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center transition-colors cursor-pointer group"
              >
                {/* Aerial Image Column */}
                <div
                  className={`lg:col-span-5 ${
                    isReversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <Reveal maxTranslateY={80} delayOffsetPx={30}>
                    <div className="rounded-xl overflow-hidden border border-border bg-bg">
                      <img
                        src={plant.image}
                        alt={`${plant.name} aerial view`}
                        className="w-full h-auto block"
                      />
                    </div>
                  </Reveal>
                </div>

                {/* Plant Info, Status Badge, Stat Boxes & Button Column */}
                <div
                  className={`lg:col-span-7 space-y-6 ${
                    isReversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <Reveal maxTranslateY={70} delayOffsetPx={20}>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-mono text-text-secondary flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${plant.seriesDotClass}`}
                          />
                          {plant.plant_code} • {plant.fuel_type}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full border ${plant.statusInfo.badgeClass}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${plant.statusInfo.dotClass}`}
                          />
                          {plant.statusInfo.label}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary group-hover:text-accent transition-colors">
                        {plant.name}
                      </h2>

                      <p className="text-xs text-text-secondary flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span>
                          {plant.location} • {plant.region} • Operator:{" "}
                          {plant.operator}
                        </span>
                      </p>
                    </div>
                  </Reveal>

                  {/* 4 Plant-Specific Stat Boxes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {plant.stats.map((st, stIdx) => (
                      <Reveal
                        key={st.label}
                        maxTranslateY={60}
                        delayOffsetPx={40 + stIdx * 18}
                      >
                        <div
                          className={`p-3.5 rounded-xl border h-full ${
                            st.highlight
                              ? "bg-bg border-accent"
                              : "bg-bg border-border"
                          }`}
                        >
                          <span className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold block">
                            {st.label}
                          </span>
                          <span
                            className={`text-sm sm:text-base font-mono font-bold mt-1.5 block ${
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

                  <Reveal maxTranslateY={50} delayOffsetPx={85}>
                    <div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPlantDetail(plant.id);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-heading font-bold tracking-wider uppercase rounded-lg transition-colors cursor-pointer"
                      >
                        <span>View Plant Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </Reveal>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
