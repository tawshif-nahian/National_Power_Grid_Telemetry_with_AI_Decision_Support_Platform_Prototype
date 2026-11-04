/**
 * What it does: Renders Part 4 of the Payra Cost Model — Annex-I CAPEX breakdown (186.84B Tk) and a tabbed financial schedule inspector.
 * Who uses it: Imported by `frontend/src/pages/CostModellingPage.jsx`.
 * What it talks to: Pure UI component rendering `capexBreakdown`, `monthly2026`, and `yearlyTariff` from `usePayraCostModel`.
 */

import { useState } from "react";
import { Layers, Table } from "lucide-react";

export default function CapexAndSchedulesSection({
  capexBreakdown = [],
  monthly2026 = [],
  yearlyTariff = [],
}) {
  const [activeTab, setActiveTab] = useState("capex");
  const totalCapexMln = capexBreakdown.reduce(
    (sum, item) => sum + Number(item.cost_million_tk || 0),
    0
  );

  const topCapexItems = [...capexBreakdown]
    .sort((a, b) => Number(b.cost_million_tk) - Number(a.cost_million_tk))
    .slice(0, 5);

  const tabs = [
    { id: "capex", label: "Annex-I CAPEX (17 Items)" },
    { id: "monthly", label: "2026 Monthly COG (12 Months)" },
    { id: "yearly", label: "25-Year Tariff & Amortization" },
  ];

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 space-y-6">
      {/* Header + Top 5 CAPEX Visual Bars */}
      <div className="space-y-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-accent" />
            <h3 className="text-base sm:text-lg font-heading font-bold text-text-primary">
              Part 4: Turnkey Capital Cost Breakdown (Annex-I) &amp; Ledger Schedules
            </h3>
          </div>
          <p className="text-xs text-text-secondary">
            Total Turnkey Project Cost:{" "}
            <strong className="font-mono text-text-primary">
              {(totalCapexMln / 1000).toFixed(2)} Billion Tk
            </strong>{" "}
            ({totalCapexMln.toLocaleString()} Million Tk) across 17 EPC &amp; financing line items.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {topCapexItems.map((item) => {
            const sharePct =
              totalCapexMln > 0
                ? ((Number(item.cost_million_tk) / totalCapexMln) * 100).toFixed(1)
                : "0.0";
            return (
              <div key={item.sl_no} className="bg-bg border border-border rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-accent font-bold">{sharePct}%</span>
                  <span className="text-text-secondary">
                    {(Number(item.cost_million_tk) / 1000).toFixed(2)}B Tk
                  </span>
                </div>
                <p className="text-xs font-heading font-semibold text-text-primary line-clamp-1">
                  {item.cost_item}
                </p>
                <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${Math.min(100, Number(sharePct) * 1.4)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabbed Schedule Inspector */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-text-secondary">
            <Table className="h-3.5 w-3.5 text-accent" />
            <span>Spreadsheet Schedule Inspector</span>
          </div>
          <div className="inline-flex flex-wrap rounded-xl border border-border bg-bg p-1 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-accent text-white"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Annex-I 17-Item CAPEX Table */}
        {activeTab === "capex" && (
          <div className="overflow-x-auto border border-border rounded-xl bg-bg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border text-text-secondary font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">SL</th>
                  <th className="py-3 px-4">Annex-I Capital Cost Item</th>
                  <th className="py-3 px-4 text-right">Cost (Million Tk)</th>
                  <th className="py-3 px-4 text-right">Cost (Billion Tk)</th>
                  <th className="py-3 px-4 text-right">Share (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {capexBreakdown.map((item) => (
                  <tr key={item.sl_no} className="hover:bg-surface/60">
                    <td className="py-2.5 px-4 text-text-secondary">#{item.sl_no}</td>
                    <td className="py-2.5 px-4 font-sans font-medium text-text-primary">{item.cost_item}</td>
                    <td className="py-2.5 px-4 text-right text-text-primary">{Number(item.cost_million_tk).toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right text-text-secondary">{(Number(item.cost_million_tk) / 1000).toFixed(3)}B</td>
                    <td className="py-2.5 px-4 text-right text-accent font-semibold">
                      {((Number(item.cost_million_tk) / totalCapexMln) * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: 2026 Monthly COG Schedule */}
        {activeTab === "monthly" && (
          <div className="overflow-x-auto border border-border rounded-xl bg-bg">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-text-secondary uppercase text-[11px]">
                  <th className="py-3 px-3">Month</th>
                  <th className="py-3 px-3 text-right">Net Gen (kWh)</th>
                  <th className="py-3 px-3 text-right">Plant Factor</th>
                  <th className="py-3 px-3 text-right">Heat Rate</th>
                  <th className="py-3 px-3 text-right">Fuel (Tk/kWh)</th>
                  <th className="py-3 px-3 text-right">Fixed (Tk/kWh)</th>
                  <th className="py-3 px-3 text-right">VOMP (Tk/kWh)</th>
                  <th className="py-3 px-3 text-right">Total COG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {monthly2026.map((m) => (
                  <tr key={m.month_index} className="hover:bg-surface/60">
                    <td className="py-2.5 px-3 font-bold text-text-primary">{m.month_label}</td>
                    <td className="py-2.5 px-3 text-right text-text-secondary">{Number(m.net_generation_kwh).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-text-primary">{(Number(m.plant_factor) * 100).toFixed(1)}%</td>
                    <td className="py-2.5 px-3 text-right text-text-secondary">{m.heat_rate_kcal_kwh}</td>
                    <td className="py-2.5 px-3 text-right text-text-primary">{Number(m.unit_fuel_cost_tk_kwh).toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right text-text-primary">{Number(m.unit_fixed_cost_tk_kwh).toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right text-text-secondary">{Number(m.unit_variable_om_tk_kwh).toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-accent">{Number(m.unit_cog_tk_kwh).toFixed(2)} Tk</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: 25-Year Tariff & Debt Schedule */}
        {activeTab === "yearly" && (
          <div className="overflow-x-auto max-h-96 border border-border rounded-xl bg-bg">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead className="sticky top-0 bg-surface">
                <tr className="border-b border-border text-text-secondary uppercase text-[11px]">
                  <th className="py-3 px-3">Year</th>
                  <th className="py-3 px-3 text-right">Capital Charge</th>
                  <th className="py-3 px-3 text-right">Fixed O&amp;M</th>
                  <th className="py-3 px-3 text-right">Fuel Cost</th>
                  <th className="py-3 px-3 text-right">Total Tariff</th>
                  <th className="py-3 px-3 text-right">Ending Debt</th>
                  <th className="py-3 px-3 text-right">Ending Equity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {yearlyTariff.map((yr) => (
                  <tr key={yr.year_number} className="hover:bg-surface/60">
                    <td className="py-2 px-3 font-bold text-text-primary">Year {yr.year_number}</td>
                    <td className="py-2 px-3 text-right text-text-primary">{yr.capitalChargeTkKwh.toFixed(3)}</td>
                    <td className="py-2 px-3 text-right text-text-secondary">{yr.fixedOmAdjustedTkKwh.toFixed(3)}</td>
                    <td className="py-2 px-3 text-right text-text-primary">{yr.fuelCostAdjustedTkKwh.toFixed(3)}</td>
                    <td className="py-2 px-3 text-right font-bold text-accent">{yr.totalTariffTkKwh.toFixed(2)} Tk/kWh</td>
                    <td className="py-2 px-3 text-right text-text-secondary">{yr.loanBalanceBillionTk.toFixed(2)}B Tk</td>
                    <td className="py-2 px-3 text-right text-text-secondary">{yr.equityBalanceBillionTk.toFixed(2)}B Tk</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
