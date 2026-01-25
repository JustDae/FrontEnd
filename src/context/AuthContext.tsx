import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { loginApi, registerApi } from "../services/auth.service";

export type AuthUser = {
  id?: string;
  email?: string;
  username?: string;
  role?: string;
  rolId?: number;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  login: (payload: { username: string; password: string }) => Promise<void>;
  register: (payload: { username: string; email: string; password: string; rolId: number }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function parseJwt(token: string): Record<string, any> | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
}

function userFromToken(token: string): AuthUser | null {
  const payload = parseJwt(token);
  if (!payload) return null;

  return {
    id: payload.id ?? payload.sub,
    email: payload.email,
    username: payload.username,
    role: payload.role,
    rolId: payload.rolId,
  };
}

function loadInitialAuth(): { token: string | null; user: AuthUser | null } {
  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("auth_user");
  const storedUser: AuthUser | null = rawUser ? JSON.parse(rawUser) : null;

  if (token) {
    const jwtUser = userFromToken(token);
    return { token, user: { ...(storedUser || {}), ...(jwtUser || {}) } };
  }
  return { token: null, user: storedUser };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = loadInitialAuth();
  const [token, setToken] = useState<string | null>(initial.token);
  const [user, setUser] = useState<AuthUser | null>(initial.user);

  const persistAuth = (token: string, fallback?: AuthUser) => {
    const jwtUser = userFromToken(token);
    const merged = { ...(fallback || {}), ...(jwtUser || {}) };

    setToken(token);
    setUser(merged);

    localStorage.setItem("token", token);
    localStorage.setItem("auth_user", JSON.stringify(merged));
  };

  const login = async (payload: { username: string; password: string }) => {
    const token = await loginApi(payload);
    persistAuth(token, { username: payload.username });
  };

  const register = async (payload: { username: string; email: string; password: string; rolId: number }) => {
    const token = await registerApi(payload);
    persistAuth(token, { username: payload.username, email: payload.email, rolId: payload.rolId });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("token");
  };

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}