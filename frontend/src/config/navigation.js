/**
 * What it does: Defines the single master list of top navigation bar menu items and who is allowed to see each one.
 * Who uses it: Imported by `Header.jsx` to draw only the menu buttons allowed for the current person.
 * What it talks to: Pure configuration file (does not talk to any backend or database).
 *
 * HOW TO ADD A NEW MENU ITEM IN 3 STEPS:
 * 1. Create your new page file inside `frontend/src/pages/` (for example, `NewPage.jsx`).
 * 2. Add a `<Route path="/your-address" element={<NewPage />} />` line inside `frontend/src/App.jsx`.
 * 3. Add a `{ id: "new-item", label: "YOUR LABEL", path: "/your-address", icon: "IconName", visibleTo: "everyone" }` entry to `NAV_ITEMS` below.
 */

export const NAV_ITEMS = [
  {
    id: "home",
    label: "HOME",
    path: "/",
    icon: "Home",
    visibleTo: "everyone",
  },
  {
    id: "dashboard",
    label: "DASHBOARD",
    path: "/dashboard",
    icon: "Activity",
    visibleTo: "everyone",
  },
  {
    id: "report-review",
    label: "REPORT REVIEW",
    path: "/admin/report-review",
    icon: "FileText",
    visibleTo: "admin",
  },
  {
    id: "cost-modelling",
    label: "COST MODELLING",
    path: "/admin/cost-modelling",
    icon: "Sliders",
    visibleTo: "admin",
  },
  {
    id: "anomaly-detection",
    label: "ANOMALY DETECTION",
    path: "/admin/anomaly-detection",
    icon: "ShieldAlert",
    visibleTo: "admin",
  },
  {
    id: "login",
    label: "LOGIN",
    path: "/login",
    icon: "LogIn",
    visibleTo: "loggedOut",
  },
];
