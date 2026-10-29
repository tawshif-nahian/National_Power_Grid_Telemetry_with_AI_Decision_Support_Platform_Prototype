/**
 * What it does: Connects live power grid data from `telemetryService.js` to the website screens.
 * Who uses it: Imported by `frontend/src/App.jsx` and passed down to `HomePage.jsx` and `DashboardPage.jsx`.
 * What it talks to: Talks only to `frontend/src/services/telemetryService.js` and math helpers in `utils/`.
 */

import { useState, useEffect, useRef } from "react";
import {
  fetchInitialGridData,
  fetchPlantHistory,
  fetchRowsForExport,
  subscribeToTelemetryInsert,
} from "../services/telemetryService";
import {
  FALLBACK_PLANTS,
  FALLBACK_INVENTORY,
  FALLBACK_OUTAGES,
  FALLBACK_RECORDS,
} from "../data/fallbackGridData";
import {
  computeNationalGridMetrics,
  getAIAdvisory,
  createBaseDiurnalMix,
} from "../utils/gridMetrics";
import { downloadRowsAsCSV } from "../utils/csvExport";

export function useGridTelemetry() {
  const [plants, setPlants] = useState(FALLBACK_PLANTS);
  const [selectedPlantId, setSelectedPlantId] = useState(1);
  const [telemetry, setTelemetry] = useState({});
  const [history, setHistory] = useState([]);
  const [mixHistory, setMixHistory] = useState(createBaseDiurnalMix);
  const [inventory, setInventory] = useState(FALLBACK_INVENTORY);
  const [outages, setOutages] = useState(FALLBACK_OUTAGES);
  const [records, setRecords] = useState(FALLBACK_RECORDS);
  const [isExporting, setIsExporting] = useState(false);

  const selectedPlantIdRef = useRef(1);
  const plantsRef = useRef(FALLBACK_PLANTS);

  useEffect(() => {
    let unsubscribe;

    async function init() {
      const initial = await fetchInitialGridData();
      setPlants(initial.plants);
      plantsRef.current = initial.plants;
      setInventory(initial.inventory);
      setOutages(initial.outages);
      setRecords(initial.records);
      setTelemetry(initial.latestTelemetry);

      if (initial.plants.length > 0) {
        const defaultHistory = await fetchPlantHistory(
          initial.plants[0].table_name,
          16
        );
        if (defaultHistory.length > 0) {
          setHistory(defaultHistory);
        }
      }

      unsubscribe = subscribeToTelemetryInsert((tableName, newRecord) => {
        setTelemetry((prev) => {
          const updated = { ...prev, [tableName]: newRecord };
          const coalMw = Number(
            updated["telemetry_payra"]?.power_output_mw || 1180
          );
          const gasMw = Number(
            updated["telemetry_titas"]?.power_output_mw || 405
          );
          const solarMw = Number(
            updated["telemetry_sirajganj"]?.power_output_mw || 58
          );
          setMixHistory((prevMix) => [
            ...prevMix.slice(-11),
            {
              time: new Date(newRecord.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
              Coal: coalMw,
              Gas: gasMw,
              Solar: solarMw,
            },
          ]);
          return updated;
        });

        const currentSelected = plantsRef.current.find(
          (p) => p.id === selectedPlantIdRef.current
        );
        if (currentSelected && currentSelected.table_name === tableName) {
          setHistory((prev) => [
            ...prev.slice(-15),
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
        }
      });
    }

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSelectPlant = async (plantId) => {
    setSelectedPlantId(plantId);
    selectedPlantIdRef.current = plantId;
    setHistory([]);

    const plant = plants.find((p) => p.id === plantId);
    if (!plant) return;

    const recentHistory = await fetchPlantHistory(plant.table_name, 16);
    setHistory(recentHistory);
  };

  const selectedPlant =
    plants.find((p) => p.id === selectedPlantId) || plants[0];

  const exportTelemetryCSV = async (
    plantToExport = selectedPlant,
    rowLimit = 60
  ) => {
    if (!plantToExport) return;
    setIsExporting(true);
    try {
      const { data, error } = await fetchRowsForExport(
        plantToExport.table_name,
        rowLimit
      );
      if (error || !data || data.length === 0) {
        alert("No historical telemetry rows found to export.");
        return;
      }
      downloadRowsAsCSV(
        data,
        `${plantToExport.table_name}_${rowLimit}rows_dataset.csv`
      );
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const metrics = computeNationalGridMetrics({
    plants,
    telemetry,
    selectedPlant,
    outages,
  });

  const aiAdvisory = getAIAdvisory(selectedPlant, telemetry);

  return {
    plants,
    setPlants,
    selectedPlantId,
    selectedPlant,
    telemetry,
    history,
    mixHistory,
    inventory,
    outages,
    records,
    isExporting,
    handleSelectPlant,
    exportTelemetryCSV,
    aiAdvisory,
    ...metrics,
  };
}

