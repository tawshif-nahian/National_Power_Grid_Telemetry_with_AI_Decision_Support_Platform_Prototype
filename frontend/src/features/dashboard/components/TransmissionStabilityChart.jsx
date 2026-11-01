/**
 * What it does: Renders a dual-axis line chart showing Substation Bus Voltage (kV) and Synchronous Frequency (Hz) over time.
 * Who uses it: Imported by `frontend/src/pages/PlantDetailPage.jsx`.
 * What it talks to: Pure Recharts visual component (does not talk to any backend or database).
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function TransmissionStabilityChart({
  history = [],
  seriesColorVar = "var(--color-series-thermal)",
}) {
  return (
    <div className="bg-surface border border-border p-6 rounded-xl space-y-4 h-full">
      <div>
        <h3 className="text-base font-heading font-bold text-text-primary">
          Transmission Voltage (kV) &amp; Frequency (Hz)
        </h3>
        <p className="text-xs text-text-secondary">
          Substation busbar stability and 50.00 Hz synchronous grid tracking
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
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
              yAxisId="left"
              stroke="var(--color-text-secondary)"
              domain={["auto", "auto"]}
              fontSize={11}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--color-status-online)"
              domain={[49.85, 50.15]}
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
            <Legend
              wrapperStyle={{
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="voltage"
              name="Bus Voltage (kV)"
              stroke={seriesColorVar}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="freq"
              name="Frequency (Hz)"
              stroke="var(--color-status-online)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

