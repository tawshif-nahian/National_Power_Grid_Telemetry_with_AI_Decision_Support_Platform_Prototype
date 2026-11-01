/**
 * What it does: Renders the administrator email and password login form in the warm editorial palette and redirects to `/dashboard`.
 * Who uses it: Rendered by `frontend/src/App.jsx` at the `/login` address.
 * What it talks to: Calls `useAuth` hook (`Page -> useAuth -> authService -> Supabase`).
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Reveal from "../components/ui/Reveal";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both your email address and password.");
      return;
    }

    setSubmitting(true);
    try {
      const { user, error } = await login(email.trim(), password);
      if (error || !user) {
        setErrorMsg(
          error || "Unable to sign in. Please check your credentials."
        );
        return;
      }
      navigate("/dashboard");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 sm:px-6 py-16">
      <Reveal>
        <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-accent bg-bg border border-border px-2.5 py-0.5 rounded">
              <ShieldCheck className="h-3.5 w-3.5" /> Authorized Personnel Only
            </span>
            <h1 className="text-2xl font-heading font-bold text-text-primary">
              Administrator Login
            </h1>
            <p className="text-xs text-text-secondary">
              Sign in with your National Power Telemetry administrator
              credentials.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-status-critical/10 border border-status-critical/40 text-status-critical px-4 py-3 rounded-lg text-xs font-medium flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label
                htmlFor="admin-email"
                className="block font-semibold text-text-primary mb-1.5"
              >
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@powergrid.gov.bd"
                className="w-full bg-bg border border-border rounded-lg px-3.5 py-2.5 text-text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block font-semibold text-text-primary mb-1.5"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-bg border border-border rounded-lg px-3.5 py-2.5 text-text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white rounded-lg text-xs font-heading font-bold tracking-wider uppercase cursor-pointer transition-colors"
            >
              {submitting ? "Verifying Access..." : "Sign In"}
            </button>
          </form>
        </div>
      </Reveal>
    </div>
  );
}
