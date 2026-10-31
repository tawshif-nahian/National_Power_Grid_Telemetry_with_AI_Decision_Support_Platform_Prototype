# National Power Grid Telemetry & AI Decision-Support Platform

**Project Title:** Web-Based Remote Monitoring, Electricity Cost Modeling, and Decision Support System Powered by Artificial Intelligence  
**Design Benchmarks:** India's National Power Portal (`npp.gov.in`) & Australia's Open Electricity (`openelectricity.org.au`)  
**Architecture Standard:** Multi-Tier Cloud PostgreSQL (Supabase), Real-Time WebSockets (CDC), & Reactive Web Portal

## Project Structure

- `backend/` — Everything that runs outside the browser:
  - `backend/database/` — PostgreSQL / Supabase relational schema, B-Tree indexes, Row-Level Security (RLS), Realtime CDC configuration, and national grid seed data (`schema_and_seed.sql`).
  - `backend/simulator/` — Physics-grounded Python telemetry simulator (`generator.py`) modeling governor droop, diurnal solar irradiance, thermodynamic heat rates, and fuel burn every 5 seconds.
  - `backend/supabase/functions/chat/` — Reserved for the future AI chatbot server function.
- `frontend/` — Everything that runs in the user's web browser (React 19 + Vite + Tailwind CSS v4 + Recharts).
- `docs/` — Project rules (`PROJECT_RULES.md`) and plain-English glossary (`GLOSSARY.md`).
