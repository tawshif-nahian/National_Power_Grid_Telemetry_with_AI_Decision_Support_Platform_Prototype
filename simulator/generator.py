import math
import os
import random
import time
from datetime import datetime, timezone
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://vikiwhsbgltrtcsiiaxt.supabase.co")
SUPABASE_KEY = os.getenv(
    "SUPABASE_KEY", "sb_publishable_YqO-JCk13Zpm_w7vGyoR6A_LtQHtRVS"
)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Physics-Grounded Operational Base Configurations for the 3 Monitored Plants
PLANTS_CONFIG = [
    {
        "code": "PYR-COAL",
        "table": "telemetry_payra",
        "capacity": 1320.0,
        "base_voltage": 400.0,
        "fuel_base": 480.0,       # Sub-bituminous coal flow rate (MT/h at full load)
        "temp_base": 540.0,       # Ultra-supercritical main steam temp (°C)
        "design_eff": 43.5,       # Thermal efficiency (%)
        "carbon_factor": 0.82,    # Tons CO2 / MWh -> scaled to kg/MWh
        "droop_r": 0.05,          # 5% Governor droop characteristic
    },
    {
        "code": "TTS-GAS",
        "table": "telemetry_titas",
        "capacity": 450.0,
        "base_voltage": 230.0,
        "fuel_base": 280.0,       # Natural gas flow rate (1000 m³/h)
        "temp_base": 480.0,       # Gas turbine / HRSG exhaust temp (°C)
        "design_eff": 56.0,       # Combined Cycle thermal efficiency (%)
        "carbon_factor": 0.44,
        "droop_r": 0.04,          # 4% CCGT fast governor droop
    },
    {
        "code": "SRJ-SOLAR",
        "table": "telemetry_sirajganj",
        "capacity": 68.0,
        "base_voltage": 132.0,
        "fuel_base": 0.0,         # Zero fuel consumption (Solar PV)
        "temp_base": 41.5,        # PV Module / Inverter temperature (°C)
        "design_eff": 91.5,       # Inverter conversion efficiency (%)
        "carbon_factor": 0.02,    # Lifecycle embodied carbon (kg/MWh equivalent)
        "droop_r": None,
    },
]

print("=" * 72)
print(" NATIONAL POWER GRID TELEMETRY & AI DECISION-SUPPORT SIMULATOR")
print(" Physics-Grounded Stream (Governor Droop + Diurnal Solar + Heat Rate)")
print(" Pushing to PostgreSQL CDC tables every 5 seconds. Press Ctrl+C to stop.")
print("=" * 72)

tick = 0
while True:
    try:
        now_utc = datetime.now(timezone.utc)
        now_iso = now_utc.isoformat()
        # Smooth sinusoidal system frequency oscillation around 50.00 Hz nominal
        system_freq_base = 50.00 + 0.06 * math.sin(tick / 4.0) + random.uniform(-0.04, 0.04)

        for plant in PLANTS_CONFIG:
            cap = plant["capacity"]
            freq = round(system_freq_base + random.uniform(-0.02, 0.02), 2)
            delta_f = freq - 50.00

            if plant["code"] == "SRJ-SOLAR":
                # Diurnal solar irradiance curve + cloud transient modeling
                solar_wave = 0.86 + 0.10 * math.sin(tick / 6.0)
                power = round(cap * max(0.65, min(0.96, solar_wave + random.uniform(-0.03, 0.03))), 2)
            else:
                # Governor droop response: ΔP/P = -(Δf/50) / R
                droop_adj = -(delta_f / 50.0) / plant["droop_r"]
                load_factor = max(0.80, min(0.98, 0.89 + droop_adj * 0.25 + random.uniform(-0.03, 0.03)))
                power = round(cap * load_factor, 2)

            load_pct = round((power / cap) * 100.0, 1)
            voltage = round(plant["base_voltage"] * (1.0 - (load_pct - 88.0) * 0.0005 + random.uniform(-0.006, 0.006)), 1)
            temp = round(plant["temp_base"] + (load_pct - 85.0) * 0.22 + random.uniform(-2.0, 3.2), 1)
            fuel = (
                round(plant["fuel_base"] * (power / cap) * random.uniform(0.99, 1.015), 1)
                if plant["fuel_base"] > 0
                else 0.0
            )
            efficiency = round(plant["design_eff"] - abs(90.0 - load_pct) * 0.08 + random.uniform(-0.6, 0.6), 1)
            co2 = round(power * plant["carbon_factor"], 1)

            status = (
                "WARNING"
                if freq < 49.91 or freq > 50.09 or temp > (plant["temp_base"] + 4.5)
                else "OPTIMAL"
            )

            record = {
                "timestamp": now_iso,
                "power_output_mw": power,
                "voltage_kv": voltage,
                "frequency_hz": freq,
                "fuel_consumption_rate": fuel,
                "efficiency_pct": efficiency,
                "grid_load_pct": load_pct,
                "carbon_intensity_kg": co2,
                "temperature_c": temp,
                "status": status,
            }

            supabase.table(plant["table"]).insert(record).execute()

        print(
            f"[{datetime.now().strftime('%H:%M:%S')}] Pulse #{tick:04d} | "
            f"SysFreq: {system_freq_base:.2f} Hz | Pushed to Payra, Titas & Sirajganj"
        )
        tick += 1

    except Exception as e:
        print("Telemetry insert error:", e)

    time.sleep(5)
