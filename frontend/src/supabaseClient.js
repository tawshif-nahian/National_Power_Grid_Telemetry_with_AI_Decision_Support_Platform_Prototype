import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://dvihcmjxeooanargzpxb.supabase.co";
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_IV9_rKRHgagioYNfVquMlA_O7p-ux7B";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
