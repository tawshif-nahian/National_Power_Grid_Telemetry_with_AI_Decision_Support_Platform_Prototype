/**
 * What it does: Manages state, live "What-If" tariff recalculations, and database saving for the Payra 1320 MW Cost Modelling module.
 * Who uses it: Imported by `frontend/src/pages/CostModellingPage.jsx`.
 * What it talks to: Calls `fetchPayraCostModel` and `savePayraAssumptions` in `frontend/src/services/costModellingService.js`.
 */

import { useState, useEffect, useMemo } from "react";
import {
  fetchPayraCostModel,
  savePayraAssumptions,
} from "../../../services/costModellingService";
import {
  FALLBACK_PAYRA_ASSUMPTIONS,
  FALLBACK_PAYRA_MONTHLY_2026,
} from "../../../data/payraCostModelData";
import {
  FALLBACK_PAYRA_YEARLY_TARIFF,
  FALLBACK_PAYRA_CAPEX_BREAKDOWN,
} from "../../../data/payraLifecycleAndCapexData";

export function usePayraCostModel() {
  const [assumptions, setAssumptions] = useState(FALLBACK_PAYRA_ASSUMPTIONS);
  const [monthly2026, setMonthly2026] = useState(FALLBACK_PAYRA_MONTHLY_2026);
  const [yearlyTariff, setYearlyTariff] = useState(FALLBACK_PAYRA_YEARLY_TARIFF);
  const [capexBreakdown, setCapexBreakdown] = useState(
    FALLBACK_PAYRA_CAPEX_BREAKDOWN
  );
  const [isFromDb, setIsFromDb] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetchPayraCostModel().then((res) => {
      if (!isMounted) return;
      setAssumptions(res.assumptions);
      setMonthly2026(res.monthly2026);
      setYearlyTariff(res.yearlyTariff);
      setCapexBreakdown(res.capexBreakdown);
      setIsFromDb(res.isFromDb);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Exact spreadsheet formula recalculation when any slider changes:
  // Fuel Cost (USD/kWh) = ((Coal Price USD/MT / 1000) / Heating Value kcal/kg) * Net Heat Rate kcal/kWh
  // Fuel Cost (Tk/kWh)  = Fuel Cost (USD/kWh) * Exchange Rate (Tk/USD)
  const computedMetrics = useMemo(() => {
    const coalPriceUsdMt = Number(assumptions.coal_price_usd_mt ?? 131.5);
    const exchangeRate = Number(assumptions.exchange_rate_tk_usd ?? 78.68);
    const heatValueKcalKg = Number(
      assumptions.coal_calorific_value_kcal_kg ?? 6100
    );
    const heatRateKcalKwh = Number(assumptions.net_heat_rate_kcal_kwh ?? 3200);
    const plantFactor = Number(assumptions.plant_factor ?? 0.85);
    const vompTkKwh = Number(assumptions.vomp_tk_kwh ?? 0.3);

    const coalPriceUsdKg = coalPriceUsdMt / 1000;
    const fuelCostUsdKwh = (coalPriceUsdKg / heatValueKcalKg) * heatRateKcalKwh;
    const fuelCostTkKwh = fuelCostUsdKwh * exchangeRate;

    // Baseline non-fuel levelized component at 85% Plant Factor is (8.429462 - 5.427630 - 0.300000) = 2.701832 Tk/kWh.
    // Because fixed charges (Debt service, ROE, Fixed O&M) are spread over generated kWh, they scale inversely with Plant Factor.
    const baseFixedLevelizedTkKwh = 2.701832 * (0.85 / Math.max(0.4, plantFactor));
    const levelizedTariffTkKwh =
      fuelCostTkKwh + vompTkKwh + baseFixedLevelizedTkKwh;

    // Adjust the 25-year tariff curve dynamically for the chart
    const fixedScale = 0.85 / Math.max(0.4, plantFactor);
    const dynamicYearlySchedule = yearlyTariff.map((row) => {
      const capitalAndFixed =
        (Number(row.loan_interest_tk_kwh) +
          Number(row.roe_tk_kwh) +
          Number(row.working_cap_interest_tk_kwh) +
          Number(row.depreciation_tk_kwh) +
          Number(row.fixed_om_tk_kwh)) *
        fixedScale;

      const totalTariff = capitalAndFixed + vompTkKwh + fuelCostTkKwh;

      return {
        ...row,
        yearLabel: `Y${row.year_number}`,
        capitalChargeTkKwh: Number(
          (
            (Number(row.loan_interest_tk_kwh) +
              Number(row.roe_tk_kwh) +
              Number(row.working_cap_interest_tk_kwh) +
              Number(row.depreciation_tk_kwh)) *
            fixedScale
          ).toFixed(3)
        ),
        fixedOmAdjustedTkKwh: Number(
          (Number(row.fixed_om_tk_kwh) * fixedScale).toFixed(3)
        ),
        fuelCostAdjustedTkKwh: Number(fuelCostTkKwh.toFixed(3)),
        totalTariffTkKwh: Number(totalTariff.toFixed(3)),
        loanBalanceBillionTk: Number(
          (Number(row.loan_ending_balance_tk) / 1_000_000_000).toFixed(2)
        ),
        equityBalanceBillionTk: Number(
          (Number(row.equity_ending_balance_tk) / 1_000_000_000).toFixed(2)
        ),
      };
    });

    return {
      coalPriceUsdKg,
      fuelCostUsdKwh,
      fuelCostTkKwh,
      baseFixedLevelizedTkKwh,
      levelizedTariffTkKwh,
      dynamicYearlySchedule,
    };
  }, [assumptions, yearlyTariff]);

  const updateAssumptionField = (field, value) => {
    setAssumptions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetToSpreadsheetBaseline = () => {
    setAssumptions(FALLBACK_PAYRA_ASSUMPTIONS);
    setSaveMessage("Reset to official BCPCL spreadsheet baseline.");
    setTimeout(() => setSaveMessage(""), 3500);
  };

  const handleSaveAssumptions = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      const { error } = await savePayraAssumptions(assumptions);
      if (error) {
        setSaveMessage(
          "Updated in session (run 04_cost_modelling_tables.sql in Supabase to persist)."
        );
      } else {
        setIsFromDb(true);
        setSaveMessage("Saved Payra assumptions to Supabase PostgreSQL.");
      }
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(""), 4500);
    }
  };

  return {
    assumptions,
    monthly2026,
    yearlyTariff: computedMetrics.dynamicYearlySchedule,
    capexBreakdown,
    computedMetrics,
    isFromDb,
    saving,
    saveMessage,
    updateAssumptionField,
    resetToSpreadsheetBaseline,
    handleSaveAssumptions,
  };
}

