/**
 * What it does: Renders Part 2 of the Payra Cost Model — the 2026 Monthly Cost of Generation (Jan'26–Dec'26) stacked bar & line chart.
 * Who uses it: Imported by `frontend/src/pages/CostModellingPage.jsx`.
 * What it talks to: Pure Recharts visual component displaying data from `cost_model_monthly_2026`.
 */

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, AlertTriangle } from "lucide-react";

export default function MonthlyCogChartSection({ monthly2026 = [] }) {
  const chartData = monthly2026.map((row) => ({
    ...row,
    plantFactorPct: Number((Number(row.plant_factor) * 100).toFixed(1)),
    efficiencyPct: Number((Number(row.efficiency) * 100).toFixed(2)),
  }));

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-accent" />
            <h3 className="text-base sm:text-lg font-heading font-bold text-text-primary">
              Part 2: 2026 Monthly Cost of Generation Breakdown (Jan&apos;26 – Dec&apos;26)
            </h3>
          </div>
          <p className="text-xs text-text-secondary max-w-3xl">
            Actual monthly Cost of Generation (COG) in Tk/kWh broken into Per-Unit
            Fuel Cost, Per-Unit Fixed Cost, and Variable O&M, overlaid with
            monthly Plant Factor (%).
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-bg border border-border text-text-primary">
            Peak Summer COG: <strong className="text-status-online">7.18 Tk/kWh</strong> (May&apos;26)
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-bg border border-accent text-text-primary">
            Winter Dip COG: <strong className="text-accent">11.25 Tk/kWh</strong> (Dec&apos;26)
          </span>
        </div>
      </div>

      {/* Recharts Stacked Bar + Plant Factor Line */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
            />
            <XAxis
              dataKey="month_label"
              stroke="var(--color-text-secondary)"
              fontSize={11}
            />
            <YAxis
              yAxisId="left"
              stroke="var(--color-text-secondary)"
              fontSize={11}
              unit=" Tk"
              domain={[0, 13]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--color-accent)"
              fontSize={11}
              unit="%"
              domain={[40, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
              }}
            />
            <Bar
              yAxisId="left"
              dataKey="unit_fuel_cost_tk_kwh"
              name="Fuel Cost (Tk/kWh)"
              stackId="cog"
              fill="var(--color-series-thermal)"
            />
            <Bar
              yAxisId="left"
              dataKey="unit_fixed_cost_tk_kwh"
              name="Fixed Capacity Cost (Tk/kWh)"
              stackId="cog"
              fill="var(--color-series-gas)"
            />
            <Bar
              yAxisId="left"
              dataKey="unit_variable_om_tk_kwh"
              name="Variable O&M (Tk/kWh)"
              stackId="cog"
              fill="var(--color-series-solar)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="plantFactorPct"
              name="Plant Factor (%)"
              stroke="var(--color-accent)"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: "var(--color-accent)" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Domain Insight Callout from Actual_Cost spreadsheet */}
      <div className="bg-bg border-l-4 border-l-accent border border-border rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
        <div className="text-xs text-text-secondary space-y-1">
          <p className="font-heading font-bold text-text-primary">
            Why does Per-Unit Generation Cost jump to 11.25 Tk/kWh in December 2026?
          </p>
          <p>
            During winter (<code className="font-mono text-accent">Dec&apos;26</code>),
            national grid demand drops and Payra&apos;s Plant Factor falls from{" "}
            <strong className="text-text-primary">85.0%</strong> to{" "}
            <strong className="text-text-primary">58.9%</strong> (516 GWh net
            generation). Running the ultra-supercritical boilers at partial load
            degrades thermal efficiency from{" "}
            <strong className="text-text-primary">37.36%</strong> down to{" "}
            <strong className="text-text-primary">26.64%</strong> (Heat Rate rises
            to <strong className="text-text-primary">4,332 Kcal/kWh</strong>), while
            monthly fixed capacity charges are spread across 31% fewer kilowatt-hours.
          </p>
        </div>
      </div>
    </div>
  );
}

