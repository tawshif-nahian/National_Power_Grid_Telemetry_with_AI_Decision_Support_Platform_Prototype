/**
 * What it does: Handles administrator login, logout, and fetching the logged-in person's name and role from Supabase.
 * Who uses it: Imported only by `frontend/src/hooks/useAuth.js`.
 * What it talks to: Talks to Supabase Auth and the `profiles` table via `frontend/src/services/supabaseClient.js`.
 */

import { supabase } from "./supabaseClient";

async function fetchUserProfile(authUser) {
  if (!authUser) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", authUser.id)
    .maybeSingle();

  const role =
    profile?.role ||
    authUser.user_metadata?.role ||
    authUser.app_metadata?.role ||
    "user";

  const fullName =
    profile?.full_name ||
    authUser.user_metadata?.full_name ||
    authUser.email?.split("@")[0] ||
    "Admin";

  return {
    id: authUser.id,
    email: authUser.email,
    fullName,
    role,
  };
}

export async function signInAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data?.user) {
    return {
      user: null,
      error: error?.message || "Invalid email or password.",
    };
  }

  const userProfile = await fetchUserProfile(data.user);

  if (userProfile.role !== "admin") {
    await supabase.auth.signOut();
    return {
      user: null,
      error: "This account does not have admin access.",
    };
  }

  return { user: userProfile, error: null };
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  return { error: error?.message || null };
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  if (!data?.user) return null;

  const userProfile = await fetchUserProfile(data.user);
  if (userProfile.role !== "admin") {
    return null;
  }
  return userProfile;
}

export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session?.user) {
      callback(null);
      return;
    }
    const userProfile = await fetchUserProfile(session.user);
    callback(userProfile?.role === "admin" ? userProfile : null);
  });
  return () => data.subscription.unsubscribe();
}
