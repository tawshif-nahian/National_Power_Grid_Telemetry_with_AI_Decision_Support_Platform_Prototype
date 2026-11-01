/**
 * What it does: Aggregates live Capacity, Generation, Transmission, and Inventory numbers for the 3 monitored plants on the Home page.
 * Who uses it: Imported by `frontend/src/pages/HomePage.jsx`.
 * What it talks to: Uses `fetchInitialGridData` and `subscribeToTelemetryInsert` from `frontend/src/services/telemetryService.js`.
 */

import { useState, useEffect } from "react";
import {
  fetchInitialGridData,
  subscribeToTelemetryInsert,
} from "../services/telemetryService";
import {
  FALLBACK_PLANTS,
  FALLBACK_INVENTORY,
} from "../data/fallbackGridData";

export function useFleetSummary() {
  const [plants, setPlants] = useState(FALLBACK_PLANTS);
  const [telemetry, setTelemetry] = useState({});
  const [inventory, setInventory] = useState(FALLBACK_INVENTORY);

  useEffect(() => {
    let unsubscribe;
    let isMounted = true;

    async function loadSummary() {
      const initial = await fetchInitialGridData();
      if (!isMounted) return;
      setPlants(initial.plants);
      setInventory(initial.inventory);
      setTelemetry(initial.latestTelemetry);

      unsubscribe = subscribeToTelemetryInsert((tableName, newRecord) => {
        if (!isMounted) return;
        setTelemetry((prev) => ({
          ...prev,
          [tableName]: newRecord,
        }));
      });
    }

    loadSummary();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 1. Capacity (MW per fuel type + Total across the 3 plants)
  const payraPlant =
    plants.find((p) => p.plant_code === "PYR-COAL") || FALLBACK_PLANTS[0];
  const titasPlant =
    plants.find((p) => p.plant_code === "TTS-GAS") || FALLBACK_PLANTS[1];
  const sirajganjPlant =
    plants.find((p) => p.plant_code === "SRJ-SOLAR") || FALLBACK_PLANTS[2];

  const thermalCapMw = Number(payraPlant?.capacity_mw ?? 0);
  const gasCapMw = Number(titasPlant?.capacity_mw ?? 0);
  const solarCapMw = Number(sirajganjPlant?.capacity_mw ?? 0);
  const totalCapMw = thermalCapMw + gasCapMw + solarCapMw;

  // 2. Generation (Live MW per fuel type + Total across the 3 plants)
  const payraLive = telemetry["telemetry_payra"];
  const titasLive = telemetry["telemetry_titas"];
  const sirajganjLive = telemetry["telemetry_sirajganj"];

  const thermalGenMw =
    payraLive?.power_output_mw !== undefined
      ? Number(payraLive.power_output_mw)
      : null;
  const gasGenMw =
    titasLive?.power_output_mw !== undefined
      ? Number(titasLive.power_output_mw)
      : null;
  const solarGenMw =
    sirajganjLive?.power_output_mw !== undefined
      ? Number(sirajganjLive.power_output_mw)
      : null;

  const hasAnyLiveGen =
    thermalGenMw !== null || gasGenMw !== null || solarGenMw !== null;
  const totalGenMw = hasAnyLiveGen
    ? (thermalGenMw ?? 0) + (gasGenMw ?? 0) + (solarGenMw ?? 0)
    : null;

  // 3. Transmission (Substation voltage kV per plant + system frequency Hz)
  const payraVoltageKv =
    payraLive?.voltage_kv ?? payraPlant?.substation_kv ?? null;
  const titasVoltageKv =
    titasLive?.voltage_kv ?? titasPlant?.substation_kv ?? null;
  const sirajganjVoltageKv =
    sirajganjLive?.voltage_kv ?? sirajganjPlant?.substation_kv ?? null;
  const gridFreqHz =
    payraLive?.frequency_hz ??
    titasLive?.frequency_hz ??
    sirajganjLive?.frequency_hz ??
    50.0;

  // 4. Inventory (Coal stock MT, Coal days of burn, Gas pressure PSI, Gas daily supply MMSCFD)
  const coalInv = inventory.find((i) => i.plant_code === "PYR-COAL");
  const gasInv = inventory.find((i) => i.plant_code === "TTS-GAS");

  return {
    capacity: {
      thermalMw: `${thermalCapMw.toFixed(0)} MW`,
      gasMw: `${gasCapMw.toFixed(0)} MW`,
      solarMw: `${solarCapMw.toFixed(0)} MW`,
      totalMw: `${totalCapMw.toFixed(0)} MW`,
    },
    generation: {
      thermalMw: thermalGenMw !== null ? `${thermalGenMw.toFixed(1)} MW` : "—",
      gasMw: gasGenMw !== null ? `${gasGenMw.toFixed(1)} MW` : "—",
      solarMw: solarGenMw !== null ? `${solarGenMw.toFixed(1)} MW` : "—",
      totalMw: totalGenMw !== null ? `${totalGenMw.toFixed(1)} MW` : "—",
    },
    transmission: {
      payraKv: payraVoltageKv !== null ? `${payraVoltageKv} kV` : "—",
      titasKv: titasVoltageKv !== null ? `${titasVoltageKv} kV` : "—",
      sirajganjKv:
        sirajganjVoltageKv !== null ? `${sirajganjVoltageKv} kV` : "—",
      frequencyHz: `${Number(gridFreqHz).toFixed(2)} Hz`,
    },
    inventory: {
      coalStockMt:
        coalInv?.current_stock !== undefined
          ? `${Number(coalInv.current_stock).toLocaleString()} MT`
          : "—",
      coalDays:
        coalInv?.days_of_burn !== undefined
          ? `${coalInv.days_of_burn} Days`
          : "—",
      gasPressurePsi:
        gasInv?.gas_pressure_psi !== undefined &&
        gasInv?.gas_pressure_psi !== null
          ? `${gasInv.gas_pressure_psi} PSI`
          : "—",
      gasStockMmscfd:
        gasInv?.current_stock !== undefined
          ? `${gasInv.current_stock} MMSCFD`
          : "—",
    },
  };
}

