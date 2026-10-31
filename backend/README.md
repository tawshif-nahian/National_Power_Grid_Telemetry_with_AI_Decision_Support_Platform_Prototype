# Backend Folder

Everything inside `backend/` runs outside the visitor's web browser. It holds three subfolders:

1. **`database/`**: Contains `schema_and_seed.sql`, which is the SQL blueprint that creates your PostgreSQL tables in Supabase, sets up security rules, turns on live data updates, and loads the starting power plant data.
2. **`simulator/`**: Contains `generator.py`, a Python script that acts like live sensors at Payra, Titas, and Sirajganj, sending new electricity readings to the Supabase database every 5 seconds.
3. **`supabase/functions/chat/`**: Reserved for the future AI chatbot server function, where the private ChatGPT or Claude API key will live safely out of sight of the browser.

