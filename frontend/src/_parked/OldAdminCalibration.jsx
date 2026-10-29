// Parked: not in the menu yet.
/**
 * What it does: Preserves the original Administrative Plant Parameter Calibration Console from App.jsx.
 * Who uses it: Currently parked in `_parked/` for future reference.
 * What it talks to: Uses `computePlantCosts` from `../utils/costCalculations` and `updatePlantParameters` from `../services/telemetryService`.
 */

import { useState } from "react";
import { Save } from "lucide-react";
import { computePlantCosts } from "../utils/costCalculations";
import { updatePlantParameters } from "../services/telemetryService";

export default function OldAdminCalibration({ plants, setPlants }) {
  const [adminSaveMsg, setAdminSaveMsg] = useState("");

  const handleAdminPlantUpdate = async (plant) => {
    setAdminSaveMsg(`Saving ${plant.plant_code} calibration...`);
    const { error } = await updatePlantParameters(plant);
    if (error) {
      setAdminSaveMsg(`Updated in session (${plant.plant_code}).`);
    } else {
      setAdminSaveMsg(`Saved ${plant.plant_code} parameters to PostgreSQL.`);
    }
    setTimeout(() => setAdminSaveMsg(""), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded">
            Administrative Configuration Console
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1.5">
            Plant Parameter Calibration & Cost Model Inputs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Adjust thermodynamic heat rates (BTU/kWh), fuel unit prices
            ($/MMBTU), variable O&M, and operational statuses.
          </p>
        </div>
        {adminSaveMsg && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-2 rounded-lg text-xs font-semibold">
            {adminSaveMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plants.map((plant, idx) => {
          const costs = computePlantCosts(plant);
          return (
            <div
              key={plant.id}
              className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {plant.plant_code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {plant.name}
                  </h3>
                </div>
                <select
                  value={plant.operational_status || "ONLINE"}
                  onChange={(e) => {
                    const updated = [...plants];
                    updated[idx] = {
                      ...plant,
                      operational_status: e.target.value,
                    };
                    setPlants(updated);
                  }}
                  className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold text-slate-800"
                >
                  <option value="ONLINE">ONLINE</option>
                  <option value="DERATED">DERATED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1">
                    Capacity (MW)
                  </label>
                  <input
                    type="number"
                    value={plant.capacity_mw}
                    onChange={(e) => {
                      const updated = [...plants];
                      updated[idx] = {
                        ...plant,
                        capacity_mw: Number(e.target.value),
                      };
                      setPlants(updated);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">
                    Dispatchable (MW)
                  </label>
                  <input
                    type="number"
                    value={plant.dispatchable_mw}
                    onChange={(e) => {
                      const updated = [...plants];
                      updated[idx] = {
                        ...plant,
                        dispatchable_mw: Number(e.target.value),
                      };
                      setPlants(updated);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">
                    Heat Rate (BTU/kWh)
                  </label>
                  <input
                    type="number"
                    value={plant.heat_rate_btu_kwh}
                    onChange={(e) => {
                      const updated = [...plants];
                      updated[idx] = {
                        ...plant,
                        heat_rate_btu_kwh: Number(e.target.value),
                      };
                      setPlants(updated);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">
                    Fuel Price ($/MMBTU)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={plant.fuel_unit_price}
                    onChange={(e) => {
                      const updated = [...plants];
                      updated[idx] = {
                        ...plant,
                        fuel_unit_price: Number(e.target.value),
                      };
                      setPlants(updated);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">
                    Variable O&M ($/MWh)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={plant.vom_cost_per_mwh}
                    onChange={(e) => {
                      const updated = [...plants];
                      updated[idx] = {
                        ...plant,
                        vom_cost_per_mwh: Number(e.target.value),
                      };
                      setPlants(updated);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">
                    Resulting $/kWh
                  </label>
                  <div className="w-full bg-blue-50 border border-blue-200 rounded px-3 py-1.5 text-[#1D4ED8] font-mono font-bold">
                    ${costs.variableCostKwh.toFixed(4)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleAdminPlantUpdate(plant)}
                className="w-full py-2 bg-[#1D4ED8] hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Save className="h-3.5 w-3.5" /> Save Parameters
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

