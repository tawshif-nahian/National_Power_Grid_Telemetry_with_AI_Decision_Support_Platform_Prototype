/**
 * What it does: Guards administrator pages so visitors see the standard "Page not found" screen instead of knowing the page exists.
 * Who uses it: Imported by `frontend/src/App.jsx` to wrap admin routes and unknown URLs.
 * What it talks to: Reads `isAdmin` and `loading` from `useAuth` hook (never talks to Supabase directly).
 */

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function NotFoundScreen() {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg w-full mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-2xs space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
          404
        </span>
        <h1 className="text-xl font-bold text-slate-900">Page not found</h1>
        <p className="text-xs text-slate-500">
          The page you are looking for does not exist or may have been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold cursor-pointer"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-[#1D4ED8] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <NotFoundScreen />;
  }

  return children;
}

