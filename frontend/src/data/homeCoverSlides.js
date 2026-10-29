/**
 * What it does: Stores the 3 rotating cover banner slides displayed at the top of the Home page.
 * Who uses it: Imported by `frontend/src/pages/HomePage.jsx`.
 * What it talks to: Pure static data file (does not talk to any backend or database).
 */

// 3 Generic Auto-Sliding Cover Slides (Modeled directly after NPP India Cover Banner)
export const COVER_SLIDES = [
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

