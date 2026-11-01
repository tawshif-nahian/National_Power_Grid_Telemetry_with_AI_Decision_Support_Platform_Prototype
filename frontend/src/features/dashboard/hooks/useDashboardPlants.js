/**
 * What it does: Prepares the 3 power plant cards and their live status badges (Online, Stale, Offline) for `/dashboard`.
 * Who uses it: Imported by `frontend/src/pages/DashboardPage.jsx`.
 * What it talks to: Receives telemetry, plants, and inventory state from `useGridTelemetry` (never talks to Supabase directly).
 */

import payraImg from "../../../assets/plants/payra.svg";
import titasImg from "../../../assets/plants/titas.svg";
import sirajganjImg from "../../../assets/plants/sirajganj.svg";

const PLANT_IMAGES = {
  "PYR-COAL": payraImg,
  "TTS-GAS": titasImg,
  "SRJ-SOLAR": sirajganjImg,
};

function computeOperationalStatus(plant, liveRow) {
  if (plant?.operational_status && plant.operational_status !== "ONLINE") {
    return {
      label: "Offline",
      badgeClass:
        "bg-status-offline/15 text-status-offline border-status-offline/35",
      dotClass: "bg-status-offline",
    };
  }

  if (!liveRow || !liveRow.timestamp) {
    return {
      label: "Stale",
      badgeClass:
        "bg-status-stale/15 text-status-stale border-status-stale/35",
      dotClass: "bg-status-stale",
    };
  }

  const ageSeconds = (Date.now() - new Date(liveRow.timestamp).getTime()) / 1000;
  if (ageSeconds > 60) {
    return {
      label: "Stale",
      badgeClass:
        "bg-status-stale/15 text-status-stale border-status-stale/35",
      dotClass: "bg-status-stale",
    };
  }

  return {
    label: "Online",
    badgeClass:
      "bg-status-online/15 text-status-online border-status-online/35",
    dotClass: "bg-status-online",
  };
}

export function useDashboardPlants({ plants = [], telemetry = {}, inventory = [] }) {
  return plants.map((plant) => {
    const live = telemetry[plant.table_name];
    const inv = inventory.find((i) => i.plant_code === plant.plant_code);
    const statusInfo = computeOperationalStatus(plant, live);

    const seriesDotClass =
      plant.fuel_category === "Coal"
        ? "bg-series-thermal"
        : plant.fuel_category === "Gas"
          ? "bg-series-gas"
          : "bg-series-solar";

    let fuelStatLabel = "Fuel Stock / Supply";
    let fuelStatValue = "—";

    if (plant.plant_code === "PYR-COAL") {
      fuelStatLabel = "Coal Stockpile";
      fuelStatValue =
        inv?.current_stock !== undefined
          ? `${Number(inv.current_stock).toLocaleString()} MT (${inv.days_of_burn}d)`
          : "—";
    } else if (plant.plant_code === "TTS-GAS") {
      fuelStatLabel = "Pipeline Gas Pressure";
      fuelStatValue =
        inv?.gas_pressure_psi !== undefined && inv?.gas_pressure_psi !== null
          ? `${inv.gas_pressure_psi} PSI (${inv.current_stock} MMSCFD)`
          : "—";
    } else if (plant.plant_code === "SRJ-SOLAR") {
      fuelStatLabel = "Solar Irradiance";
      fuelStatValue =
        inv?.current_stock !== undefined
          ? `${inv.current_stock} ${inv.stock_unit}`
          : "Zero Fuel";
    }

    return {
      ...plant,
      image: PLANT_IMAGES[plant.plant_code] || payraImg,
      statusInfo,
      seriesDotClass,
      stats: [
        {
          label: "Installed Capacity",
          value: `${Number(plant.capacity_mw).toFixed(0)} MW`,
        },
        {
          label: "Live Generation",
          value:
            live?.power_output_mw !== undefined
              ? `${Number(live.power_output_mw).toFixed(1)} MW`
              : "—",
          highlight: true,
        },
        {
          label: "Substation Voltage",
          value:
            live?.voltage_kv !== undefined
              ? `${live.voltage_kv} kV`
              : `${plant.substation_kv} kV`,
        },
        {
          label: fuelStatLabel,
          value: fuelStatValue,
        },
      ],
    };
  });
}

