/**
 * What it does: Renders the Anomaly Detection placeholder page for administrators at `/admin/anomaly-detection`.
 * Who uses it: Rendered by `frontend/src/App.jsx`.
 * What it talks to: None yet (placeholder screen).
 *
 * ============================================================================
 * OWNER SPECIFICATION BLOCK (Anomaly Detection Page)
 * Write your future requirements for Anomaly Detection here:
 * -
 * -
 * ============================================================================
 */

import Reveal from "../components/ui/Reveal";

export default function AnomalyDetectionPage() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-12">
      <Reveal>
        <div className="bg-surface border border-border rounded-xl p-8">
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Anomaly Detection
          </h1>
          <p className="text-sm text-text-secondary mt-2">
            Content to be defined
          </p>
        </div>
      </Reveal>
    </div>
  );
}
