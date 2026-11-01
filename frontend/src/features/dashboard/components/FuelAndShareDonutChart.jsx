/**
 * What it does: Renders a donut chart showing either fuel stock reserve level (%) or live generation share across the 3 plants.
 * Who uses it: Imported by `frontend/src/pages/PlantDetailPage.jsx`.
 * What it talks to: Pure Recharts visual component (does not talk to any backend or database).
 */

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function FuelAndShareDonutChart({
  plant,
  plantInventory,
  coalPower = 1185,
  gasPower = 402,
  solarPower = 59,
  seriesColorVar = "var(--color-series-thermal)",
}) {
  const hasStockCapacity =
    plantInventory &&
    Number(plantInventory.max_capacity) > 0 &&
    plant?.plant_code !== "SRJ-SOLAR";

  const currentStock = Number(plantInventory?.current_stock ?? 0);
  const maxStock = Number(plantInventory?.max_capacity ?? 100);
  const remainingHeadroom = Math.max(0, maxStock - currentStock);

  const chartData = hasStockCapacity
    ? [
        {
          name: `Active Reserve (${plantInventory.stock_unit})`,
          value: currentStock,
          color: seriesColorVar,
        },
        {
          name: "Unfilled Storage Capacity",
          value: remainingHeadroom,
          color: "var(--color-border)",
        },
      ]
    : [
        {
          name: "Payra Thermal (MW)",
          value: Number(coalPower.toFixed(1)),
          color: "var(--color-series-thermal)",
        },
        {
          name: "Titas Gas (MW)",
          value: Number(gasPower.toFixed(1)),
          color: "var(--color-series-gas)",
        },
        {
          name: "Sirajganj Solar (MW)",
          value: Number(solarPower.toFixed(1)),
          color: "var(--color-series-solar)",
        },
      ];

  return (
    <div className="bg-surface border border-border p-6 rounded-xl space-y-4 h-full">
      <div>
        <h3 className="text-base font-heading font-bold text-text-primary">
          {hasStockCapacity
            ? `On-Site Fuel Stock vs. Storage Capacity`
            : `3-Plant Generation Output Share (MW)`}
        </h3>
        <p className="text-xs text-text-secondary">
          {hasStockCapacity
            ? `${plantInventory.fuel_type} • ${plantInventory.days_of_burn} days of burn remaining`
            : `Live solar contribution relative to thermal and combined-cycle fleet`}
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={84}
              paddingAngle={3}
              isAnimationActive={false}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

