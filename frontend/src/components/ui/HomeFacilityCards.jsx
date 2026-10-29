/**
 * What it does: Renders the Monitored Generation Facilities & Live Telemetry Overlay cards at the bottom of the Home page.
 * Who uses it: Imported by `frontend/src/pages/HomePage.jsx`.
 * What it talks to: Uses `computePlantCosts` from `utils/costCalculations.js` (does not talk to any backend or database).
 */

import { computePlantCosts } from "../../utils/costCalculations";

export default function HomeFacilityCards({
  plants,
  telemetry,
  onSelectFacility,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Monitored Generation Facilities & Live Telemetry Overlay
          </h3>
          <p className="text-xs text-slate-500">
            Select any station to open its dedicated real-time SCADA telemetry
            console
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plants.map((plant) => {
          const live = telemetry[plant.table_name];
          const cost = computePlantCosts(plant);
          const borderAccent =
            plant.fuel_category === "Coal"
              ? "border-t-4 border-t-[#475569]"
              : plant.fuel_category === "Gas"
                ? "border-t-4 border-t-[#EA580C]"
                : "border-t-4 border-t-[#10B981]";

          return (
            <div
              key={plant.id}
              onClick={() => onSelectFacility(plant.id)}
              className={`bg-white border border-slate-200 ${borderAccent} rounded-xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer group`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {plant.plant_code} • {plant.substation_kv} kV
                  </span>
                  <h4 className="font-bold text-slate-900 text-base mt-0.5 group-hover:text-[#1D4ED8] transition-colors">
                    {plant.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {plant.fuel_type} • {plant.location}
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {live?.status || "ONLINE"}
                </span>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 font-mono">
                <div>
                  <span className="text-[10px] font-sans uppercase text-slate-400 block">
                    Output
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {live?.power_output_mw ??
                      (plant.capacity_mw * 0.89).toFixed(1)}{" "}
                    MW
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase text-slate-400 block">
                    Frequency
                  </span>
                  <span className="text-sm font-bold text-emerald-700">
                    {live?.frequency_hz ?? "50.00"} Hz
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase text-slate-400 block">
                    Cost/kWh
                  </span>
                  <span className="text-sm font-bold text-[#1D4ED8]">
                    ${cost.variableCostKwh.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

