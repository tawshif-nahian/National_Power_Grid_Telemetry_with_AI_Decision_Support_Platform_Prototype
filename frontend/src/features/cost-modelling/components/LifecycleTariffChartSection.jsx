/**
 * What it does: Renders Part 3 of the Payra Cost Model — the 25-Year Lifecycle Tariff & Debt/Equity Amortization chart (Y1–Y25).
 * Who uses it: Imported by `frontend/src/pages/CostModellingPage.jsx`.
 * What it talks to: Pure Recharts visual component displaying the dynamic 25-year schedule from `usePayraCostModel`.
 */

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingDown } from "lucide-react";

export default function LifecycleTariffChartSection({ yearlyTariff = [] }) {
  const y1Tariff = yearlyTariff[0]?.totalTariffTkKwh ?? 7.98;
  const y5Tariff = yearlyTariff[4]?.totalTariffTkKwh ?? 9.02;
  const y16Tariff = yearlyTariff[15]?.totalTariffTkKwh ?? 7.58;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-accent" />
            <h3 className="text-base sm:text-lg font-heading font-bold text-text-primary">
              Part 3: 25-Year Lifecycle Tariff &amp; Debt/Equity Amortization (Y1 – Y25)
            </h3>
          </div>
          <p className="text-xs text-text-secondary max-w-3xl">
            Tracks the 3 distinct tariff eras across Payra&apos;s 25-year Power
            Purchase Agreement (PPA) alongside declining project debt (130.79B Tk)
            and equity (56.05B Tk) balances.
          </p>
        </div>

        {/* 3 Era Summary Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
          <div className="px-3 py-2 rounded-lg bg-bg border border-border">
            <span className="text-[10px] uppercase text-text-secondary block">
              Y1–Y4 (Grace Period)
            </span>
            <strong className="text-text-primary">{y1Tariff.toFixed(2)} Tk/kWh</strong>
          </div>
          <div className="px-3 py-2 rounded-lg bg-bg border border-accent">
            <span className="text-[10px] uppercase text-text-secondary block">
              Y5–Y15 (Loan Payback)
            </span>
            <strong className="text-accent">{y5Tariff.toFixed(2)} Tk/kWh</strong>
          </div>
          <div className="px-3 py-2 rounded-lg bg-bg border border-border">
            <span className="text-[10px] uppercase text-text-secondary block">
              Y16–Y25 (Debt-Free)
            </span>
            <strong className="text-status-online">{y16Tariff.toFixed(2)} Tk/kWh</strong>
          </div>
        </div>
      </div>

      {/* 25-Year Composed Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={yearlyTariff}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
            />
            <XAxis
              dataKey="yearLabel"
              stroke="var(--color-text-secondary)"
              fontSize={11}
            />
            <YAxis
              yAxisId="tariff"
              stroke="var(--color-accent)"
              fontSize={11}
              unit=" Tk"
              domain={[0, 12]}
            />
            <YAxis
              yAxisId="balance"
              orientation="right"
              stroke="var(--color-text-secondary)"
              fontSize={11}
              unit="B"
              domain={[0, 145]}
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
            <Area
              yAxisId="balance"
              type="monotone"
              dataKey="loanBalanceBillionTk"
              name="Remaining Debt Balance (Billion Tk)"
              stroke="var(--color-series-thermal)"
              fill="var(--color-series-thermal)"
              fillOpacity={0.16}
            />
            <Area
              yAxisId="balance"
              type="monotone"
              dataKey="equityBalanceBillionTk"
              name="Remaining Equity Balance (Billion Tk)"
              stroke="var(--color-series-gas)"
              fill="var(--color-series-gas)"
              fillOpacity={0.14}
            />
            <Line
              yAxisId="tariff"
              type="stepAfter"
              dataKey="totalTariffTkKwh"
              name="Total Generation Tariff (Tk/kWh)"
              stroke="var(--color-accent)"
              strokeWidth={3}
              dot={{ r: 3, fill: "var(--color-accent)" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

