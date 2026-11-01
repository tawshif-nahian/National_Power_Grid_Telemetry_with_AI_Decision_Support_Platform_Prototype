# Improvement Notes (Missing Data Fields & Future Database Additions)

When building the 4-card fleet summary on the Home page (`useFleetSummary.js`) and the Dashboard views without inventing numbers, we noted which telemetry metrics exist in the database today and which real-world transmission/inventory numbers are not yet stored in `backend/database/schema_and_seed.sql`:

1. **Transmission Line Circuit Length (Circuit-km / ckm) & Transformer MVA Capacity:**
   - **What we have today:** Substation bus voltage (`substation_kv` / `voltage_kv`: `400 kV` at Payra, `230 kV` at Titas, `132 kV` at Sirajganj) and synchronous grid frequency (`frequency_hz`).
   - **What is missing for later:** Transmission line length (`line_length_ckm`), line loading percentage, and inter-regional tie-line flow (MW/MVAR).
2. **Live Simulator Telemetry Before First Pulse:**
   - When the database has no rows in `telemetry_payra`, `telemetry_titas`, or `telemetry_sirajganj` yet, live generation on the Home page displays `"—"` until the Python simulator (`backend/simulator/generator.py`) sends its first 5-second reading.
3. **Dynamic Fuel Inventory Updates:**
   - **What we have today:** Static seeded rows in `public.fuel_inventory` (Payra coal stock in `MT` and days of burn; Titas natural gas pressure in `PSI` and daily supply in `MMSCFD`).
   - **What is missing for later:** Having `generator.py` gradually decrement `current_stock` or fluctuate `gas_pressure_psi` in `fuel_inventory` in real time.

