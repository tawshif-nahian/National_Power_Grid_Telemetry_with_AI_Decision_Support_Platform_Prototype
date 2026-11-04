/**
 * What it does: Renders Part 1 of the Payra Cost Model — 4 headline financial KPI cards plus the interactive "What-If" assumptions simulator.
 * Who uses it: Imported by `frontend/src/pages/CostModellingPage.jsx`.
 * What it talks to: Pure UI component receiving state and callbacks from `usePayraCostModel` hook.
 */

import { RotateCcw, Save, Sliders, Database } from "lucide-react";

export default function AssumptionsSimulatorSection({
  assumptions,
  computedMetrics,
  isFromDb,
  saving,
  saveMessage,
  onUpdateField,
  onReset,
  onSave,
}) {
  const coalPrice = Number(assumptions.coal_price_usd_mt ?? 131.5);
  const exchangeRate = Number(assumptions.exchange_rate_tk_usd ?? 78.68);
  const plantFactorPct = Math.round(Number(assumptions.plant_factor ?? 0.85) * 100);
  const netHeatRate = Number(assumptions.net_heat_rate_kcal_kwh ?? 3200);

  const baselineTariff = 8.43;
  const currentTariff = Number(computedMetrics.levelizedTariffTkKwh ?? 8.43);
  const tariffDelta = currentTariff - baselineTariff;

  const kpiCards = [
    {
      label: "Levelized Tariff (25-Yr LCOE)",
      value: `${currentTariff.toFixed(2)} Tk/kWh`,
      sub:
        Math.abs(tariffDelta) < 0.01
          ? "Official BCPCL Baseline (12% Discount)"
          : `${tariffDelta > 0 ? "+" : ""}${tariffDelta.toFixed(2)} Tk/kWh vs 8.43 baseline`,
      highlight: true,
    },
    {
      label: "Per-Unit Fuel Cost (Coal)",
      value: `${computedMetrics.fuelCostTkKwh.toFixed(2)} Tk/kWh`,
      sub: `$${computedMetrics.fuelCostUsdKwh.toFixed(4)}/kWh @ 6,100 Kcal/kg`,
      highlight: false,
    },
    {
      label: "Total Turnkey Project Cost",
      value: "186.84B Tk",
      sub: "141,544 Tk/kW ($1,799/kW) • 1,320 MW",
      highlight: false,
    },
    {
      label: "Financing & Debt Service",
      value: "70% / 30%",
      sub: "3.0% Debt (11-Yr Payback) • 16.0% ROE",
      highlight: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Headline Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className={`p-5 rounded-xl border ${
              card.highlight
                ? "bg-surface border-accent"
                : "bg-surface border-border"
            }`}
          >
            <span className="text-[11px] font-mono uppercase tracking-wider text-text-secondary block">
              {card.label}
            </span>
            <span
              className={`text-2xl font-mono font-bold mt-2 block ${
                card.highlight ? "text-accent" : "text-text-primary"
              }`}
            >
              {card.value}
            </span>
            <span className="text-xs text-text-secondary mt-1.5 block">
              {card.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Interactive What-If Assumptions Simulator Box */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-accent" />
              <h3 className="text-base sm:text-lg font-heading font-bold text-text-primary">
                Part 1: Interactive &ldquo;What-If&rdquo; Tariff Sensitivity Simulator
              </h3>
            </div>
            <p className="text-xs text-text-secondary">
              Adjust international coal price, USD/BDT exchange rate, annual plant
              load factor, or boiler heat rate to recalculate Payra&apos;s levelized
              generation tariff in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded border border-border bg-bg text-text-secondary">
              <Database className="h-3 w-3 text-accent" />
              {isFromDb ? "Synced: Supabase DB" : "Source: Official BCPCL Model"}
            </span>

            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-bg hover:border-accent text-xs font-heading font-semibold text-text-primary transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-text-secondary" />
              Reset Baseline
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save to Supabase"}
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className="text-xs font-mono text-accent bg-bg border border-accent px-3.5 py-2 rounded-lg">
            {saveMessage}
          </div>
        )}

        {/* 4 Interactive Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Slider 1: Coal Price USD/MT */}
          <div className="bg-bg border border-border rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-heading font-bold text-text-primary">
                Coal Price (USD/MT)
              </label>
              <span className="text-xs font-mono font-bold text-accent">
                ${coalPrice.toFixed(1)}/MT
              </span>
            </div>
            <input
              type="range"
              min="80"
              max="240"
              step="0.5"
              value={coalPrice}
              onChange={(e) =>
                onUpdateField("coal_price_usd_mt", parseFloat(e.target.value))
              }
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-text-secondary">
              <span>$80/MT</span>
              <span>Base: $131.5/MT</span>
              <span>$240/MT</span>
            </div>
          </div>

          {/* Slider 2: Exchange Rate Tk/USD */}
          <div className="bg-bg border border-border rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-heading font-bold text-text-primary">
                Exchange Rate (Tk/USD)
              </label>
              <span className="text-xs font-mono font-bold text-accent">
                {exchangeRate.toFixed(2)} Tk
              </span>
            </div>
            <input
              type="range"
              min="75"
              max="130"
              step="0.5"
              value={exchangeRate}
              onChange={(e) =>
                onUpdateField("exchange_rate_tk_usd", parseFloat(e.target.value))
              }
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-text-secondary">
              <span>75 Tk</span>
              <span>Base: 78.68 Tk</span>
              <span>130 Tk</span>
            </div>
          </div>

          {/* Slider 3: Annual Plant Factor % */}
          <div className="bg-bg border border-border rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-heading font-bold text-text-primary">
                Annual Plant Factor
              </label>
              <span className="text-xs font-mono font-bold text-accent">
                {plantFactorPct}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={plantFactorPct}
              onChange={(e) =>
                onUpdateField("plant_factor", parseFloat(e.target.value) / 100)
              }
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-text-secondary">
              <span>50% Load</span>
              <span>Base: 85%</span>
              <span>95% Load</span>
            </div>
          </div>

          {/* Slider 4: Net Heat Rate Kcal/kWh */}
          <div className="bg-bg border border-border rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-heading font-bold text-text-primary">
                Net Heat Rate (Kcal/kWh)
              </label>
              <span className="text-xs font-mono font-bold text-accent">
                {netHeatRate} Kcal
              </span>
            </div>
            <input
              type="range"
              min="2800"
              max="4200"
              step="20"
              value={netHeatRate}
              onChange={(e) =>
                onUpdateField(
                  "net_heat_rate_kcal_kwh",
                  parseInt(e.target.value, 10)
                )
              }
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-text-secondary">
              <span>2,800 (High Eff)</span>
              <span>Base: 3,200</span>
              <span>4,200</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

