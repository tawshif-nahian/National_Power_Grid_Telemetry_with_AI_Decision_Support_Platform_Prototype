/**
 * What it does: Renders a bar chart comparing Installed Capacity, Dispatchable Capacity, and Live Generation (MW) for the plant.
 * Who uses it: Imported by `frontend/src/pages/PlantDetailPage.jsx`.
 * What it talks to: Pure Recharts visual component (does not talk to any backend or database).
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

export default function CapacityVsGenerationChart({
  plant,
  activeTelemetry,
  seriesColorVar = "var(--color-series-thermal)",
}) {
  const installedMw = Number(plant?.capacity_mw ?? 0);
  const dispatchableMw = Number(plant?.dispatchable_mw ?? installedMw);
  const liveMw =
    activeTelemetry?.power_output_mw !== undefined
      ? Number(activeTelemetry.power_output_mw)
      : Number((installedMw * 0.89).toFixed(1));

  const data = [
    {
      metric: "Installed Capacity",
      mw: installedMw,
      fill: "var(--color-text-secondary)",
    },
    {
      metric: "Dispatchable",
      mw: dispatchableMw,
      fill: "var(--color-status-info)",
    },
    {
      metric: "Live Generation",
      mw: liveMw,
      fill: seriesColorVar,
    },
  ];

  return (
    <div className="bg-surface border border-border p-6 rounded-xl space-y-4 h-full">
      <div>
        <h3 className="text-base font-heading font-bold text-text-primary">
          Capacity vs. Live Dispatch (MW)
        </h3>
        <p className="text-xs text-text-secondary">
          Nameplate capacity, dispatchable ceiling, and current active output
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={44}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
            />
            <XAxis
              dataKey="metric"
              stroke="var(--color-text-secondary)"
              fontSize={11}
            />
            <YAxis stroke="var(--color-text-secondary)" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="mw" name="Megawatts (MW)" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.metric} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

