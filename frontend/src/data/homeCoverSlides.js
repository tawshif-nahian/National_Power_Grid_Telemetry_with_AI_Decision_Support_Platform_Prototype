/**
 * What it does: Stores the 3 rotating cover banner slides displayed at the top of the Home page using semantic design tokens.
 * Who uses it: Imported by `frontend/src/components/ui/HomeCoverCarousel.jsx`.
 * What it talks to: Pure static data file (does not talk to any backend or database).
 */

export const COVER_SLIDES = [
  {
    badge: "UNIFIED NATIONAL TELEMETRY & DISPATCH PORTAL",
    headlineMain: "A Centralized Platform for",
    headlineAccent: "Collation and Dissemination",
    headlineSub: "of National Power Sector Intelligence",
    quote:
      "“Integrating real-time generation telemetry, transmission busbar stability, and thermodynamic cost modeling into one unified national window.”",
    accentVar: "var(--color-series-solar)",
  },
  {
    badge: "NATIONAL ENERGY CONSERVATION MANDATE",
    headlineMain: "Use Electricity Efficiently —",
    headlineAccent: "Every Kilowatt Saved",
    headlineSub: "is a Kilowatt Generated for the Nation",
    quote:
      "“Optimizing thermal heat rates and minimizing transmission losses strengthens industrial productivity and preserves strategic fuel reserves.”",
    accentVar: "var(--color-status-online)",
  },
  {
    badge: "ECONOMIC MERIT-ORDER & CLEAN ENERGY TRANSITION",
    headlineMain: "Data-Driven Dispatch for",
    headlineAccent: "Reliable, Low-Cost & Clean",
    headlineSub: "Electricity Across Every Grid Node",
    quote:
      "“Prioritizing zero-marginal-cost renewable generation alongside high-efficiency combined-cycle and supercritical thermal stations.”",
    accentVar: "var(--color-status-info)",
  },
];
