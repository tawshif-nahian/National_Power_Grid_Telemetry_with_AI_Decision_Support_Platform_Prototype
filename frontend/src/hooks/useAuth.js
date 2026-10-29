/**
 * What it does: Remembers who is logged in, whether they are an admin, and shares that state across all screens.
 * Who uses it: Imported by `App.jsx`, `Header.jsx`, `ProtectedRoute.jsx`, and `LoginPage.jsx`.
 * What it talks to: Talks only to `frontend/src/services/authService.js` (never talks to Supabase directly).
 */

import { useState, useEffect, useCallback } from "react";
import {
  getCurrentUser,
  onAuthStateChange,
  signInAdmin,
  signOutAdmin,
} from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser().then((currentUser) => {
      if (isMounted) {
        setUser(currentUser);
        setLoading(false);
      }
    });

    const unsubscribe = onAuthStateChange((updatedUser) => {
      if (isMounted) {
        setUser(updatedUser);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await signInAdmin(email, password);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  }, []);

  const logout = useCallback(async () => {
    const result = await signOutAdmin();
    setUser(null);
    return result;
  }, []);

  return {
    user,
    adminName: user?.fullName || null,
    isAdmin: user?.role === "admin",
    loading,
    login,
    logout,
  };
}
