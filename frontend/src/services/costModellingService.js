/**
 * What it does: Fetches and updates Payra 1320 MW Cost Modelling data in Supabase, falling back cleanly to the spreadsheet data.
 * Who uses it: Imported only by `frontend/src/features/cost-modelling/hooks/usePayraCostModel.js`.
 * What it talks to: Talks to Supabase tables (`cost_model_assumptions`, `cost_model_monthly_2026`,
 *                   `cost_model_yearly_tariff`, `cost_model_capex_breakdown`) via `supabaseClient.js`.
 */

import { supabase } from "./supabaseClient";
import {
  FALLBACK_PAYRA_ASSUMPTIONS,
  FALLBACK_PAYRA_MONTHLY_2026,
} from "../data/payraCostModelData";
import {
  FALLBACK_PAYRA_YEARLY_TARIFF,
  FALLBACK_PAYRA_CAPEX_BREAKDOWN,
} from "../data/payraLifecycleAndCapexData";

export async function fetchPayraCostModel() {
  try {
    const [assumptionsRes, monthlyRes, yearlyRes, capexRes] = await Promise.all([
      supabase
        .from("cost_model_assumptions")
        .select("*")
        .eq("plant_code", "PYR-COAL")
        .maybeSingle(),
      supabase
        .from("cost_model_monthly_2026")
        .select("*")
        .eq("plant_code", "PYR-COAL")
        .order("month_order", { ascending: true }),
      supabase
        .from("cost_model_yearly_tariff")
        .select("*")
        .eq("plant_code", "PYR-COAL")
        .order("year_number", { ascending: true }),
      supabase
        .from("cost_model_capex_breakdown")
        .select("*")
        .eq("plant_code", "PYR-COAL")
        .order("sl_no", { ascending: true }),
    ]);

    const isFromDb = Boolean(
      assumptionsRes.data &&
        monthlyRes.data?.length > 0 &&
        yearlyRes.data?.length > 0
    );

    return {
      isFromDb,
      assumptions: assumptionsRes.data || FALLBACK_PAYRA_ASSUMPTIONS,
      monthly2026:
        monthlyRes.data && monthlyRes.data.length > 0
          ? monthlyRes.data
          : FALLBACK_PAYRA_MONTHLY_2026,
      yearlyTariff:
        yearlyRes.data && yearlyRes.data.length > 0
          ? yearlyRes.data
          : FALLBACK_PAYRA_YEARLY_TARIFF,
      capexBreakdown:
        capexRes.data && capexRes.data.length > 0
          ? capexRes.data
          : FALLBACK_PAYRA_CAPEX_BREAKDOWN,
    };
  } catch {
    return {
      isFromDb: false,
      assumptions: FALLBACK_PAYRA_ASSUMPTIONS,
      monthly2026: FALLBACK_PAYRA_MONTHLY_2026,
      yearlyTariff: FALLBACK_PAYRA_YEARLY_TARIFF,
      capexBreakdown: FALLBACK_PAYRA_CAPEX_BREAKDOWN,
    };
  }
}

export async function savePayraAssumptions(updatedFields) {
  const { data, error } = await supabase
    .from("cost_model_assumptions")
    .update({
      coal_price_usd_mt: Number(updatedFields.coal_price_usd_mt),
      exchange_rate_tk_usd: Number(updatedFields.exchange_rate_tk_usd),
      plant_factor: Number(updatedFields.plant_factor),
      net_heat_rate_kcal_kwh: Number(updatedFields.net_heat_rate_kcal_kwh),
      updated_at: new Date().toISOString(),
    })
    .eq("plant_code", "PYR-COAL")
    .select()
    .maybeSingle();

  return { data, error };
}

