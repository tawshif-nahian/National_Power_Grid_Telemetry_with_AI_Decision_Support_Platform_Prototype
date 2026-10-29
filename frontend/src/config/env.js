/**
 * What it does: Reads environment variables from `frontend/.env` and logs a clear warning if any required key is missing.
 * Who uses it: Imported only by files inside `frontend/src/services/` (`supabaseClient.js` and `chatbotService.js`).
 * What it talks to: Reads Vite's `import.meta.env` browser environment settings.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

if (!SUPABASE_URL) {
  console.error(
    "Missing environment variable: VITE_SUPABASE_URL is not set in frontend/.env. Please copy frontend/.env.example to frontend/.env and fill in your Supabase URL."
  );
}

if (!SUPABASE_ANON_KEY) {
  console.error(
    "Missing environment variable: VITE_SUPABASE_ANON_KEY is not set in frontend/.env. Please copy frontend/.env.example to frontend/.env and fill in your Supabase key."
  );
}

export const ENV = {
  SUPABASE_URL: SUPABASE_URL || "",
  SUPABASE_ANON_KEY: SUPABASE_ANON_KEY || "",
  GEMINI_API_KEY,
};

