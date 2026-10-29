/**
 * What it does: Starts the React frontend and mounts `App.jsx` inside `index.html`.
 * Who uses it: Loaded automatically by `frontend/index.html`.
 * What it talks to: Renders `App.jsx` wrapped in React Router's `BrowserRouter`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
