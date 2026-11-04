/**
 * What it does: Stores the exact baseline financial, monthly (2026), 25-year tariff, and Annex-I CAPEX numbers
 *               from the official Payra 1320 MW Thermal Power Plant (BCPCL) cost modelling spreadsheets.
 * Who uses it: Imported by `frontend/src/services/costModellingService.js` as fallback data if the SQL tables are not yet created.
 * What it talks to: Pure static data file (does not talk to any backend or database).
 */

export const FALLBACK_PAYRA_ASSUMPTIONS = {
  id: 1,
  plant_code: "PYR-COAL",
  plant_name: "Payra 1320 MW Thermal Power Plant (BCPCL)",
  capacity_mw: 1320.0,
  total_project_cost_tk: 186837462000.0,
  yearly_gross_generation_kwh: 9828720000.0,
  effective_life_years: 25,
  equity_share: 0.3,
  debt_share: 0.7,
  working_capital_tk: 14359183142.32,
  return_on_equity: 0.16,
  loan_interest_rate: 0.03,
  loan_repayment_years: 11,
  grace_period_years: 4,
  working_capital_interest_rate: 0.08,
  exchange_rate_tk_usd: 78.68,
  coal_price_usd_mt: 131.5,
  coal_calorific_value_kcal_kg: 6100.0,
  net_heat_rate_kcal_kwh: 3200.0,
  fixed_om_tk_kw_month: 498.3305,
  vomp_tk_kwh: 0.3,
  lube_oil_tk_kwh: 0.0625,
  internal_loss_pct: 0.03,
  discount_rate: 0.12,
  salvage_value_pct: 0.1,
  plant_factor: 0.85,
  baseline_levelized_tariff_tk_kwh: 8.429462,
};

export const FALLBACK_PAYRA_MONTHLY_2026 = [
  { month_order: 1, month_label: "Jan'26", plant_factor: 0.860378, heat_rate_kcal_kwh: 3234.98, efficiency: 0.265968, energy_kwh: 829060000, fuel_consumption_mt: 439670.82, fuel_price_tk_mt: 10346.42, total_fuel_cost_tk: 4549018962.07, unit_fuel_cost_tk_kwh: 5.48696, total_fixed_cost_tk: 1984488114.14, unit_fixed_cost_tk_kwh: 2.39366, variable_om_cost_tk: 255718000, unit_variable_om_tk_kwh: 0.308443, total_non_fuel_cost_tk: 2240206114.14, unit_non_fuel_cost_tk_kwh: 2.702104, unit_cog_tk_kwh: 8.189064 },
  { month_order: 2, month_label: "Feb'26", plant_factor: 0.839622, heat_rate_kcal_kwh: 3314.95, efficiency: 0.259552, energy_kwh: 809060000, fuel_consumption_mt: 419670.82, fuel_price_tk_mt: 12346.42, total_fuel_cost_tk: 5181432201.42, unit_fuel_cost_tk_kwh: 6.404262, total_fixed_cost_tk: 2004488114.14, unit_fixed_cost_tk_kwh: 2.477552, variable_om_cost_tk: 235718000, unit_variable_om_tk_kwh: 0.291348, total_non_fuel_cost_tk: 2240206114.14, unit_non_fuel_cost_tk_kwh: 2.7689, unit_cog_tk_kwh: 9.173162 },
  { month_order: 3, month_label: "Mar'26", plant_factor: 0.818867, heat_rate_kcal_kwh: 3398.97, efficiency: 0.253135, energy_kwh: 789060000, fuel_consumption_mt: 409670.82, fuel_price_tk_mt: 12346.42, total_fuel_cost_tk: 5057968001.42, unit_fuel_cost_tk_kwh: 6.410118, total_fixed_cost_tk: 2014488114.14, unit_fixed_cost_tk_kwh: 2.553023, variable_om_cost_tk: 275718000, unit_variable_om_tk_kwh: 0.349426, total_non_fuel_cost_tk: 2290206114.14, unit_non_fuel_cost_tk_kwh: 2.902449, unit_cog_tk_kwh: 9.312567 },
  { month_order: 4, month_label: "Apr'26", plant_factor: 0.870756, heat_rate_kcal_kwh: 3196.42, efficiency: 0.269176, energy_kwh: 839060000, fuel_consumption_mt: 439670.82, fuel_price_tk_mt: 13346.42, total_fuel_cost_tk: 5868031421.09, unit_fuel_cost_tk_kwh: 6.993578, total_fixed_cost_tk: 1984488114.14, unit_fixed_cost_tk_kwh: 2.365133, variable_om_cost_tk: 265718000, unit_variable_om_tk_kwh: 0.316685, total_non_fuel_cost_tk: 2250206114.14, unit_non_fuel_cost_tk_kwh: 2.681818, unit_cog_tk_kwh: 9.675396 },
  { month_order: 5, month_label: "May'26", plant_factor: 0.829234, heat_rate_kcal_kwh: 3356.48, efficiency: 0.25634, energy_kwh: 799050000, fuel_consumption_mt: 409670.82, fuel_price_tk_mt: 11346.42, total_fuel_cost_tk: 4648297181.74, unit_fuel_cost_tk_kwh: 5.817279, total_fixed_cost_tk: 2024488114.14, unit_fixed_cost_tk_kwh: 2.533619, variable_om_cost_tk: 285718000, unit_variable_om_tk_kwh: 0.357572, total_non_fuel_cost_tk: 2310206114.14, unit_non_fuel_cost_tk_kwh: 2.891191, unit_cog_tk_kwh: 8.70847 },
  { month_order: 6, month_label: "Jun'26", plant_factor: 0.860378, heat_rate_kcal_kwh: 3234.98, efficiency: 0.265968, energy_kwh: 829060000, fuel_consumption_mt: 419670.82, fuel_price_tk_mt: 12346.42, total_fuel_cost_tk: 5181432201.42, unit_fuel_cost_tk_kwh: 6.249767, total_fixed_cost_tk: 1954488114.14, unit_fixed_cost_tk_kwh: 2.357475, variable_om_cost_tk: 295718000, unit_variable_om_tk_kwh: 0.356691, total_non_fuel_cost_tk: 2250206114.14, unit_non_fuel_cost_tk_kwh: 2.714166, unit_cog_tk_kwh: 8.963933 },
  { month_order: 7, month_label: "July'26", plant_factor: 0.787733, heat_rate_kcal_kwh: 3533.31, efficiency: 0.243511, energy_kwh: 759060000, fuel_consumption_mt: 428670.82, fuel_price_tk_mt: 13346.42, total_fuel_cost_tk: 5721220801.09, unit_fuel_cost_tk_kwh: 7.537244, total_fixed_cost_tk: 1984488114.14, unit_fixed_cost_tk_kwh: 2.614402, variable_om_cost_tk: 254518000, unit_variable_om_tk_kwh: 0.335307, total_non_fuel_cost_tk: 2239006114.14, unit_non_fuel_cost_tk_kwh: 2.949709, unit_cog_tk_kwh: 10.486953 },
  { month_order: 8, month_label: "Aug'26", plant_factor: 0.881133, heat_rate_kcal_kwh: 3158.78, efficiency: 0.272384, energy_kwh: 849060000, fuel_consumption_mt: 487670.82, fuel_price_tk_mt: 11256.42, total_fuel_cost_tk: 5489427567.97, unit_fuel_cost_tk_kwh: 6.4653, total_fixed_cost_tk: 1974488114.14, unit_fixed_cost_tk_kwh: 2.325499, variable_om_cost_tk: 277718000, unit_variable_om_tk_kwh: 0.327089, total_non_fuel_cost_tk: 2252206114.14, unit_non_fuel_cost_tk_kwh: 2.652588, unit_cog_tk_kwh: 9.117888 },
  { month_order: 9, month_label: "Sep'26", plant_factor: 0.787733, heat_rate_kcal_kwh: 3533.31, efficiency: 0.243511, energy_kwh: 759060000, fuel_consumption_mt: 375670.82, fuel_price_tk_mt: 14046.42, total_fuel_cost_tk: 5276830114.86, unit_fuel_cost_tk_kwh: 6.951796, total_fixed_cost_tk: 1984488114.14, unit_fixed_cost_tk_kwh: 2.614402, variable_om_cost_tk: 261718000, unit_variable_om_tk_kwh: 0.344792, total_non_fuel_cost_tk: 2246206114.14, unit_non_fuel_cost_tk_kwh: 2.959194, unit_cog_tk_kwh: 9.91099 },
  { month_order: 10, month_label: "Oct'26", plant_factor: 0.74726, heat_rate_kcal_kwh: 3724.68, efficiency: 0.231, energy_kwh: 720060000, fuel_consumption_mt: 39670.82, fuel_price_tk_mt: 10546.42, total_fuel_cost_tk: 418385126.01, unit_fuel_cost_tk_kwh: 0.581042, total_fixed_cost_tk: 1964488114.14, unit_fixed_cost_tk_kwh: 2.728228, variable_om_cost_tk: 278718000, unit_variable_om_tk_kwh: 0.387076, total_non_fuel_cost_tk: 2243206114.14, unit_non_fuel_cost_tk_kwh: 3.115304, unit_cog_tk_kwh: 3.696346 },
  { month_order: 11, month_label: "Nov'26", plant_factor: 0.715089, heat_rate_kcal_kwh: 3892.25, efficiency: 0.221055, energy_kwh: 689060000, fuel_consumption_mt: 409670.82, fuel_price_tk_mt: 12046.42, total_fuel_cost_tk: 4935066755.51, unit_fuel_cost_tk_kwh: 7.162028, total_fixed_cost_tk: 1964488114.14, unit_fixed_cost_tk_kwh: 2.850968, variable_om_cost_tk: 252718000, unit_variable_om_tk_kwh: 0.366758, total_non_fuel_cost_tk: 2217206114.14, unit_non_fuel_cost_tk_kwh: 3.217726, unit_cog_tk_kwh: 10.379753 },
  { month_order: 12, month_label: "Dec'26", plant_factor: 0.642445, heat_rate_kcal_kwh: 4332.36, efficiency: 0.198598, energy_kwh: 619060000, fuel_consumption_mt: 389670.82, fuel_price_tk_mt: 12046.42, total_fuel_cost_tk: 4694138355.51, unit_fuel_cost_tk_kwh: 7.582687, total_fixed_cost_tk: 1974488114.14, unit_fixed_cost_tk_kwh: 3.189494, variable_om_cost_tk: 292718000, unit_variable_om_tk_kwh: 0.472843, total_non_fuel_cost_tk: 2267206114.14, unit_non_fuel_cost_tk_kwh: 3.662337, unit_cog_tk_kwh: 11.245024 },
];

