/**
 * What it does: Renders the institutional bottom footer with About Us, Portal Modules, and Contact Us details.
 * Who uses it: Imported by `frontend/src/App.jsx`.
 * What it talks to: Uses React Router's `useNavigate` to link to pages (does not talk to any backend or database).
 */

import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#EBEAE4] border-t border-slate-300 text-slate-700 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
        {/* Column 1: About Us */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
            About National Power Portal
          </h4>
          <p className="text-slate-600 leading-relaxed">
            Web-Based Remote Monitoring, Electricity Cost Modeling, and
            Decision Support System Powered by Artificial Intelligence.
            Designed as the national supervisory blueprint inspired by India’s{" "}
            <span className="font-semibold">npp.gov.in</span> and Australia’s{" "}
            <span className="font-semibold">openelectricity.org.au</span>.
          </p>
        </div>

        {/* Column 2: Quick Navigation & Modules */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
            Portal Modules & Data Access
          </h4>
          <ul className="space-y-1.5 text-slate-600">
            <li>
              <button
                onClick={() => navigate("/dashboard")}
                className="hover:text-[#1D4ED8] cursor-pointer"
              >
                • Real-Time Supervisory Dashboard (MW, kV, Hz)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/admin/cost-modelling")}
                className="hover:text-[#1D4ED8] cursor-pointer"
              >
                • Thermodynamic Cost Modeling ($/kWh Equations)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/dashboard")}
                className="hover:text-[#1D4ED8] cursor-pointer"
              >
                • Fuel Inventory & Reserve Alerts (Coal & Gas)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/dashboard")}
                className="hover:text-[#1D4ED8] cursor-pointer"
              >
                • Historical Outage Matrix & CSV Data Exporter
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Us */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
            Contact Us & Control Center
          </h4>
          <div className="space-y-1.5 text-slate-600">
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[#1D4ED8] shrink-0" />
              National Load Despatch & Telemetry Center, Dhaka, Bangladesh
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-[#1D4ED8] shrink-0" />
              Supervisory Control Desk: +880-2-955-GRID (24/7 Operations)
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-[#1D4ED8] shrink-0" />
              telemetry-support@powergrid.gov.bd
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-300/80 bg-[#E2E1DA] py-3 px-6 text-center text-[11px] text-slate-600">
        © 2026 National Power Grid Telemetry & AI Decision-Support Platform •
        Government Prototype Blueprint
      </div>
    </footer>
  );
}

