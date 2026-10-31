-- ============================================================================
-- DRAFT ONLY (Do NOT run without owner approval)
-- What it does: Creates the `profiles` table for user names and roles ('user' or 'admin'),
--               allows each logged-in user to read only their own profile row,
--               and provides an `is_admin()` helper function for future admin-only tables.
-- Who uses it: Run once in the Supabase SQL Editor by the project owner.
-- What it talks to: Links to Supabase Auth's built-in `auth.users` table.
-- ============================================================================

-- 1. Create the profiles table linked to Supabase login accounts (auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT 'Operator',
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Turn on Row-Level Security (RLS) so nobody can read profiles by default
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Let each logged-in person read ONLY their own profile row
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- 4. Helper check: "Is the currently logged-in person an admin?"
--    Future admin-only tables can call `public.is_admin()` inside their RLS policies.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
          AND role = 'admin'
    );
$$;

