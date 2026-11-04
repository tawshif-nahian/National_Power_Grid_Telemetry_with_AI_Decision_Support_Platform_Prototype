/**
 * What it does: Renders the `/admin/cost-modelling` page featuring the Payra 1320 MW zig-zag plant card and its 4-part Cost Modelling Console.
 * Who uses it: Rendered by `frontend/src/App.jsx` inside `<ProtectedRoute>` at `/admin/cost-modelling`.
 * What it talks to: Calls `usePayraCostModel` hook (`Page -> Hook -> Service -> Supabase`) and renders the 4 cost-modelling section components.
 */

import { useState } from "react";
import { ArrowRight, ArrowLeft, MapPin, Calculator } from "lucide-react";
import { usePayraCostModel } from "../features/cost-modelling/hooks/usePayraCostModel";
import AssumptionsSimulatorSection from "../features/cost-modelling/components/AssumptionsSimulatorSection";
import MonthlyCogChartSection from "../features/cost-modelling/components/MonthlyCogChartSection";
import LifecycleTariffChartSection from "../features/cost-modelling/components/LifecycleTariffChartSection";
import CapexAndSchedulesSection from "../features/cost-modelling/components/CapexAndSchedulesSection";
import Reveal from "../components/ui/Reveal";

export default function CostModellingPage() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const {
    assumptions,
    monthly2026,
    yearlyTariff,
    capexBreakdown,
    computedMetrics,
    isFromDb,
    saving,
    saveMessage,
    updateAssumptionField,
    resetToSpreadsheetBaseline,
    handleSaveAssumptions,
  } = usePayraCostModel();

  const payraSummaryStats = [
    {
      label: "Levelized Tariff (LCOE)",
      value: `${computedMetrics.levelizedTariffTkKwh.toFixed(2)} Tk/kWh`,
      highlight: true,
    },
    {
      label: "Turnkey CAPEX",
      value: "186.84B Tk",
      highlight: false,
    },
    {
      label: "Fuel Cost (@ $131.5/MT)",
      value: `${computedMetrics.fuelCostTkKwh.toFixed(2)} Tk/kWh`,
      highlight: false,
    },
    {
      label: "Financing (Debt / Equity)",
      value: "70% / 30%",
      highlight: false,
    },
  ];

  // View 1: Directory view with the single Payra 1320 MW zig-zag card (matching /dashboard)
  if (!isModelOpen) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        <Reveal maxTranslateY={80}>
          <div className="space-y-2 border-b border-border pb-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-accent block">
              FINANCIAL &amp; TARIFF ENGINEERING DIRECTORY • 1 MODELLED STATION
            </span>
            <h1 className="text-2xl sm:text-4xl font-heading font-bold text-text-primary">
              Power Generation Cost &amp; Tariff Models
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
              Select a power station below to open its 4-part Tariff Sensitivity
              Simulator, 2026 Monthly Cost of Generation (COG) breakdown, 25-year
              Debt/Equity Amortization curve, and Annex-I Turnkey CAPEX ledger.
            </p>
          </div>
        </Reveal>

        <Reveal maxTranslateY={110}>
          <article
            onClick={() => setIsModelOpen(true)}
            className="bg-surface border border-border hover:border-accent rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center transition-colors cursor-pointer group"
          >
            {/* Aerial Image Column */}
            <div className="lg:col-span-5">
              <Reveal maxTranslateY={80} delayOffsetPx={30}>
                <div className="rounded-xl overflow-hidden border border-border bg-bg">
                  <img
                    src="/plants/payra.svg"
                    alt="Payra 1320 MW Thermal Power Plant aerial view"
                    className="w-full h-auto block"
                  />
                </div>
              </Reveal>
            </div>

            {/* Plant Info, Financial Stat Boxes & Action Button */}
            <div className="lg:col-span-7 space-y-6">
              <Reveal maxTranslateY={70} delayOffsetPx={20}>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono text-text-secondary flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-series-thermal" />
                      PAYRA-1320 • 2×660 MW ULTRA-SUPERCRITICAL COAL
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full border border-status-online text-status-online bg-bg">
                      <span className="w-2 h-2 rounded-full bg-status-online" />
                      BCPCL 25-YR PPA MODEL
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary group-hover:text-accent transition-colors">
                    Payra 1320 MW Thermal Power Plant
                  </h2>

                  <p className="text-xs text-text-secondary flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span>
                      Kalapara, Patuakhali (Barishal Zone) • Operator:
                      Bangladesh-China Power Company Ltd. (BCPCL)
                    </span>
                  </p>
                </div>
              </Reveal>

              {/* 4 Financial Stat Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {payraSummaryStats.map((st, idx) => (
                  <Reveal
                    key={st.label}
                    maxTranslateY={60}
                    delayOffsetPx={40 + idx * 18}
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
                          st.highlight ? "text-accent" : "text-text-primary"
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
                      setIsModelOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-heading font-bold tracking-wider uppercase rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Open 4-Part Cost Model</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Reveal>
            </div>
          </article>
        </Reveal>
      </div>
    );
  }

  // View 2: Inside the Payra Card — The 4-Part Cost Modelling Console
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Bar: Back to Cost Models + Station Title */}
      <Reveal maxTranslateY={70}>
        <div className="bg-surface border border-border p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setIsModelOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-accent hover:text-accent-hover cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Cost Modelling Directory
            </button>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
              Payra 1320 MW Thermal Power Plant — Cost &amp; Tariff Console
            </h1>
            <p className="text-xs font-mono text-text-secondary">
              BCPCL • 2×660 MW Coal • 25-Year PPA Economic Life • 12.0% Discount
              Rate • 78.68 Tk/USD Base
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-bg border border-border px-3.5 py-2 rounded-xl text-text-secondary">
            <Calculator className="h-4 w-4 text-accent" />
            <span>4-Part Financial &amp; Thermodynamic Model</span>
          </div>
        </div>
      </Reveal>

      {/* Part 1: Top KPI Strip + Interactive What-If Assumptions Simulator */}
      <Reveal maxTranslateY={85}>
        <AssumptionsSimulatorSection
          assumptions={assumptions}
          computedMetrics={computedMetrics}
          isFromDb={isFromDb}
          saving={saving}
          saveMessage={saveMessage}
          onUpdateField={updateAssumptionField}
          onReset={resetToSpreadsheetBaseline}
          onSave={handleSaveAssumptions}
        />
      </Reveal>

      {/* Part 2: 2026 Monthly Cost of Generation Breakdown */}
      <Reveal maxTranslateY={95}>
        <MonthlyCogChartSection monthly2026={monthly2026} />
      </Reveal>

      {/* Part 3: 25-Year Lifecycle Tariff & Debt/Equity Amortization */}
      <Reveal maxTranslateY={95}>
        <LifecycleTariffChartSection yearlyTariff={yearlyTariff} />
      </Reveal>

      {/* Part 4: Annex-I Turnkey CAPEX Breakdown & Tabbed Schedule Inspector */}
      <Reveal maxTranslateY={95}>
        <CapexAndSchedulesSection
          capexBreakdown={capexBreakdown}
          monthly2026={monthly2026}
          yearlyTariff={yearlyTariff}
        />
      </Reveal>
    </div>
  );
}
