/**
 * What it does: Renders the Cost Modelling placeholder page for administrators at `/admin/cost-modelling`.
 * Who uses it: Rendered by `frontend/src/App.jsx`.
 * What it talks to: None yet (placeholder screen).
 *
 * ============================================================================
 * OWNER SPECIFICATION BLOCK (Cost Modelling Page)
 * Write your future requirements for Cost Modelling here:
 * -
 * -
 * ============================================================================
 */

import Reveal from "../components/ui/Reveal";

export default function CostModellingPage() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-12">
      <Reveal>
        <div className="bg-surface border border-border rounded-xl p-8">
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Cost Modelling
          </h1>
          <p className="text-sm text-text-secondary mt-2">
            Content to be defined
          </p>
        </div>
      </Reveal>
    </div>
  );
}
