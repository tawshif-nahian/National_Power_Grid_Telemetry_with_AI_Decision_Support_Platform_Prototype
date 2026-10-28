import React, { useState, useEffect, useRef } from "react";
import { supabase, GEMINI_API_KEY } from "./supabaseClient";
import {
  Zap,
  Activity,
  Thermometer,
  Gauge,
  Fuel,
  ShieldAlert,
  Radio,
  Clock,
  ArrowRight,
  Download,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  Save,
  Phone,
  Mail,
  MapPin,
  Globe,
  ShieldCheck,
  Sliders,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const FALLBACK_PLANTS = [
  {
    id: 1,
    plant_code: "PYR-COAL",
    name: "Payra 1320 MW Thermal Power Plant",
    table_name: "telemetry_payra",
    fuel_type: "Ultra-Supercritical Coal",
    fuel_category: "Coal",
    region: "South-West (Barishal)",
    location: "Kalapara, Patuakhali",
    capacity_mw: 1320.0,
    dispatchable_mw: 1280.0,
    substation_kv: 400.0,
    units_count: 2,
    commissioning_year: 2020,
    operator: "BCPCL (NWPGCL & CMC)",
    heat_rate_btu_kwh: 8650.0,
    fuel_unit_price: 5.4,
    vom_cost_per_mwh: 3.8,
    fixed_cost_per_kw_yr: 48.0,
    design_efficiency_pct: 43.5,
    carbon_factor_kg_mwh: 820.0,
    operational_status: "ONLINE",
  },
  {
    id: 2,
    plant_code: "TTS-GAS",
    name: "Titas 450 MW Combined Cycle Station",
    table_name: "telemetry_titas",
    fuel_type: "Combined Cycle Gas (CCGT)",
    fuel_category: "Gas",
    region: "Central-East (Cumilla)",
    location: "Titas, Brahmanbaria",
    capacity_mw: 450.0,
    dispatchable_mw: 435.0,
    substation_kv: 230.0,
    units_count: 2,
    commissioning_year: 2018,
    operator: "Ashuganj Power / BPDB",
    heat_rate_btu_kwh: 6850.0,
    fuel_unit_price: 6.2,
    vom_cost_per_mwh: 2.5,
    fixed_cost_per_kw_yr: 28.0,
    design_efficiency_pct: 56.0,
    carbon_factor_kg_mwh: 440.0,
    operational_status: "ONLINE",
  },
  {
    id: 3,
    plant_code: "SRJ-SOLAR",
    name: "Sirajganj 68 MW Solar Park",
    table_name: "telemetry_sirajganj",
    fuel_type: "Utility-Scale Solar PV",
    fuel_category: "Solar",
    region: "North-West (Rajshahi)",
    location: "Soydabad, Sirajganj",
    capacity_mw: 68.0,
    dispatchable_mw: 65.0,
    substation_kv: 132.0,
    units_count: 1,
    commissioning_year: 2021,
    operator: "NWPGCL / CREC",
    heat_rate_btu_kwh: 0.0,
    fuel_unit_price: 0.0,
    vom_cost_per_mwh: 0.8,
    fixed_cost_per_kw_yr: 18.0,
    design_efficiency_pct: 91.5,
    carbon_factor_kg_mwh: 20.0,
    operational_status: "ONLINE",
  },
];

const FALLBACK_INVENTORY = [
  {
    id: 1,
    plant_code: "PYR-COAL",
    plant_name: "Payra 1320 MW Thermal Power Plant",
    fuel_type: "Sub-Bituminous Coal",
    stock_unit: "Metric Tons (MT)",
    current_stock: 74500,
    max_capacity: 180000,
    daily_burn_rate: 11520,
    days_of_burn: 6.5,
    gas_pressure_psi: null,
    supply_source: "Kalimantan Index (Indonesia) via Payra Port",
    next_shipment_eta: "48 Hours (MV Bulk Star)",
    reserve_status: "CRITICAL",
  },
  {
    id: 2,
    plant_code: "TTS-GAS",
    plant_name: "Titas 450 MW Combined Cycle Station",
    fuel_type: "Pipeline Natural Gas",
    stock_unit: "MMSCFD",
    current_stock: 68.4,
    max_capacity: 85.0,
    daily_burn_rate: 64.0,
    days_of_burn: 3.8,
    gas_pressure_psi: 412.5,
    supply_source: "Bakhrabad / GTCL National Gas Grid",
    next_shipment_eta: "Continuous Pipeline (Pressure Sag)",
    reserve_status: "SUPER-CRITICAL",
  },
  {
    id: 3,
    plant_code: "SRJ-SOLAR",
    plant_name: "Sirajganj 68 MW Solar Park",
    fuel_type: "Solar Irradiance (GHI)",
    stock_unit: "kWh/m²/day",
    current_stock: 5.45,
    max_capacity: 6.5,
    daily_burn_rate: 0.0,
    days_of_burn: 999.0,
    gas_pressure_psi: null,
    supply_source: "Diurnal Solar Irradiance (Padma Basin)",
    next_shipment_eta: "Continuous Daylight",
    reserve_status: "NORMAL",
  },
];

const FALLBACK_OUTAGES = [
  {
    id: 1,
    plant_code: "PYR-COAL",
    plant_name: "Payra 1320 MW Thermal Power Plant",
    unit_identifier: "Unit-2 Auxiliary Mill B",
    outage_category: "PLANNED",
    capacity_offline_mw: 40.0,
    cause_code: "BLR-MILL-PM04",
    description:
      "Scheduled coal pulverizer roller inspection and soot-blower calibration.",
    started_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    estimated_restoration: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    status: "ACTIVE",
  },
  {
    id: 2,
    plant_code: "TTS-GAS",
    plant_name: "Titas 450 MW Combined Cycle Station",
    unit_identifier: "HRSG Bypass Valve #1",
    outage_category: "FORCED",
    capacity_offline_mw: 15.0,
    cause_code: "GT-EXH-TRIP09",
    description:
      "Partial derating due to GTCL pipeline supply pressure sag below 420 PSI.",
    started_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    estimated_restoration: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    status: "ACTIVE",
  },
  {
    id: 3,
    plant_code: "SRJ-SOLAR",
    plant_name: "Sirajganj 68 MW Solar Park",
    unit_identifier: "Inverter Block C-04",
    outage_category: "RESERVE_SHUTDOWN",
    capacity_offline_mw: 3.0,
    cause_code: "INV-VAR-SYNC",
    description: "Reactive power (kVAR) harmonic filter maintenance completed.",
    started_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    estimated_restoration: new Date(
      Date.now() - 24 * 3600 * 1000,
    ).toISOString(),
    status: "RESOLVED",
  },
];

const FALLBACK_RECORDS = [
  {
    id: 1,
    record_date: "2026-10-18",
    peak_demand_mw: 1642.5,
    total_generation_mwh: 36840.0,
    coal_share_pct: 71.2,
    gas_share_pct: 25.1,
    solar_share_pct: 3.7,
    avg_frequency_hz: 50.01,
    avg_generation_cost_usd_kwh: 0.0482,
    carbon_intensity_kg_mwh: 692.4,
    milestone_note: "Nominal Autumn Grid Dispatch",
  },
  {
    id: 2,
    record_date: "2026-10-19",
    peak_demand_mw: 1688.0,
    total_generation_mwh: 37910.0,
    coal_share_pct: 70.8,
    gas_share_pct: 25.4,
    solar_share_pct: 3.8,
    avg_frequency_hz: 49.98,
    avg_generation_cost_usd_kwh: 0.0486,
    carbon_intensity_kg_mwh: 688.1,
    milestone_note: "High Industrial Afternoon Peak",
  },
  {
    id: 3,
    record_date: "2026-10-20",
    peak_demand_mw: 1715.4,
    total_generation_mwh: 38620.0,
    coal_share_pct: 72.0,
    gas_share_pct: 24.1,
    solar_share_pct: 3.9,
    avg_frequency_hz: 49.96,
    avg_generation_cost_usd_kwh: 0.0479,
    carbon_intensity_kg_mwh: 695.0,
    milestone_note: "Weekly Peak Generation Milestone",
  },
  {
    id: 4,
    record_date: "2026-10-21",
    peak_demand_mw: 1605.2,
    total_generation_mwh: 35400.0,
    coal_share_pct: 69.5,
    gas_share_pct: 26.5,
    solar_share_pct: 4.0,
    avg_frequency_hz: 50.02,
    avg_generation_cost_usd_kwh: 0.0491,
    carbon_intensity_kg_mwh: 679.3,
    milestone_note: "Cloud Cover Solar Dip",
  },
  {
    id: 5,
    record_date: "2026-10-22",
    peak_demand_mw: 1660.8,
    total_generation_mwh: 37120.0,
    coal_share_pct: 71.0,
    gas_share_pct: 25.0,
    solar_share_pct: 4.0,
    avg_frequency_hz: 50.0,
    avg_generation_cost_usd_kwh: 0.0484,
    carbon_intensity_kg_mwh: 686.5,
    milestone_note: "Zero Frequency Excursion Day",
  },
  {
    id: 6,
    record_date: "2026-10-23",
    peak_demand_mw: 1742.0,
    total_generation_mwh: 39150.0,
    coal_share_pct: 71.8,
    gas_share_pct: 24.3,
    solar_share_pct: 3.9,
    avg_frequency_hz: 49.99,
    avg_generation_cost_usd_kwh: 0.0481,
    carbon_intensity_kg_mwh: 691.2,
    milestone_note: "Monthly Peak Demand Record",
  },
];

// 3 Generic Auto-Sliding Cover Slides (Modeled directly after NPP India Cover Banner)
const COVER_SLIDES = [
  {
    badge: "UNIFIED NATIONAL TELEMETRY & DISPATCH PORTAL",
    headlineMain: "A Centralized Platform for",
    headlineAccent: "Collation and Dissemination",
    headlineSub: "of National Power Sector Intelligence",
    quote:
      "“Integrating real-time generation telemetry, transmission busbar stability, and thermodynamic cost modeling into one unified national window.”",
    bgGradient: "from-[#1e293b] via-[#1e3a5f] to-[#0f172a]",
    accentColor: "#f59e0b",
  },
  {
    badge: "NATIONAL ENERGY CONSERVATION MANDATE",
    headlineMain: "Use Electricity Efficiently —",
    headlineAccent: "Every Kilowatt Saved",
    headlineSub: "is a Kilowatt Generated for the Nation",
    quote:
      "“Optimizing thermal heat rates and minimizing transmission losses strengthens industrial productivity and preserves strategic fuel reserves.”",
    bgGradient: "from-[#1f2937] via-[#1e3a3a] to-[#0f172a]",
    accentColor: "#10b981",
  },
  {
    badge: "ECONOMIC MERIT-ORDER & CLEAN ENERGY TRANSITION",
    headlineMain: "Data-Driven Dispatch for",
    headlineAccent: "Reliable, Low-Cost & Clean",
    headlineSub: "Electricity Across Every Grid Node",
    quote:
      "“Prioritizing zero-marginal-cost renewable generation alongside high-efficiency combined-cycle and supercritical thermal stations.”",
    bgGradient: "from-[#1e293b] via-[#2e2640] to-[#0f172a]",
    accentColor: "#38bdf8",
  },
];

// Thermodynamic Cost Formula Calculator
function computePlantCosts(plant) {
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

export default function App() {
  const [portalMode, setPortalMode] = useState("user"); // 'user' | 'admin'
  const [currentPage, setCurrentPage] = useState("home");
  const [plants, setPlants] = useState(FALLBACK_PLANTS);
  const [selectedPlantId, setSelectedPlantId] = useState(1);
  const [telemetry, setTelemetry] = useState({});
  const [history, setHistory] = useState([]);
  const [mixHistory, setMixHistory] = useState([]);
  const [inventory, setInventory] = useState(FALLBACK_INVENTORY);
  const [outages, setOutages] = useState(FALLBACK_OUTAGES);
  const [records, setRecords] = useState(FALLBACK_RECORDS);
  const [isExporting, setIsExporting] = useState(false);
  const [exportLimit, setExportLimit] = useState(60);

  // Cover Photo Carousel state
  const [slideIdx, setSlideIdx] = useState(0);

  // Cost Engine Interactive Sliders
  const [coalPriceSim, setCoalPriceSim] = useState(5.4);
  const [gasPriceSim, setGasPriceSim] = useState(6.2);

  // AI Chatbot state
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: "Welcome to the National Power Portal AI Decision-Support Assistant. Ask me about live generation (MW), grid frequency (Hz), merit-order costs ($/kWh), or fuel stock alerts.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Admin status banner
  const [adminSaveMsg, setAdminSaveMsg] = useState("");

  const selectedPlantIdRef = useRef(1);

  // Auto-slide cover photos every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % COVER_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial data & subscribe to PostgreSQL Realtime CDC
  useEffect(() => {
    let activeChannel;

    async function init() {
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

      setPlants(activePlants);

      const { data: invData } = await supabase
        .from("fuel_inventory")
        .select("*")
        .order("id", { ascending: true });
      if (invData && invData.length > 0) setInventory(invData);

      const { data: outData } = await supabase
        .from("outage_logs")
        .select("*")
        .order("started_at", { ascending: false });
      if (outData && outData.length > 0) setOutages(outData);

      const { data: recData } = await supabase
        .from("historical_records")
        .select("*")
        .order("record_date", { ascending: false });
      if (recData && recData.length > 0) setRecords(recData);

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
      setTelemetry(latestRecords);

      if (activePlants.length > 0) {
        const defaultPlant = activePlants[0];
        const { data: initialHistory } = await supabase
          .from(defaultPlant.table_name)
          .select("timestamp, power_output_mw, frequency_hz, voltage_kv")
          .order("timestamp", { ascending: false })
          .limit(16);

        if (initialHistory && initialHistory.length > 0) {
          setHistory(
            initialHistory.reverse().map((r) => ({
              time: new Date(r.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
              power: Number(r.power_output_mw),
              freq: Number(r.frequency_hz),
              voltage: Number(r.voltage_kv),
            })),
          );
        }
      }

      // Diurnal stacked fuel-mix baseline (Open Electricity style)
      const baseMix = Array.from({ length: 12 }, (_, i) => {
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
      setMixHistory(baseMix);

      activeChannel = supabase
        .channel("national-grid-cdc")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public" },
          (payload) => {
            const tableName = payload.table;
            const newRecord = payload.new;

            if (tableName.startsWith("telemetry_")) {
              setTelemetry((prev) => {
                const updated = { ...prev, [tableName]: newRecord };
                const coalMw = Number(
                  updated["telemetry_payra"]?.power_output_mw || 1180,
                );
                const gasMw = Number(
                  updated["telemetry_titas"]?.power_output_mw || 405,
                );
                const solarMw = Number(
                  updated["telemetry_sirajganj"]?.power_output_mw || 58,
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

              const currentSelected = activePlants.find(
                (p) => p.id === selectedPlantIdRef.current,
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
            }
          },
        )
        .subscribe();
    }

    init();

    return () => {
      if (activeChannel) supabase.removeChannel(activeChannel);
    };
  }, []);

  const handleSelectPlant = async (plantId) => {
    setSelectedPlantId(plantId);
    selectedPlantIdRef.current = plantId;
    setHistory([]);

    const plant = plants.find((p) => p.id === plantId);
    if (!plant) return;

    const { data: recentRows } = await supabase
      .from(plant.table_name)
      .select("timestamp, power_output_mw, frequency_hz, voltage_kv")
      .order("timestamp", { ascending: false })
      .limit(16);

    if (recentRows) {
      setHistory(
        recentRows.reverse().map((r) => ({
          time: new Date(r.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          power: Number(r.power_output_mw),
          freq: Number(r.frequency_hz),
          voltage: Number(r.voltage_kv),
        })),
      );
    }
  };

  const exportTelemetryCSV = async (
    plantToExport = selectedPlant,
    rowLimit = exportLimit,
  ) => {
    if (!plantToExport) return;
    setIsExporting(true);

    try {
      const { data, error } = await supabase
        .from(plantToExport.table_name)
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(rowLimit);

      if (error || !data || data.length === 0) {
        alert("No historical telemetry rows found to export.");
        setIsExporting(false);
        return;
      }

      const headers = Object.keys(data[0]).join(",");
      const rows = data.map((row) => Object.values(row).join(",")).join("\n");
      const csvContent = `${headers}\n${rows}`;

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${plantToExport.table_name}_${rowLimit}rows_dataset.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const selectedPlant =
    plants.find((p) => p.id === selectedPlantId) || plants[0];
  const activeTelemetry = selectedPlant
    ? telemetry[selectedPlant.table_name]
    : null;

  // Live National Grid Aggregations
  const coalPower = Number(
    telemetry["telemetry_payra"]?.power_output_mw || 1185.4,
  );
  const gasPower = Number(
    telemetry["telemetry_titas"]?.power_output_mw || 402.8,
  );
  const solarPower = Number(
    telemetry["telemetry_sirajganj"]?.power_output_mw || 59.2,
  );
  const totalPower = coalPower + gasPower + solarPower;

  const totalCapacity = plants.reduce(
    (acc, cur) => acc + Number(cur?.capacity_mw || 0),
    0,
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

  // Weighted average cost ($/MWh) & carbon intensity (kg CO2/MWh)
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
          (coalPower * 820 + gasPower * 440 + solarPower * 20) / totalPower,
        )
      : 695;

  const offlineCapacityMw = outages
    .filter((o) => o.status === "ACTIVE")
    .reduce((acc, o) => acc + Number(o.capacity_offline_mw || 0), 0);

  // AI Advisory Generator
  const getAIAdvisory = (plant = selectedPlant) => {
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
  };

  const aiAdvisory = getAIAdvisory(selectedPlant);

  // Chatbot Handler
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);

    const gridContext = `Total Gen: ${totalPower.toFixed(1)} MW / ${totalCapacity} MW (${nationalPlf}% PLF). Payra Coal: ${coalPower} MW ($${computePlantCosts(plants[0]).variableCostKwh.toFixed(4)}/kWh, 6.5d stock). Titas Gas: ${gasPower} MW ($${computePlantCosts(plants[1]).variableCostKwh.toFixed(4)}/kWh, 3.8d stock, 412.5 PSI). Sirajganj Solar: ${solarPower} MW ($0.0008/kWh). Grid Freq: ${currentFreq} Hz.`;

    try {
      if (GEMINI_API_KEY && GEMINI_API_KEY.length > 10) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are the AI Grid Operator Assistant for the National Power Portal. Answer concisely using this live data:\n${gridContext}\n\nQuestion: ${userMsg}`,
                    },
                  ],
                },
              ],
            }),
          },
        );
        const json = await res.json();
        const reply =
          json?.candidates?.[0]?.content?.parts?.[0]?.text ||
          generateDomainFallbackReply(userMsg);
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", text: reply },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", text: generateDomainFallbackReply(userMsg) },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: generateDomainFallbackReply(userMsg) },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  function generateDomainFallbackReply(q) {
    const lower = q.toLowerCase();
    const coalCost = computePlantCosts(plants[0]).variableCostKwh.toFixed(4);
    const gasCost = computePlantCosts(plants[1]).variableCostKwh.toFixed(4);
    const solarCost = computePlantCosts(plants[2]).variableCostKwh.toFixed(4);

    if (
      lower.includes("cost") ||
      lower.includes("merit") ||
      lower.includes("price") ||
      lower.includes("kwh")
    ) {
      return `Merit-Order Dispatch Cost Ranking: 1) Sirajganj Solar PV ($${solarCost}/kWh), 2) Titas 450 MW CCGT Gas ($${gasCost}/kWh), 3) Payra 1320 MW Ultra-Supercritical Coal ($${coalCost}/kWh). Weighted national generation cost is currently $${weightedCostMwh}/MWh.`;
    }
    if (
      lower.includes("fuel") ||
      lower.includes("inventory") ||
      lower.includes("coal") ||
      lower.includes("gas")
    ) {
      return `Fuel Logistics Status: Titas Gas Station is in SUPER-CRITICAL reserve state (3.8 days, 412.5 PSI). Payra Thermal Coal is in CRITICAL state (74,500 MT, 6.5 days of burn; resupply vessel ETA 48 hours).`;
    }
    if (
      lower.includes("freq") ||
      lower.includes("voltage") ||
      lower.includes("hz")
    ) {
      return `Grid Stability: System frequency is synchronized at ${currentFreq.toFixed(2)} Hz (Δf = ${deltaF} Hz). Substation voltages are nominal at 400 kV (Payra), 230 kV (Titas), and 132 kV (Sirajganj).`;
    }
    return `National Grid Summary: Total active generation is ${totalPower.toFixed(1)} MW across ${totalCapacity} MW installed capacity (${nationalPlf}% utilization). Renewable share is ${cleanEnergyShare}% and system frequency is ${currentFreq.toFixed(2)} Hz.`;
  }

  const handleAdminPlantUpdate = async (plant) => {
    setAdminSaveMsg(`Saving ${plant.plant_code} calibration...`);
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

    if (error) {
      setAdminSaveMsg(`Updated in session (${plant.plant_code}).`);
    } else {
      setAdminSaveMsg(`Saved ${plant.plant_code} parameters to PostgreSQL.`);
    }
    setTimeout(() => setAdminSaveMsg(""), 4000);
  };

  // All 6 primary pages clearly visible in a flat horizontal row (NPP India style)
  const navItems = [
    { id: "home", label: "HOME" },
    { id: "dashboard", label: "DASHBOARD" },
    { id: "cost", label: "COST MODEL" },
    { id: "inventory", label: "INVENTORY" },
    { id: "records", label: "RECORDS & OUTAGES" },
    { id: "analysis", label: "AI ASSISTANT" },
  ];

  const activeSlide = COVER_SLIDES[slideIdx];

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-slate-800 font-sans flex flex-col">
      {/* =====================================================================
          1. NPP INDIA STYLE TOP NAVIGATION BAR (Clean White, All Buttons Visible)
          ===================================================================== */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Official Emblem & Two-Tone Title (NPP Style) */}
          <div
            onClick={() => {
              setPortalMode("user");
              setCurrentPage("home");
            }}
            className="flex items-center gap-3.5 cursor-pointer shrink-0"
          >
            <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shadow-2xs">
              <Zap className="h-6 w-6 text-[#1D4ED8] fill-[#F59E0B]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5 tracking-tight">
                <span className="text-xl sm:text-2xl font-black text-[#1D4ED8]">
                  NATIONAL
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#F59E0B]">
                  POWER PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                Remote Monitoring, Cost Modeling & AI Decision Support
              </p>
            </div>
          </div>

          {/* Flat, Spacious Uppercase Navigation Links (No Horizontal Scroll Toggle) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => {
              const isActive = portalMode === "user" && currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setPortalMode("user");
                    setCurrentPage(item.id);
                  }}
                  className={`text-xs lg:text-[13px] font-bold tracking-wider py-2 border-b-2 transition-colors cursor-pointer ${
                    isActive
                      ? "text-[#1D4ED8] border-[#F59E0B]"
                      : "text-slate-700 border-transparent hover:text-[#1D4ED8]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Boxed ADMIN / LOGIN Button (Exact NPP Amber Box Style) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              {currentFreq.toFixed(2)} Hz
            </div>

            <button
              onClick={() =>
                setPortalMode((prev) => (prev === "user" ? "admin" : "user"))
              }
              className={`px-5 py-2.5 text-xs font-bold tracking-wider uppercase border-2 transition-all cursor-pointer ${
                portalMode === "admin"
                  ? "bg-[#F59E0B] text-white border-[#F59E0B]"
                  : "bg-white text-slate-800 border-[#F59E0B] hover:bg-amber-50"
              }`}
            >
              {portalMode === "admin" ? "USER PORTAL" : "ADMIN LOGIN"}
            </button>
          </div>
        </div>

        {/* Mobile Wrap Navigation (Visible on small screens without scrolling) */}
        <div className="flex md:hidden flex-wrap items-center justify-center gap-2 px-4 py-2 bg-slate-50 border-t border-slate-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setPortalMode("user");
                setCurrentPage(item.id);
              }}
              className={`px-2.5 py-1 text-[11px] font-bold rounded ${
                portalMode === "user" && currentPage === item.id
                  ? "bg-[#1D4ED8] text-white"
                  : "text-slate-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* =====================================================================
          2. HOME PAGE: NPP COVER CAROUSEL + DESCRIPTION + OPEN ELECTRICITY VIEW
          ===================================================================== */}
      {portalMode === "user" && currentPage === "home" && (
        <div>
          {/* FULL-WIDTH AUTO-SLIDING COVER BANNER (NPP India Benchmark) */}
          <section
            className={`relative w-full bg-gradient-to-r ${activeSlide.bgGradient} text-white overflow-hidden transition-all duration-700`}
          >
            {/* Subtle Architectural Grid Overlay */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#ffffff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[340px]">
              {/* Left 5 Columns: NPP-Style 3-Segment Power Sector Emblem Graphic */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-white/10 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center shadow-xl">
                  {/* Top Segment: Transmission */}
                  <div className="px-3 py-1 rounded-full bg-rose-700/90 text-[10px] font-bold tracking-widest uppercase text-white mb-2 flex items-center gap-1.5 shadow">
                    <Activity className="h-3.5 w-3.5" /> TRANSMISSION (kV)
                  </div>

                  {/* Center Bulb / Core */}
                  <div className="w-20 h-20 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center my-1 shadow-inner">
                    <Zap className="h-10 w-10 text-amber-400 fill-amber-400" />
                  </div>

                  {/* Bottom Left & Right Pills: Capacity & Generation */}
                  <div className="flex items-center justify-between w-full gap-2 mt-2">
                    <span className="flex-1 py-1 px-2 rounded bg-sky-600/90 text-[10px] font-bold uppercase tracking-wider text-white">
                      CAPACITY
                    </span>
                    <span className="flex-1 py-1 px-2 rounded bg-amber-600/90 text-[10px] font-bold uppercase tracking-wider text-white">
                      GENERATION
                    </span>
                  </div>
                </div>
              </div>

              {/* Right 7 Columns: Cover Headline & Energy Quote */}
              <div className="lg:col-span-7 text-center lg:text-left space-y-4">
                <span className="inline-block text-[11px] font-mono tracking-widest uppercase px-3 py-1 rounded bg-white/10 text-slate-200 border border-white/15">
                  {activeSlide.badge}
                </span>

                <h1 className="text-2xl sm:text-4xl font-serif font-bold leading-snug tracking-wide text-white">
                  {activeSlide.headlineMain}{" "}
                  <span style={{ color: activeSlide.accentColor }}>
                    {activeSlide.headlineAccent}
                  </span>{" "}
                  {activeSlide.headlineSub}
                </h1>

                <p className="text-sm sm:text-base text-slate-200 italic font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {activeSlide.quote}
                </p>

                {/* Slide Indicators */}
                <div className="pt-2 flex items-center justify-center lg:justify-start gap-2">
                  {COVER_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlideIdx(i)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        slideIdx === i
                          ? "w-8 bg-[#F59E0B]"
                          : "w-2.5 bg-white/40 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Left & Right Carousel Chevrons (NPP Screenshot Style) */}
            <button
              onClick={() =>
                setSlideIdx(
                  (prev) =>
                    (prev - 1 + COVER_SLIDES.length) % COVER_SLIDES.length,
                )
              }
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="h-9 w-9" />
            </button>
            <button
              onClick={() =>
                setSlideIdx((prev) => (prev + 1) % COVER_SLIDES.length)
              }
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="h-9 w-9" />
            </button>
          </section>

          {/* NPP-STYLE PLATFORM DESCRIPTION STRIP RIGHT UNDER COVER PHOTOS */}
          <section className="bg-[#EEF2F6] border-b border-slate-200 py-6 px-6">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>National Power Portal (NPP Blueprint)</strong> is a
                unified supervisory system for the national power sector that
                facilitates real-time telemetry capture (every 5 seconds) from
                coal, gas, and solar utilities. Main operational telemetry can
                be viewed in the{" "}
                <button
                  onClick={() => setCurrentPage("dashboard")}
                  className="text-[#1D4ED8] font-semibold underline cursor-pointer"
                >
                  Dashboard
                </button>
                , thermodynamic $/kWh generation formulas in the{" "}
                <button
                  onClick={() => setCurrentPage("cost")}
                  className="text-[#1D4ED8] font-semibold underline cursor-pointer"
                >
                  Cost Model
                </button>
                , coal stockpiles and gas pressures in{" "}
                <button
                  onClick={() => setCurrentPage("inventory")}
                  className="text-[#1D4ED8] font-semibold underline cursor-pointer"
                >
                  Inventory
                </button>
                , and automated dispatch guidance in the{" "}
                <button
                  onClick={() => setCurrentPage("analysis")}
                  className="text-[#1D4ED8] font-semibold underline cursor-pointer"
                >
                  AI Assistant
                </button>
                .
              </p>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          3. MAIN CONTENT AREA (Open Electricity Minimalist Off-White & Grey)
          ===================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {portalMode === "admin" ? (
          /* ================= ADMIN PORTAL (Minimalist Clean Layout) ================= */
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-2xs">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded">
                  Administrative Configuration Console
                </span>
                <h1 className="text-xl font-bold text-slate-900 mt-1.5">
                  Plant Parameter Calibration & Cost Model Inputs
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adjust thermodynamic heat rates (BTU/kWh), fuel unit prices
                  ($/MMBTU), variable O&M, and operational statuses.
                </p>
              </div>
              {adminSaveMsg && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-2 rounded-lg text-xs font-semibold">
                  {adminSaveMsg}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {plants.map((plant, idx) => {
                const costs = computePlantCosts(plant);
                return (
                  <div
                    key={plant.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[11px] font-mono text-slate-500">
                          {plant.plant_code}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm">
                          {plant.name}
                        </h3>
                      </div>
                      <select
                        value={plant.operational_status || "ONLINE"}
                        onChange={(e) => {
                          const updated = [...plants];
                          updated[idx] = {
                            ...plant,
                            operational_status: e.target.value,
                          };
                          setPlants(updated);
                        }}
                        className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold text-slate-800"
                      >
                        <option value="ONLINE">ONLINE</option>
                        <option value="DERATED">DERATED</option>
                        <option value="MAINTENANCE">MAINTENANCE</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-500 block mb-1">
                          Capacity (MW)
                        </label>
                        <input
                          type="number"
                          value={plant.capacity_mw}
                          onChange={(e) => {
                            const updated = [...plants];
                            updated[idx] = {
                              ...plant,
                              capacity_mw: Number(e.target.value),
                            };
                            setPlants(updated);
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block mb-1">
                          Dispatchable (MW)
                        </label>
                        <input
                          type="number"
                          value={plant.dispatchable_mw}
                          onChange={(e) => {
                            const updated = [...plants];
                            updated[idx] = {
                              ...plant,
                              dispatchable_mw: Number(e.target.value),
                            };
                            setPlants(updated);
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block mb-1">
                          Heat Rate (BTU/kWh)
                        </label>
                        <input
                          type="number"
                          value={plant.heat_rate_btu_kwh}
                          onChange={(e) => {
                            const updated = [...plants];
                            updated[idx] = {
                              ...plant,
                              heat_rate_btu_kwh: Number(e.target.value),
                            };
                            setPlants(updated);
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block mb-1">
                          Fuel Price ($/MMBTU)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={plant.fuel_unit_price}
                          onChange={(e) => {
                            const updated = [...plants];
                            updated[idx] = {
                              ...plant,
                              fuel_unit_price: Number(e.target.value),
                            };
                            setPlants(updated);
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block mb-1">
                          Variable O&M ($/MWh)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={plant.vom_cost_per_mwh}
                          onChange={(e) => {
                            const updated = [...plants];
                            updated[idx] = {
                              ...plant,
                              vom_cost_per_mwh: Number(e.target.value),
                            };
                            setPlants(updated);
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block mb-1">
                          Resulting $/kWh
                        </label>
                        <div className="w-full bg-blue-50 border border-blue-200 rounded px-3 py-1.5 text-[#1D4ED8] font-mono font-bold">
                          ${costs.variableCostKwh.toFixed(4)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAdminPlantUpdate(plant)}
                      className="w-full py-2 bg-[#1D4ED8] hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Save className="h-3.5 w-3.5" /> Save Parameters
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : currentPage === "home" ? (
          /* ================= HOME PAGE: OPEN ELECTRICITY MINIMALIST DESIGN ================= */
          <div className="space-y-8">
            {/* Open Electricity Style Top Summary Strip */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                    National Electricity Market & Telemetry Summary
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Design Benchmark: Open Electricity (openelectricity.org.au) •
                  5s Live Sync
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Total Generation
                  </span>
                  <span className="text-2xl font-bold text-slate-900 font-mono mt-0.5 block">
                    {totalPower.toFixed(1)}{" "}
                    <small className="text-xs font-normal text-slate-500">
                      MW
                    </small>
                  </span>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Installed Capacity
                  </span>
                  <span className="text-2xl font-bold text-slate-900 font-mono mt-0.5 block">
                    {totalCapacity.toFixed(0)}{" "}
                    <small className="text-xs font-normal text-slate-500">
                      MW
                    </small>
                  </span>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Grid Frequency
                  </span>
                  <span className="text-2xl font-bold text-emerald-700 font-mono mt-0.5 block">
                    {currentFreq.toFixed(2)}{" "}
                    <small className="text-xs font-normal text-slate-500">
                      Hz
                    </small>
                  </span>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Weighted Cost
                  </span>
                  <span className="text-2xl font-bold text-[#1D4ED8] font-mono mt-0.5 block">
                    ${weightedCostMwh}{" "}
                    <small className="text-xs font-normal text-slate-500">
                      /MWh
                    </small>
                  </span>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Carbon Intensity
                  </span>
                  <span className="text-2xl font-bold text-slate-800 font-mono mt-0.5 block">
                    {weightedCarbon}{" "}
                    <small className="text-xs font-normal text-slate-500">
                      kg/MWh
                    </small>
                  </span>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Renewables Share
                  </span>
                  <span className="text-2xl font-bold text-emerald-600 font-mono mt-0.5 block">
                    {cleanEnergyShare}%
                  </span>
                </div>
              </div>
            </div>

            {/* Open Electricity Style Two-Column Section: Stacked Diurnal Chart + Fuel Breakdown Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 Columns: Clean Diurnal Generation Stacked Chart */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Generation by Fuel Technology (MW)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Diurnal stacked generation profile across Coal, Gas CCGT,
                      and Solar PV
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#475569]" />
                      Coal
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#EA580C]" />
                      Gas
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981]" />
                      Solar
                    </span>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mixHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                      <YAxis stroke="#64748B" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#CBD5E1",
                          color: "#1E293B",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="Coal"
                        stackId="1"
                        stroke="#334155"
                        fill="#475569"
                        fillOpacity={0.85}
                      />
                      <Area
                        type="monotone"
                        dataKey="Gas"
                        stackId="1"
                        stroke="#C2410C"
                        fill="#EA580C"
                        fillOpacity={0.8}
                      />
                      <Area
                        type="monotone"
                        dataKey="Solar"
                        stackId="1"
                        stroke="#059669"
                        fill="#10B981"
                        fillOpacity={0.85}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right 5 Columns: Open Electricity Style Fuel-Mix & Price Table */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Supply, Contribution & Marginal Cost
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      LIVE BREAKDOWN
                    </span>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="py-2.5">Source</th>
                        <th className="py-2.5 text-right">Power</th>
                        <th className="py-2.5 text-right">Share</th>
                        <th className="py-2.5 text-right">Cost ($/kWh)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      <tr>
                        <td className="py-3 font-sans font-semibold text-slate-800 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-xs bg-[#475569]" />
                          Coal (Supercritical)
                        </td>
                        <td className="py-3 text-right text-slate-900 font-bold">
                          {coalPower.toFixed(1)} MW
                        </td>
                        <td className="py-3 text-right text-slate-600">
                          {((coalPower / totalPower) * 100).toFixed(1)}%
                        </td>
                        <td className="py-3 text-right text-slate-800">
                          $
                          {computePlantCosts(plants[0]).variableCostKwh.toFixed(
                            4,
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-sans font-semibold text-slate-800 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-xs bg-[#EA580C]" />
                          Gas (Combined Cycle)
                        </td>
                        <td className="py-3 text-right text-slate-900 font-bold">
                          {gasPower.toFixed(1)} MW
                        </td>
                        <td className="py-3 text-right text-slate-600">
                          {((gasPower / totalPower) * 100).toFixed(1)}%
                        </td>
                        <td className="py-3 text-right text-slate-800">
                          $
                          {computePlantCosts(plants[1]).variableCostKwh.toFixed(
                            4,
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-sans font-semibold text-slate-800 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981]" />
                          Solar PV (Utility)
                        </td>
                        <td className="py-3 text-right text-emerald-700 font-bold">
                          {solarPower.toFixed(1)} MW
                        </td>
                        <td className="py-3 text-right text-emerald-700">
                          {cleanEnergyShare}%
                        </td>
                        <td className="py-3 text-right text-emerald-700 font-bold">
                          $
                          {computePlantCosts(plants[2]).variableCostKwh.toFixed(
                            4,
                          )}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot className="border-t-2 border-slate-200 font-mono font-bold text-slate-900">
                      <tr>
                        <td className="pt-3 font-sans">Total Net System</td>
                        <td className="pt-3 text-right">
                          {totalPower.toFixed(1)} MW
                        </td>
                        <td className="pt-3 text-right">100.0%</td>
                        <td className="pt-3 text-right text-[#1D4ED8]">
                          ${(Number(weightedCostMwh) / 1000).toFixed(4)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Minimalist AI Status Callout inside Table Card */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Active AI Dispatch Recommendation:
                  </span>
                  <button
                    onClick={() => setCurrentPage("analysis")}
                    className="font-semibold text-[#1D4ED8] hover:underline cursor-pointer"
                  >
                    100% Solar Priority • View AI Advisor →
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Generation Facilities & Live Telemetry Overlay */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Monitored Generation Facilities & Live Telemetry Overlay
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select any station to open its dedicated real-time SCADA
                    telemetry console
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plants.map((plant) => {
                  const live = telemetry[plant.table_name];
                  const cost = computePlantCosts(plant);
                  const borderAccent =
                    plant.fuel_category === "Coal"
                      ? "border-t-4 border-t-[#475569]"
                      : plant.fuel_category === "Gas"
                        ? "border-t-4 border-t-[#EA580C]"
                        : "border-t-4 border-t-[#10B981]";

                  return (
                    <div
                      key={plant.id}
                      onClick={() => {
                        handleSelectPlant(plant.id);
                        setCurrentPage("dashboard");
                      }}
                      className={`bg-white border border-slate-200 ${borderAccent} rounded-xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer group`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[11px] font-mono text-slate-400">
                            {plant.plant_code} • {plant.substation_kv} kV
                          </span>
                          <h4 className="font-bold text-slate-900 text-base mt-0.5 group-hover:text-[#1D4ED8] transition-colors">
                            {plant.name}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {plant.fuel_type} • {plant.location}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {live?.status || "ONLINE"}
                        </span>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 font-mono">
                        <div>
                          <span className="text-[10px] font-sans uppercase text-slate-400 block">
                            Output
                          </span>
                          <span className="text-sm font-bold text-slate-900">
                            {live?.power_output_mw ??
                              (plant.capacity_mw * 0.89).toFixed(1)}{" "}
                            MW
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-sans uppercase text-slate-400 block">
                            Frequency
                          </span>
                          <span className="text-sm font-bold text-emerald-700">
                            {live?.frequency_hz ?? "50.00"} Hz
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-sans uppercase text-slate-400 block">
                            Cost/kWh
                          </span>
                          <span className="text-sm font-bold text-[#1D4ED8]">
                            ${cost.variableCostKwh.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : currentPage === "dashboard" ? (
          /* ================= PAGE 2: MINIMALIST SUPERVISORY DASHBOARD ================= */
          <div className="space-y-6">
            {/* Station Selector Bar */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-2xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase text-slate-400 mr-1">
                  Select Facility:
                </span>
                {plants.map((plant) => (
                  <button
                    key={plant.id}
                    onClick={() => handleSelectPlant(plant.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      selectedPlantId === plant.id
                        ? "bg-[#1D4ED8] text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {plant.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => exportTelemetryCSV(selectedPlant, 60)}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-[#1D4ED8]" />
                  {isExporting ? "Exporting..." : "Export CSV"}
                </button>
                <span className="text-xs font-mono text-slate-500">
                  {activeTelemetry
                    ? new Date(activeTelemetry.timestamp).toLocaleTimeString()
                    : "50.00 Hz Sync"}
                </span>
              </div>
            </div>

            {/* Minimalist AI Decision Banner */}
            {aiAdvisory && (
              <div className="bg-white border-l-4 border-l-[#1D4ED8] border border-slate-200 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-2xs">
                <div className="space-y-0.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-[#1D4ED8]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      AI Supervisory Advisory — {aiAdvisory.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {aiAdvisory.recommendation}
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded bg-blue-50 text-[#1D4ED8] border border-blue-200">
                  Action: {aiAdvisory.action}
                </span>
              </div>
            )}

            {/* 8 Clean Telemetry Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CleanMetricCard
                label="Active Power Output"
                value={
                  activeTelemetry?.power_output_mw ??
                  (selectedPlant.capacity_mw * 0.89).toFixed(1)
                }
                unit="MW"
              />
              <CleanMetricCard
                label="Substation Bus Voltage"
                value={
                  activeTelemetry?.voltage_kv ?? selectedPlant.substation_kv
                }
                unit="kV"
              />
              <CleanMetricCard
                label="Synchronous Frequency"
                value={activeTelemetry?.frequency_hz ?? "50.00"}
                unit={`Hz (Δf ${deltaF})`}
              />
              <CleanMetricCard
                label="Operating Temperature"
                value={
                  activeTelemetry?.temperature_c ??
                  (selectedPlant.plant_code === "SRJ-SOLAR" ? "41.8" : "539.5")
                }
                unit="°C"
              />
              <CleanMetricCard
                label="Fuel Consumption Rate"
                value={
                  activeTelemetry?.fuel_consumption_rate ??
                  (selectedPlant.plant_code === "SRJ-SOLAR" ? "0.0" : "428.4")
                }
                unit={
                  selectedPlant.plant_code === "SRJ-SOLAR" ? "Zero" : "Unit/h"
                }
              />
              <CleanMetricCard
                label="Thermal / PV Efficiency"
                value={
                  activeTelemetry?.efficiency_pct ??
                  selectedPlant.design_efficiency_pct
                }
                unit="%"
              />
              <CleanMetricCard
                label="Plant Load Factor (PLF)"
                value={activeTelemetry?.grid_load_pct ?? "89.4"}
                unit="%"
              />
              <CleanMetricCard
                label="Carbon Intensity"
                value={
                  activeTelemetry?.carbon_intensity_kg ??
                  selectedPlant.carbon_factor_kg_mwh
                }
                unit="kg CO₂/MWh"
              />
            </div>

            {/* Real-Time Power Trajectory Chart */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Real-Time Generation Output Trajectory (MW) —{" "}
                    {selectedPlant.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live 5-second time-series stream from PostgreSQL table{" "}
                    <code className="text-[#1D4ED8]">
                      {selectedPlant.table_name}
                    </code>
                  </p>
                </div>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                    <YAxis
                      stroke="#64748B"
                      domain={["auto", "auto"]}
                      fontSize={11}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#CBD5E1",
                        color: "#0F172A",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="power"
                      stroke="#1D4ED8"
                      strokeWidth={2.5}
                      dot={{ fill: "#1D4ED8", r: 3 }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : currentPage === "cost" ? (
          /* ================= PAGE 3: COST MODELING & EQUATIONS ================= */
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-[#1D4ED8] font-bold">
                Week 2 Deliverable • Thermodynamic Cost Modeling
              </span>
              <h1 className="text-xl font-bold text-slate-900 mt-1">
                Electricity Generation Cost Equations & Comparison ($/kWh)
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Static thermodynamic equations comparing short-run marginal cost
                across Coal, Combined Cycle Gas, and Solar PV.
              </p>

              <div className="mt-4 bg-slate-50 border border-slate-200 p-4 rounded-lg font-mono text-xs text-slate-700 space-y-1.5">
                <p>
                  <strong>1. Fuel Cost ($/kWh)</strong> = [ Heat Rate (BTU/kWh)
                  × Fuel Price ($/MMBTU) ] ÷ 1,000,000
                </p>
                <p>
                  <strong>2. Variable Cost ($/kWh)</strong> = Fuel Cost ($/kWh)
                  + [ Variable O&M ($/MWh) ÷ 1,000 ]
                </p>
              </div>

              {/* Fuel Price Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700">
                      Coal Price ($/MMBTU)
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      ${coalPriceSim.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3.0"
                    max="9.0"
                    step="0.1"
                    value={coalPriceSim}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCoalPriceSim(val);
                      setPlants((prev) =>
                        prev.map((p) =>
                          p.plant_code === "PYR-COAL"
                            ? { ...p, fuel_unit_price: val }
                            : p,
                        ),
                      );
                    }}
                    className="w-full accent-[#1D4ED8] cursor-pointer"
                  />
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700">
                      Natural Gas Price ($/MMBTU)
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      ${gasPriceSim.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3.0"
                    max="12.0"
                    step="0.1"
                    value={gasPriceSim}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setGasPriceSim(val);
                      setPlants((prev) =>
                        prev.map((p) =>
                          p.plant_code === "TTS-GAS"
                            ? { ...p, fuel_unit_price: val }
                            : p,
                        ),
                      );
                    }}
                    className="w-full accent-[#EA580C] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plants.map((plant) => {
                const c = computePlantCosts(plant);
                return (
                  <div
                    key={plant.id}
                    className="bg-white border border-slate-200 p-6 rounded-xl space-y-3 shadow-2xs"
                  >
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {plant.plant_code}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm">
                          {plant.name}
                        </h3>
                      </div>
                      <span className="font-mono text-sm font-bold text-[#1D4ED8] bg-blue-50 px-2.5 py-1 rounded">
                        ${c.variableCostKwh.toFixed(4)}/kWh
                      </span>
                    </div>
                    <div className="text-xs space-y-2 text-slate-600">
                      <div className="flex justify-between">
                        <span>Heat Rate:</span>
                        <span className="font-mono text-slate-900">
                          {c.heatRate} BTU/kWh
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fuel Price:</span>
                        <span className="font-mono text-slate-900">
                          ${c.fuelPrice.toFixed(2)} / MMBTU
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Variable O&M:</span>
                        <span className="font-mono text-slate-900">
                          ${c.vomMwh.toFixed(2)} / MWh
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-slate-900">
                        <span>Total Levelized Cost:</span>
                        <span className="font-mono">
                          ${c.totalLcoeKwh.toFixed(4)} / kWh
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : currentPage === "inventory" ? (
          /* ================= PAGE 4: FUEL INVENTORY (NPP India Style) ================= */
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-amber-700 font-bold">
                NPP India Daily Fuel Stock Standard
              </span>
              <h1 className="text-xl font-bold text-slate-900 mt-1">
                National Fuel Inventory, Coal Tonnage & Gas Pressure Reserves
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Monitors coal stockpiles (MT), natural gas pipeline pressure
                (PSI), and flags Critical (&lt;7 days) or Super-Critical (&lt;4
                days) stations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {inventory.map((inv) => {
                const fillPct = Math.min(
                  100,
                  Math.round((inv.current_stock / inv.max_capacity) * 100),
                );
                const isSuperCrit = inv.reserve_status === "SUPER-CRITICAL";
                const isCrit = inv.reserve_status === "CRITICAL";
                return (
                  <div
                    key={inv.id}
                    className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 shadow-2xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {inv.plant_code}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm">
                          {inv.plant_name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {inv.fuel_type}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded ${
                          isSuperCrit
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : isCrit
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {inv.reserve_status}
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Stock Level</span>
                        <span className="font-mono font-bold text-slate-900">
                          {Number(inv.current_stock).toLocaleString()} /{" "}
                          {Number(inv.max_capacity).toLocaleString()}{" "}
                          {inv.stock_unit}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            isSuperCrit
                              ? "bg-rose-600"
                              : isCrit
                                ? "bg-amber-500"
                                : "bg-emerald-600"
                          }`}
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block">
                          Days of Burn
                        </span>
                        <span className="text-base font-bold text-slate-900 font-mono">
                          {inv.days_of_burn > 100
                            ? "Renewable"
                            : `${inv.days_of_burn} Days`}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block">
                          {inv.gas_pressure_psi ? "Gas Pressure" : "Daily Burn"}
                        </span>
                        <span className="text-base font-bold text-slate-900 font-mono">
                          {inv.gas_pressure_psi
                            ? `${inv.gas_pressure_psi} PSI`
                            : `${inv.daily_burn_rate} MT/d`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : currentPage === "records" ? (
          /* ================= PAGE 5: HISTORICAL RECORDS & OUTAGES ================= */
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-2xs">
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Historical Generation Archives & Outage Classification Matrix
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Forced vs. Planned station outages ({offlineCapacityMw} MW
                  currently offline) and CSV dataset exporter.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={exportLimit}
                  onChange={(e) => setExportLimit(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800"
                >
                  <option value={50}>Latest 50 rows</option>
                  <option value={200}>Latest 200 rows</option>
                </select>
                <button
                  onClick={() => exportTelemetryCSV(selectedPlant, exportLimit)}
                  className="px-4 py-1.5 bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" /> Export CSV
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-600">
                Outage Tracking Matrix (Forced vs. Planned)
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono">
                  <tr>
                    <th className="p-3.5">Facility & Unit</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Offline MW</th>
                    <th className="p-3.5">Cause Code</th>
                    <th className="p-3.5">Description</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {outages.map((o) => (
                    <tr key={o.id}>
                      <td className="p-3.5 font-semibold text-slate-900">
                        {o.plant_name} ({o.unit_identifier})
                      </td>
                      <td className="p-3.5 font-mono font-bold text-amber-700">
                        {o.outage_category}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-rose-600">
                        {o.capacity_offline_mw} MW
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">
                        {o.cause_code}
                      </td>
                      <td className="p-3.5 text-slate-600">{o.description}</td>
                      <td className="p-3.5 font-mono font-bold text-slate-800">
                        {o.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-600">
                Historical Daily Generation Milestones
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono">
                  <tr>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Peak Demand</th>
                    <th className="p-3.5">Total Energy</th>
                    <th className="p-3.5">Avg Frequency</th>
                    <th className="p-3.5">Avg Cost ($/kWh)</th>
                    <th className="p-3.5">Milestone Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((r) => (
                    <tr key={r.id}>
                      <td className="p-3.5 font-mono text-slate-900">
                        {r.record_date}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-[#1D4ED8]">
                        {r.peak_demand_mw} MW
                      </td>
                      <td className="p-3.5 font-mono text-slate-700">
                        {r.total_generation_mwh} MWh
                      </td>
                      <td className="p-3.5 font-mono text-emerald-700">
                        {r.avg_frequency_hz} Hz
                      </td>
                      <td className="p-3.5 font-mono text-slate-800">
                        ${r.avg_generation_cost_usd_kwh}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {r.milestone_note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ================= PAGE 6: AI ASSISTANT & MERIT-ORDER ================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
              <h2 className="text-base font-bold text-slate-900">
                Economic Merit-Order Dispatch Ranking
              </h2>
              <p className="text-xs text-slate-500">
                Units ranked by lowest short-run marginal cost ($/kWh) for
                optimal dispatch.
              </p>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Station</th>
                    <th className="p-3">Cost ($/kWh)</th>
                    <th className="p-3">Dispatch Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...plants]
                    .sort(
                      (a, b) =>
                        computePlantCosts(a).variableCostKwh -
                        computePlantCosts(b).variableCostKwh,
                    )
                    .map((p, idx) => (
                      <tr key={p.id}>
                        <td className="p-3 font-mono font-bold text-[#1D4ED8]">
                          #{idx + 1}
                        </td>
                        <td className="p-3 font-semibold text-slate-900">
                          {p.name}
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-700">
                          ${computePlantCosts(p).variableCostKwh.toFixed(4)}
                        </td>
                        <td className="p-3 text-slate-600">
                          {idx === 0
                            ? "100% Base Priority"
                            : idx === 1
                              ? "Intermediate Load-Following"
                              : "Thermal Base Support"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl flex flex-col h-[460px] shadow-2xs">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Google Gemini Operational Grid Assistant
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Natural-language decision support for grid conditions
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#1D4ED8] border border-blue-200">
                  AI READY
                </span>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50/50">
                {chatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#1D4ED8] text-white ml-8"
                        : "bg-white border border-slate-200 text-slate-800 mr-8"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
                {isChatLoading && (
                  <div className="text-xs text-slate-500 font-mono">
                    Evaluating grid telemetry...
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSendChat}
                className="p-3 border-t border-slate-200 flex gap-2 bg-white"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about $/kWh cost, coal stock, or grid frequency..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#1D4ED8]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* =====================================================================
          4. INSTITUTIONAL FOOTER (About Us, Quick Links, Contact Us)
          ===================================================================== */}
      <footer className="bg-[#EBEAE4] border-t border-slate-300 text-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
          {/* Column 1: About Us */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              About National Power Portal
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Web-Based Remote Monitoring, Electricity Cost Modeling, and
              Decision Support System Powered by Artificial Intelligence.
              Designed as the national supervisory blueprint inspired by India’s{" "}
              <span className="font-semibold">npp.gov.in</span> and Australia’s{" "}
              <span className="font-semibold">openelectricity.org.au</span>.
            </p>
          </div>

          {/* Column 2: Quick Navigation & Modules */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              Portal Modules & Data Access
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <button
                  onClick={() => setCurrentPage("dashboard")}
                  className="hover:text-[#1D4ED8] cursor-pointer"
                >
                  • Real-Time Supervisory Dashboard (MW, kV, Hz)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage("cost")}
                  className="hover:text-[#1D4ED8] cursor-pointer"
                >
                  • Thermodynamic Cost Modeling ($/kWh Equations)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage("inventory")}
                  className="hover:text-[#1D4ED8] cursor-pointer"
                >
                  • Fuel Inventory & Reserve Alerts (Coal & Gas)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage("records")}
                  className="hover:text-[#1D4ED8] cursor-pointer"
                >
                  • Historical Outage Matrix & CSV Data Exporter
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              Contact Us & Control Center
            </h4>
            <div className="space-y-1.5 text-slate-600">
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#1D4ED8] shrink-0" />
                National Load Despatch & Telemetry Center, Dhaka, Bangladesh
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#1D4ED8] shrink-0" />
                Supervisory Control Desk: +880-2-955-GRID (24/7 Operations)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#1D4ED8] shrink-0" />
                telemetry-support@powergrid.gov.bd
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-300/80 bg-[#E2E1DA] py-3 px-6 text-center text-[11px] text-slate-600">
          © 2026 National Power Grid Telemetry & AI Decision-Support Platform •
          Government Prototype Blueprint
        </div>
      </footer>
    </div>
  );
}

function CleanMetricCard({ label, value, unit }) {
  return (
    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
        {label}
      </span>
      <p className="text-xl font-bold text-slate-900 font-mono mt-1">
        {value !== undefined ? value : "--"}{" "}
        <span className="text-xs font-normal text-slate-500">{unit}</span>
      </p>
    </div>
  );
}
