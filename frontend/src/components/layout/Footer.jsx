/**
 * What it does: Renders the institutional 3-column bottom footer using the editorial design system and `Reveal` scroll animation.
 * Who uses it: Imported by `frontend/src/App.jsx`.
 * What it talks to: Uses React Router's `useNavigate` to link to pages (does not talk to any backend or database).
 */

import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import Reveal from "../ui/Reveal";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-surface border-t border-border text-text-secondary mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 text-xs items-start">
        {/* Column 1: About Us */}
        <Reveal maxTranslateY={70} delayOffsetPx={0}>
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-text-primary uppercase tracking-wider text-xs">
              About National Power Telemetry
            </h4>
            <p className="text-text-secondary leading-relaxed">
              Web-Based Remote Monitoring, Electricity Cost Modeling, and
              Decision Support System Powered by Artificial Intelligence.
              Designed as the national supervisory blueprint inspired by India’s{" "}
              <span className="font-semibold text-text-primary">
                npp.gov.in
              </span>{" "}
              and Australia’s{" "}
              <span className="font-semibold text-text-primary">
                openelectricity.org.au
              </span>
              .
            </p>
          </div>
        </Reveal>

        {/* Column 2: Quick Navigation & Modules */}
        <Reveal maxTranslateY={70} delayOffsetPx={40}>
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-text-primary uppercase tracking-wider text-xs">
              Portal Modules & Data Access
            </h4>
            <ul className="space-y-2 text-text-secondary">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="hover:text-accent cursor-pointer transition-colors text-left"
                >
                  • National Fleet Overview & Telemetry Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="hover:text-accent cursor-pointer transition-colors text-left"
                >
                  • Real-Time Supervisory Dashboard (MW, kV, Hz)
                </button>
              </li>
            </ul>
          </div>
        </Reveal>

        {/* Column 3: Contact Us */}
        <Reveal maxTranslateY={70} delayOffsetPx={80}>
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-text-primary uppercase tracking-wider text-xs">
              Contact Us & Control Center
            </h4>
            <div className="space-y-2 text-text-secondary">
              <p className="flex items-center gap-2.5">
                <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                <span>
                  National Load Despatch & Telemetry Center, Dhaka, Bangladesh
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-3.5 w-3.5 text-accent shrink-0" />
                <span>
                  Supervisory Control Desk: +880-2-955-GRID (24/7 Operations)
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 text-accent shrink-0" />
                <span>telemetry-support@powergrid.gov.bd</span>
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="border-t border-border bg-bg py-4 px-6 text-center text-[11px] text-text-secondary font-mono">
        © 2026 National Power Grid Telemetry & AI Decision-Support Platform •
        Government Prototype Blueprint
      </div>
    </footer>
  );
}
