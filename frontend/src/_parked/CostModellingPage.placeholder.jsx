/**
 * PARKED FILE: Replaced during Phase 4 (Payra 1320 MW Cost Modelling implementation).
 * Why parked: Per PROJECT_RULES.md ("Never delete code"), the initial Phase 3 placeholder screen
 * for `/admin/cost-modelling` is preserved here before upgrading `frontend/src/pages/CostModellingPage.jsx`
 * to the 4-part Payra 1320 MW Cost Modelling Console.
 */

import Reveal from "../components/ui/Reveal";

export default function CostModellingPagePlaceholder() {
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

