/**
 * What it does: Calculates thermodynamic electricity generation costs ($/kWh and $/MWh) for a power plant.
 * Who uses it: Imported by `gridMetrics.js`, `HomePage.jsx`, `chatbotService.js`, and parked pages.
 * What it talks to: Pure math helper function (does not talk to any backend or database).
 */

export function computePlantCosts(plant) {
  const heatRate = Number(plant?.heat_rate_btu_kwh ?? 8650);
  const fuelPrice = Number(plant?.fuel_unit_price ?? 5.4);
  const vomMwh = Number(plant?.vom_cost_per_mwh ?? 3.8);
  const fixedKwYr = Number(plant?.fixed_cost_per_kw_yr ?? 48.0);

  // Fuel Cost ($/kWh) = (Heat Rate [BTU/kWh] * Fuel Price [$/MMBTU]) / 1,000,000
  const fuelCostKwh = (heatRate * fuelPrice) / 1_000_000;
  const vomCostKwh = vomMwh / 1000;
  const variableCostKwh = fuelCostKwh + vomCostKwh;
  const variableCostMwh = variableCostKwh * 1000;
  const fixedCostKwh = fixedKwYr / 7008;
  const totalLcoeKwh = variableCostKwh + fixedCostKwh;

  return {
    heatRate,
    fuelPrice,
    vomMwh,
    fuelCostKwh,
    vomCostKwh,
    variableCostKwh,
    variableCostMwh,
    fixedCostKwh,
    totalLcoeKwh,
  };
}

