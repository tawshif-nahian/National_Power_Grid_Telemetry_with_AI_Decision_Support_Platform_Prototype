// Parked: not in the menu yet.
/**
 * What it does: Preserves the original Thermodynamic Cost Modeling & Sliders page from App.jsx.
 * Who uses it: Currently parked in `_parked/` so no code is lost while the new Cost Modelling page is being planned.
 * What it talks to: Uses `computePlantCosts` from `../utils/costCalculations`.
 */

import { useState } from "react";
import { computePlantCosts } from "../utils/costCalculations";

export default function OldCostModelPage({ plants, setPlants }) {
  const [coalPriceSim, setCoalPriceSim] = useState(5.4);
  const [gasPriceSim, setGasPriceSim] = useState(6.2);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs">
        <span className="text-[11px] font-mono uppercase text-[#1D4ED8] font-bold">
          Week 2 Deliverable • Thermodynamic Cost Modeling
        </span>
        <h1 className="text-xl font-bold text-slate-900 mt-1">
          Electricity Generation Cost Equations & Comparison ($/kWh)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Static thermodynamic equations comparing short-run marginal cost
          across Coal, Combined Cycle Gas, and Solar PV.
        </p>

        <div className="mt-4 bg-slate-50 border border-slate-200 p-4 rounded-lg font-mono text-xs text-slate-700 space-y-1.5">
          <p>
            <strong>1. Fuel Cost ($/kWh)</strong> = [ Heat Rate (BTU/kWh) × Fuel
            Price ($/MMBTU) ] ÷ 1,000,000
          </p>
          <p>
            <strong>2. Variable Cost ($/kWh)</strong> = Fuel Cost ($/kWh) + [
            Variable O&M ($/MWh) ÷ 1,000 ]
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">
                Coal Price ($/MMBTU)
              </span>
              <span className="font-mono font-bold text-slate-900">
                ${coalPriceSim.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="3.0"
              max="9.0"
              step="0.1"
              value={coalPriceSim}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCoalPriceSim(val);
                setPlants((prev) =>
                  prev.map((p) =>
                    p.plant_code === "PYR-COAL"
                      ? { ...p, fuel_unit_price: val }
                      : p
                  )
                );
              }}
              className="w-full accent-[#1D4ED8] cursor-pointer"
            />
          </div>
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">
                Natural Gas Price ($/MMBTU)
              </span>
              <span className="font-mono font-bold text-slate-900">
                ${gasPriceSim.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="3.0"
              max="12.0"
              step="0.1"
              value={gasPriceSim}
              onChange={(e) => {
                const val = Number(e.target.value);
                setGasPriceSim(val);
                setPlants((prev) =>
                  prev.map((p) =>
                    p.plant_code === "TTS-GAS"
                      ? { ...p, fuel_unit_price: val }
                      : p
                  )
                );
              }}
              className="w-full accent-[#EA580C] cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plants.map((plant) => {
          const c = computePlantCosts(plant);
          return (
            <div
              key={plant.id}
              className="bg-white border border-slate-200 p-6 rounded-xl space-y-3 shadow-2xs"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {plant.plant_code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {plant.name}
                  </h3>
                </div>
                <span className="font-mono text-sm font-bold text-[#1D4ED8] bg-blue-50 px-2.5 py-1 rounded">
                  ${c.variableCostKwh.toFixed(4)}/kWh
                </span>
              </div>
              <div className="text-xs space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span>Heat Rate:</span>
                  <span className="font-mono text-slate-900">
                    {c.heatRate} BTU/kWh
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fuel Price:</span>
                  <span className="font-mono text-slate-900">
                    ${c.fuelPrice.toFixed(2)} / MMBTU
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Variable O&M:</span>
                  <span className="font-mono text-slate-900">
                    ${c.vomMwh.toFixed(2)} / MWh
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-slate-900">
                  <span>Total Levelized Cost:</span>
                  <span className="font-mono">
                    ${c.totalLcoeKwh.toFixed(4)} / kWh
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

