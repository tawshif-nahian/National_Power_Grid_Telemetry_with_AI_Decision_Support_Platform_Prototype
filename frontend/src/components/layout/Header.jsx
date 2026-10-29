/**
 * What it does: Renders the top navigation bar, showing only the menu items allowed for the current visitor or admin.
 * Who uses it: Imported by `frontend/src/App.jsx`.
 * What it talks to: Reads `NAV_ITEMS` from `frontend/src/config/navigation.js` and auth state from `useAuth` hook (never talks to Supabase).
 */

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Zap, Menu, X, ChevronDown, LogOut, UserCheck } from "lucide-react";
import { NAV_ITEMS } from "../../config/navigation";
import { useAuth } from "../../hooks/useAuth";

export default function Header({ currentFreq = 50.0 }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, adminName, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.visibleTo === "everyone") return true;
    if (item.visibleTo === "admin") return isAdmin;
    if (item.visibleTo === "loggedOut") return !isAdmin;
    return false;
  });

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    setAdminDropdownOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    setAdminDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Official Emblem & Two-Tone Title (NPP Style) */}
        <div
          onClick={() => handleNavClick("/")}
          className="flex items-center gap-3.5 cursor-pointer shrink-0"
        >
          <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shadow-2xs">
            <Zap className="h-6 w-6 text-[#1D4ED8] fill-[#F59E0B]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 tracking-tight">
              <span className="text-xl sm:text-2xl font-black text-[#1D4ED8]">
                NATIONAL
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#F59E0B]">
                POWER PORTAL
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide">
              Remote Monitoring, Cost Modeling & AI Decision Support
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`text-xs lg:text-[13px] font-bold tracking-wider py-2 border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? "text-[#1D4ED8] border-[#F59E0B]"
                    : "text-slate-700 border-transparent hover:text-[#1D4ED8]"
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Admin Name & Logout Dropdown (replaces Login when logged in as admin) */}
          {isAdmin && (
            <div className="relative">
              <button
                onClick={() => setAdminDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold tracking-wider uppercase bg-amber-50 text-slate-900 border-2 border-[#F59E0B] rounded-lg cursor-pointer hover:bg-amber-100 transition-colors"
              >
                <UserCheck className="h-3.5 w-3.5 text-[#1D4ED8]" />
                <span>{adminName}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-600" />
              </button>

              {adminDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Right Live Frequency Indicator & Mobile Hamburger Button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            {currentFreq.toFixed(2)} Hz
          </div>

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Hamburger Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-50 border-t border-slate-200 px-4 py-3 space-y-2">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`block w-full text-left px-3 py-2 text-xs font-bold rounded-lg cursor-pointer ${
                  isActive
                    ? "bg-[#1D4ED8] text-white"
                    : "text-slate-700 hover:bg-slate-200/70"
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {isAdmin && (
            <div className="pt-2 mt-2 border-t border-slate-200 flex items-center justify-between px-3 py-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-[#1D4ED8]" />
                {adminName}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
