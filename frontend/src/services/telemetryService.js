/**
 * What it does: Reads power plant data, historical telemetry, and subscribes to 5-second live updates from Supabase.
 * Who uses it: Imported by `frontend/src/hooks/useGridTelemetry.js`.
 * What it talks to: Talks to PostgreSQL tables and Realtime channels via `frontend/src/services/supabaseClient.js`.
 */

import { supabase } from "./supabaseClient";
import {
  FALLBACK_PLANTS,
  FALLBACK_INVENTORY,
  FALLBACK_OUTAGES,
  FALLBACK_RECORDS,
} from "../data/fallbackGridData";

export async function fetchInitialGridData() {
  const { data: plantList } = await supabase
    .from("powerplants")
    .select("*")
    .order("id", { ascending: true });

  const activePlants =
    plantList && plantList.length > 0
      ? plantList.map((p, idx) => ({
          ...FALLBACK_PLANTS[idx],
          ...p,
        }))
      : FALLBACK_PLANTS;

  const { data: invData } = await supabase
    .from("fuel_inventory")
    .select("*")
    .order("id", { ascending: true });

  const { data: outData } = await supabase
    .from("outage_logs")
    .select("*")
    .order("started_at", { ascending: false });

  const { data: recData } = await supabase
    .from("historical_records")
    .select("*")
    .order("record_date", { ascending: false });

  const latestRecords = {};
  for (const p of activePlants) {
    const { data: rows } = await supabase
      .from(p.table_name)
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(1);

    if (rows && rows.length > 0) {
      latestRecords[p.table_name] = rows[0];
    }
  }

  return {
    plants: activePlants,
    inventory: invData && invData.length > 0 ? invData : FALLBACK_INVENTORY,
    outages: outData && outData.length > 0 ? outData : FALLBACK_OUTAGES,
    records: recData && recData.length > 0 ? recData : FALLBACK_RECORDS,
    latestTelemetry: latestRecords,
  };
}

export async function fetchPlantHistory(tableName, limit = 16) {
  const { data: recentRows } = await supabase
    .from(tableName)
    .select("timestamp, power_output_mw, frequency_hz, voltage_kv")
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (!recentRows || recentRows.length === 0) return [];

  return recentRows.reverse().map((r) => ({
    time: new Date(r.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    power: Number(r.power_output_mw),
    freq: Number(r.frequency_hz),
    voltage: Number(r.voltage_kv),
  }));
}

export async function fetchRowsForExport(tableName, rowLimit = 60) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(rowLimit);

  return { data, error };
}

export async function updatePlantParameters(plant) {
  const { error } = await supabase
    .from("powerplants")
    .update({
      heat_rate_btu_kwh: Number(plant.heat_rate_btu_kwh),
      fuel_unit_price: Number(plant.fuel_unit_price),
      vom_cost_per_mwh: Number(plant.vom_cost_per_mwh),
      dispatchable_mw: Number(plant.dispatchable_mw),
      operational_status: plant.operational_status,
    })
    .eq("id", plant.id);

  return { error };
}

export function subscribeToTelemetryInsert(onNewTelemetryRow) {
  const channel = supabase
    .channel("national-grid-cdc")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public" },
      (payload) => {
        const tableName = payload.table;
        const newRecord = payload.new;
        if (tableName && tableName.startsWith("telemetry_")) {
          onNewTelemetryRow(tableName, newRecord);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

