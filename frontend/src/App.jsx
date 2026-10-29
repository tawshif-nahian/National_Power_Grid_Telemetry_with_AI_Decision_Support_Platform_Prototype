/**
 * What it does: Acts as the short traffic controller for the website, connecting live telemetry hooks and protected routes to each page address.
 * Who uses it: Mounted by `frontend/src/main.jsx`.
 * What it talks to: Calls `useGridTelemetry` hook, and renders `Header`, `Footer`, `ChatbotWidget`, `ProtectedRoute`, and page routes.
 */

import { Routes, Route } from "react-router-dom";
import { useGridTelemetry } from "./hooks/useGridTelemetry";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ProtectedRoute, {
  NotFoundScreen,
} from "./components/layout/ProtectedRoute";
import ChatbotWidget from "./components/chatbot/ChatbotWidget";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ReportReviewPage from "./pages/ReportReviewPage";
import CostModellingPage from "./pages/CostModellingPage";
import AnomalyDetectionPage from "./pages/AnomalyDetectionPage";

export default function App() {
  const grid = useGridTelemetry();

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-slate-800 font-sans flex flex-col">
      <Header currentFreq={grid.currentFreq} />

      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<HomePage {...grid} />} />
          <Route path="/dashboard" element={<DashboardPage {...grid} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin/report-review"
            element={
              <ProtectedRoute>
                <ReportReviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cost-modelling"
            element={
              <ProtectedRoute>
                <CostModellingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/anomaly-detection"
            element={
              <ProtectedRoute>
                <AnomalyDetectionPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundScreen />} />
        </Routes>
      </main>

      <ChatbotWidget />
      <Footer />
    </div>
  );
}
