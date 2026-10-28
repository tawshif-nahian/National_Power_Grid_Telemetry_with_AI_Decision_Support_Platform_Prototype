# National Power Grid Telemetry & AI Decision-Support Platform

**Project Title:** Web-Based Remote Monitoring, Electricity Cost Modeling, and Decision Support System Powered by Artificial Intelligence  
**Design Benchmarks:** India's National Power Portal (`npp.gov.in`) & Australia's Open Electricity (`opennem.org.au`)  
**Architecture Standard:** Multi-Tier Cloud PostgreSQL (Supabase), Real-Time WebSockets (CDC), & Reactive Web Portal

## Project Structure

- `database/` — PostgreSQL / Supabase relational schema, B-Tree indexes, Row-Level Security (RLS), Realtime CDC configuration, and national grid seed data (`schema_and_seed.sql`).
- `simulator/` — Physics-grounded Python telemetry simulator (`generator.py`) modeling governor droop, diurnal solar irradiance, thermodynamic heat rates, and fuel burn every 5 seconds.
- `frontend/` — Full-stack Dual-Portal React 19 + Vite + Tailwind CSS v4 web application featuring:
  1. **Home Page** (Executive Landing Portal, Hero Carousel, 6-Pillar Overview)
  2. **Dashboard Page** (Core Supervisory Console: Generation, Capacity, Transmission)
  3. **Cost Engine & Economic Merit-Order** (Thermodynamic generation cost formulas in $/kWh across Coal, Gas, Solar)
  4. **Inventory Page** (NPP-inspired coal tonnage, gas pressure PSI/MMSCFD, days-of-burn & Critical/Super-Critical alerts)
  5. **Records Page** (Historical archives, Forced vs. Planned Outage Matrix, Researcher CSV Exporter)
  6. **Analysis Page & AI Chatbot** (AI Decision-Support, Anomaly Detection, Clean Energy Policy & Google Gemini Assistant)
  7. **Facilities Page** (Searchable National Power Plant Directory)
  8. **About Us Page** (Methodology, System Architecture & Research Mandate)
  9. **Admin Portal** (Facility calibration, thermodynamic cost formula parameters, fuel stock & outage management)

