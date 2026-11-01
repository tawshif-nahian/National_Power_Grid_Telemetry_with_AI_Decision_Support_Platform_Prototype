/**
 * What it does: Renders the top navigation bar with the "National Power Telemetry" brand flush left and all menu items on a single line.
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
    <header className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="w-full px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        {/* Brand moved further left with updated title and visitor-appropriate tagline */}
        <div
          onClick={() => handleNavClick("/")}
          className="flex items-center gap-3 cursor-pointer shrink-0"
        >
          <div className="w-10 h-10 rounded-full bg-bg border border-border flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5 text-accent" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 tracking-tight font-heading whitespace-nowrap">
              <span className="text-lg sm:text-xl font-extrabold text-text-primary">
                NATIONAL POWER
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-accent">
                TELEMETRY
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-text-secondary font-medium tracking-wide whitespace-nowrap">
              Real-Time Generation, Capacity & Grid Frequency Monitoring
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links — Strictly single line (whitespace-nowrap) */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-5 xl:gap-6 shrink-0">
          {visibleItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`text-[11px] lg:text-xs font-heading font-bold tracking-wider whitespace-nowrap py-2 border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? "text-accent border-accent"
                    : "text-text-primary border-transparent hover:text-accent"
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {isAdmin && (
            <div className="relative shrink-0">
              <button
                onClick={() => setAdminDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] lg:text-xs font-heading font-bold tracking-wider uppercase whitespace-nowrap bg-bg text-text-primary border border-accent rounded-lg cursor-pointer hover:bg-accent hover:text-white transition-colors"
              >
                <UserCheck className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">{adminName}</span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0" />
              </button>

              {adminDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-surface border border-border rounded-xl py-1.5 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-status-critical hover:bg-bg flex items-center gap-2 cursor-pointer whitespace-nowrap"
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
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-text-primary bg-bg border border-border px-2.5 py-1 rounded whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-status-online animate-pulse shrink-0" />
            {currentFreq.toFixed(2)} Hz
          </div>

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg border border-border text-text-primary hover:bg-bg cursor-pointer"
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
        <div className="md:hidden bg-bg border-t border-border px-4 py-3 space-y-2">
          {visibleItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`block w-full text-left px-3 py-2 text-xs font-heading font-bold rounded-lg cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-accent text-white"
                    : "text-text-primary hover:bg-surface"
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {isAdmin && (
            <div className="pt-2 mt-2 border-t border-border flex items-center justify-between px-3 py-1.5">
              <span className="text-xs font-bold text-text-primary flex items-center gap-1.5 whitespace-nowrap">
                <UserCheck className="h-3.5 w-3.5 text-accent" />
                {adminName}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-status-critical text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
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
