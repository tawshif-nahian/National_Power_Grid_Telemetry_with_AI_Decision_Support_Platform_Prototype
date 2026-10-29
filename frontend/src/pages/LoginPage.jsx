/**
 * What it does: Renders the administrator email and password login form and redirects to `/dashboard` on success.
 * Who uses it: Rendered by `frontend/src/App.jsx` at the `/login` address.
 * What it talks to: Calls `useAuth` hook (`Page -> useAuth -> authService -> Supabase`).
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

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
        setErrorMsg(error || "Unable to sign in. Please check your credentials.");
        return;
      }
      navigate("/dashboard");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 sm:px-6 py-16">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded">
            <ShieldCheck className="h-3.5 w-3.5" /> Authorized Personnel Only
          </span>
          <h1 className="text-xl font-bold text-slate-900">
            Administrator Login
          </h1>
          <p className="text-xs text-slate-500">
            Sign in with your National Power Portal administrator credentials.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg text-xs font-medium flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label
              htmlFor="admin-email"
              className="block font-semibold text-slate-700 mb-1.5"
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
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#1D4ED8]"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block font-semibold text-slate-700 mb-1.5"
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
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#1D4ED8]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-[#1D4ED8] hover:bg-blue-800 disabled:opacity-60 text-white rounded-lg text-xs font-bold tracking-wider uppercase cursor-pointer transition-colors"
          >
            {submitting ? "Verifying Access..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
