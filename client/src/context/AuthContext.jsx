import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

const AuthContext = createContext(null);
const DEMO_USER_STORAGE_KEY = "lokerbuster_demo_user";
const DEMO_USER = {
  id: "demo-user",
  username: "Demo User",
  email: "demo@lokerbuster.local",
  isDemo: true,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (localStorage.getItem(DEMO_USER_STORAGE_KEY) === "true") {
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me/");
      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login/", { email, password });
    setUser(res.data.data);
    return res.data;
  };

  const register = async (email, username, password) => {
    const res = await api.post("/auth/register/", { email, username, password });
    setUser(res.data.data);
    return res.data;
  };

  const bypassLogin = () => {
    localStorage.setItem(DEMO_USER_STORAGE_KEY, "true");
    setUser(DEMO_USER);
  };

  const logout = async () => {
    try {
      if (!user?.isDemo) {
        await api.post("/auth/logout/");
      }
    } catch {
      /* ignore logout network failure */
    } finally {
      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, bypassLogin, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
