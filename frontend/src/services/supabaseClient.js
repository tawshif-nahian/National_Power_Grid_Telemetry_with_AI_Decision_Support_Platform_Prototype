// THIS IS THE CONNECTION BETWEEN FRONTEND AND BACKEND.
/**
 * What it does: Creates and exports the single Supabase client connection used by the frontend.
 * Who uses it: Imported only by service files inside `frontend/src/services/` (`authService.js`, `telemetryService.js`).
 * What it talks to: Connects to your Supabase cloud project using keys from `frontend/src/config/env.js`.
 */

import { createClient } from "@supabase/supabase-js";
import { ENV } from "../config/env";

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

