/**
 * What it does: Renders the real-time active power generation area chart (MW) for a single plant in its series color.
 * Who uses it: Imported by `frontend/src/pages/PlantDetailPage.jsx`.
 * What it talks to: Pure Recharts visual component (does not talk to any backend or database).
 */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function LiveGenerationChart({
  history = [],
  plantName = "",
  tableName = "",
  seriesColorVar = "var(--color-series-thermal)",
  timeRange = "live",
  onChangeTimeRange,
}) {
  const ranges = [
    { id: "live", label: "Live (20 pts)" },
    { id: "1h", label: "Recent (60 pts)" },
    { id: "24h", label: "Extended (180 pts)" },
  ];

  return (
    <div className="bg-surface border border-border p-6 rounded-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-heading font-bold text-text-primary">
            Real-Time Generation Output Trajectory (MW) — {plantName}
          </h3>
          <p className="text-xs text-text-secondary">
            Live 5-second stream from PostgreSQL table{" "}
            <code className="text-accent font-mono">{tableName}</code>
          </p>
        </div>

        {onChangeTimeRange && (
          <div className="inline-flex rounded-lg border border-border bg-bg p-1 gap-1">
            {ranges.map((r) => (
              <button
                key={r.id}
                onClick={() => onChangeTimeRange(r.id)}
                className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded cursor-pointer transition-colors ${
                  timeRange === r.id
                    ? "bg-accent text-white"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
            />
            <XAxis
              dataKey="time"
              stroke="var(--color-text-secondary)"
              fontSize={11}
            />
            <YAxis
              stroke="var(--color-text-secondary)"
              domain={["auto", "auto"]}
              fontSize={11}
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
            <Area
              type="monotone"
              dataKey="power"
              name="Active Power (MW)"
              stroke={seriesColorVar}
              strokeWidth={2.5}
              fill={seriesColorVar}
              fillOpacity={0.18}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

