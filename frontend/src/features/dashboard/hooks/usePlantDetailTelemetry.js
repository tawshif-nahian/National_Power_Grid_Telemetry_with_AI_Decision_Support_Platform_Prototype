/**
 * What it does: Fetches time-series history (Live / 1h / 24h) and live updates for a single power plant on `/dashboard/:plantId`.
 * Who uses it: Imported by `frontend/src/pages/PlantDetailPage.jsx`.
 * What it talks to: Calls `fetchPlantHistory` and `subscribeToTelemetryInsert` from `frontend/src/services/telemetryService.js`.
 */

import { useState, useEffect } from "react";
import {
  fetchPlantHistory,
  subscribeToTelemetryInsert,
} from "../../../services/telemetryService";
import { getAIAdvisory } from "../../../utils/gridMetrics";

const RANGE_LIMITS = {
  live: 20,
  "1h": 60,
  "24h": 180,
};

export function usePlantDetailTelemetry({
  plantId,
  plants = [],
  telemetry = {},
  inventory = [],
}) {
  const numericId = Number(plantId);
  const plant =
    plants.find(
      (p) => p.id === numericId || p.plant_code.toLowerCase() === String(plantId).toLowerCase()
    ) || plants[0];

  const [timeRange, setTimeRange] = useState("live");
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (!plant?.table_name) return undefined;

    let isMounted = true;
    const rowLimit = RANGE_LIMITS[timeRange] || 20;

    fetchPlantHistory(plant.table_name, rowLimit).then((rows) => {
      if (isMounted) {
        setHistory(rows);
        setLoadingHistory(false);
      }
    });

    const unsubscribe = subscribeToTelemetryInsert((tableName, newRecord) => {
      if (!isMounted || tableName !== plant.table_name) return;
      setHistory((prev) => [
        ...prev.slice(-(rowLimit - 1)),
        {
          time: new Date(newRecord.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          power: Number(newRecord.power_output_mw),
          freq: Number(newRecord.frequency_hz),
          voltage: Number(newRecord.voltage_kv),
        },
      ]);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [plant?.table_name, timeRange]);

  const activeTelemetry = plant ? telemetry[plant.table_name] : null;
  const plantInventory = inventory.find(
    (i) => i.plant_code === plant?.plant_code
  );

  const currentFreq = activeTelemetry?.frequency_hz
    ? Number(activeTelemetry.frequency_hz)
    : 50.0;
  const deltaF = (currentFreq - 50.0).toFixed(2);

  const seriesColorVar =
    plant?.fuel_category === "Coal"
      ? "var(--color-series-thermal)"
      : plant?.fuel_category === "Gas"
        ? "var(--color-series-gas)"
        : "var(--color-series-solar)";

  const aiAdvisory = getAIAdvisory(plant, telemetry);

  return {
    plant,
    activeTelemetry,
    plantInventory,
    history,
    loadingHistory,
    timeRange,
    setTimeRange,
    currentFreq,
    deltaF,
    seriesColorVar,
    aiAdvisory,
  };
}

