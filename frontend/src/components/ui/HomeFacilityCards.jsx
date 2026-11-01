// Parked: not in the menu yet.
/**
 * What it does: Preserves the Monitored Generation Facilities & Live Telemetry Overlay cards using semantic design tokens.
 * Who uses it: Imported by `frontend/src/_parked/OldHomePageSections.jsx`.
 * What it talks to: Uses `computePlantCosts` from `utils/costCalculations.js` (does not talk to any backend or database).
 */

import { computePlantCosts } from "../../utils/costCalculations";
import Reveal from "./Reveal";

export default function HomeFacilityCards({
  plants,
  telemetry,
  onSelectFacility,
}) {
  return (
    <div className="space-y-4">
      <Reveal>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-bold text-text-primary">
              Monitored Generation Facilities & Live Telemetry Overlay
            </h3>
            <p className="text-xs text-text-secondary">
              Select any station to open its dedicated real-time SCADA telemetry
              console
            </p>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plants.map((plant) => {
          const live = telemetry[plant.table_name];
          const cost = computePlantCosts(plant);
          const borderAccent =
            plant.fuel_category === "Coal"
              ? "border-t-4 border-t-series-thermal"
              : plant.fuel_category === "Gas"
                ? "border-t-4 border-t-series-gas"
                : "border-t-4 border-t-series-solar";

          return (
            <Reveal key={plant.id}>
              <div
                onClick={() => onSelectFacility(plant.id)}
                className={`bg-surface border border-border ${borderAccent} rounded-xl p-6 hover:border-accent transition-all cursor-pointer group`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-mono text-text-secondary">
                      {plant.plant_code} • {plant.substation_kv} kV
                    </span>
                    <h4 className="font-heading font-bold text-text-primary text-base mt-0.5 group-hover:text-accent transition-colors">
                      {plant.name}
                    </h4>
                    <p className="text-xs text-text-secondary">
                      {plant.fuel_type} • {plant.location}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-status-online/15 text-status-online border border-status-online/30">
                    {live?.status || "ONLINE"}
                  </span>
                </div>

                <div className="mt-5 pt-4 border-t border-border grid grid-cols-3 gap-2 font-mono">
                  <div>
                    <span className="text-[10px] font-sans uppercase text-text-secondary block">
                      Output
                    </span>
                    <span className="text-sm font-bold text-text-primary">
                      {live?.power_output_mw ??
                        (plant.capacity_mw * 0.89).toFixed(1)}{" "}
                      MW
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-sans uppercase text-text-secondary block">
                      Frequency
                    </span>
                    <span className="text-sm font-bold text-status-online">
                      {live?.frequency_hz ?? "50.00"} Hz
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-sans uppercase text-text-secondary block">
                      Cost/kWh
                    </span>
                    <span className="text-sm font-bold text-accent">
                      ${cost.variableCostKwh.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
