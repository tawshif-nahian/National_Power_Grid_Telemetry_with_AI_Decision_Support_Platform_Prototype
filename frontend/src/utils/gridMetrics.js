/**
 * What it does: Computes live national power grid totals, weighted costs, carbon intensity, and AI dispatch advisories.
 * Who uses it: Imported by `frontend/src/hooks/useGridTelemetry.js`.
 * What it talks to: Uses `computePlantCosts` from `costCalculations.js` (does not talk to any backend or database).
 */

import { computePlantCosts } from "./costCalculations";

export function computeNationalGridMetrics({
  plants,
  telemetry,
  selectedPlant,
  outages,
}) {
  const activeTelemetry = selectedPlant
    ? telemetry[selectedPlant.table_name]
    : null;

  const coalPower = Number(
    telemetry["telemetry_payra"]?.power_output_mw || 1185.4
  );
  const gasPower = Number(
    telemetry["telemetry_titas"]?.power_output_mw || 402.8
  );
  const solarPower = Number(
    telemetry["telemetry_sirajganj"]?.power_output_mw || 59.2
  );
  const totalPower = coalPower + gasPower + solarPower;

  const totalCapacity = plants.reduce(
    (acc, cur) => acc + Number(cur?.capacity_mw || 0),
    0
  );
  const nationalPlf =
    totalCapacity > 0
      ? ((totalPower / totalCapacity) * 100).toFixed(1)
      : "89.6";
  const cleanEnergyShare =
    totalPower > 0 ? ((solarPower / totalPower) * 100).toFixed(1) : "3.6";

  const currentFreq = activeTelemetry?.frequency_hz
    ? Number(activeTelemetry.frequency_hz)
    : 50.0;
  const deltaF = (currentFreq - 50.0).toFixed(2);

  const coalCostMwh = computePlantCosts(plants[0]).variableCostMwh;
  const gasCostMwh = computePlantCosts(plants[1]).variableCostMwh;
  const solarCostMwh = computePlantCosts(plants[2]).variableCostMwh;
  const weightedCostMwh =
    totalPower > 0
      ? (
          (coalPower * coalCostMwh +
            gasPower * gasCostMwh +
            solarPower * solarCostMwh) /
          totalPower
        ).toFixed(2)
      : "48.20";

  const weightedCarbon =
    totalPower > 0
      ? Math.round(
          (coalPower * 820 + gasPower * 440 + solarPower * 20) / totalPower
        )
      : 695;

  const offlineCapacityMw = outages
    .filter((o) => o.status === "ACTIVE")
    .reduce((acc, o) => acc + Number(o.capacity_offline_mw || 0), 0);

  return {
    activeTelemetry,
    coalPower,
    gasPower,
    solarPower,
    totalPower,
    totalCapacity,
    nationalPlf,
    cleanEnergyShare,
    currentFreq,
    deltaF,
    weightedCostMwh,
    weightedCarbon,
    offlineCapacityMw,
  };
}

export function getAIAdvisory(plant, telemetry) {
  const live = telemetry[plant?.table_name];
  const plantCode = plant?.plant_code;
  const freq = live?.frequency_hz ? Number(live.frequency_hz) : 50.0;
  const df = (freq - 50.0).toFixed(2);
  const load = live?.grid_load_pct ? Number(live.grid_load_pct) : 89.2;
  const temp = live?.temperature_c ? Number(live.temperature_c) : 540.0;
  const pwr = live?.power_output_mw ? Number(live.power_output_mw) : 59.2;

  if (plantCode === "SRJ-SOLAR") {
    return {
      title: "Zero-Marginal-Cost Clean Energy Priority",
      status: "MERIT-ORDER RANK #1",
      recommendation: `PV array at ${temp}°C delivering ${pwr} MW at $0.0008/kWh variable O&M. Recommend 100% uncurtailed grid injection.`,
      action: "Maintain 100% Solar Dispatch Priority",
      severity: "optimal",
    };
  }
  if (freq < 49.92) {
    return {
      title: "Primary Governor Frequency Support",
      status: "DYNAMIC RAMP REQUIRED",
      recommendation: `Sub-nominal frequency detected (Δf = ${df} Hz). Recommend dispatching +15 MW fast spinning reserve.`,
      action: "Execute +15 MW Governor Ramp",
      severity: "warning",
    };
  }
  if (temp > 544.0 && plantCode === "PYR-COAL") {
    return {
      title: "Superheater Thermal Stress Alert",
      status: "THERMAL STRAIN",
      recommendation: `Main steam temperature (${temp}°C) exceeds nominal 540°C envelope. Initiate soot-blowing cycle.`,
      action: "Trigger Soot-Blower Cycle",
      severity: "warning",
    };
  }
  return {
    title: "Merit-Order Economic Dispatch",
    status: "OPTIMAL SYNC",
    recommendation: `Unit operating at ${load}% load factor within PGCB Grid Code frequency and voltage limits.`,
    action: "Maintain Base-Load Setpoint",
    severity: "optimal",
  };
}

export function createBaseDiurnalMix() {
  return Array.from({ length: 12 }, (_, i) => {
    const hr = `${(i * 2).toString().padStart(2, "0")}:00`;
    const isDaylight = i >= 3 && i <= 8;
    return {
      time: hr,
      Coal: 1140 + Math.round(Math.sin(i / 2) * 55),
      Gas: 385 + Math.round(Math.cos(i / 2) * 30),
      Solar: isDaylight
        ? Math.round(Math.sin(((i - 3) / 5) * Math.PI) * 62)
        : 0,
    };
  });
}

