// Parked: not in the menu yet.
/**
 * What it does: Preserves the original Fuel Inventory, Coal Tonnage & Gas Pressure Reserves page from App.jsx.
 * Who uses it: Currently parked in `_parked/` so no code is deleted.
 * What it talks to: Pure visual UI component displaying `inventory` state.
 */

export default function OldInventoryPage({ inventory }) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs">
        <span className="text-[11px] font-mono uppercase text-amber-700 font-bold">
          NPP India Daily Fuel Stock Standard
        </span>
        <h1 className="text-xl font-bold text-slate-900 mt-1">
          National Fuel Inventory, Coal Tonnage & Gas Pressure Reserves
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitors coal stockpiles (MT), natural gas pipeline pressure (PSI),
          and flags Critical (&lt;7 days) or Super-Critical (&lt;4 days)
          stations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {inventory.map((inv) => {
          const fillPct = Math.min(
            100,
            Math.round((inv.current_stock / inv.max_capacity) * 100)
          );
          const isSuperCrit = inv.reserve_status === "SUPER-CRITICAL";
          const isCrit = inv.reserve_status === "CRITICAL";
          return (
            <div
              key={inv.id}
              className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 shadow-2xs"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {inv.plant_code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {inv.plant_name}
                  </h3>
                  <p className="text-xs text-slate-500">{inv.fuel_type}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded ${
                    isSuperCrit
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : isCrit
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {inv.reserve_status}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Stock Level</span>
                  <span className="font-mono font-bold text-slate-900">
                    {Number(inv.current_stock).toLocaleString()} /{" "}
                    {Number(inv.max_capacity).toLocaleString()} {inv.stock_unit}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      isSuperCrit
                        ? "bg-rose-600"
                        : isCrit
                          ? "bg-amber-500"
                          : "bg-emerald-600"
                    }`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block">Days of Burn</span>
                  <span className="text-base font-bold text-slate-900 font-mono">
                    {inv.days_of_burn > 100
                      ? "Renewable"
                      : `${inv.days_of_burn} Days`}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block">
                    {inv.gas_pressure_psi ? "Gas Pressure" : "Daily Burn"}
                  </span>
                  <span className="text-base font-bold text-slate-900 font-mono">
                    {inv.gas_pressure_psi
                      ? `${inv.gas_pressure_psi} PSI`
                      : `${inv.daily_burn_rate} MT/d`}
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

