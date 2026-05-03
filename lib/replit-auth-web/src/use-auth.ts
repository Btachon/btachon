import { useState, useEffect, useCallback } from "react";
import type { AuthUser } from "@workspace/api-client-react";
import { setAuthTokenGetter } from "@workspace/api-client-react";

export type { AuthUser };

const JWT_KEY = "btachon:jwt";

export function getStoredJwt(): string | null {
  try {
    return localStorage.getItem(JWT_KEY);
  } catch {
    return null;
  }
}

export function storeJwt(token: string) {
  try {
    localStorage.setItem(JWT_KEY, token);
  } catch {}
}

export function clearJwt() {
  try {
    localStorage.removeItem(JWT_KEY);
  } catch {}
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

function getBasePath(): string {
  const meta = import.meta as Record<string, any>;
  const base: string = meta?.env?.BASE_URL ?? "/";
  return base.replace(/\/+$/, "") || "/";
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wire up the JWT getter for all API calls
    setAuthTokenGetter(getStoredJwt);

    // Extract ?token= from URL if present (post-Google-OAuth redirect)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      storeJwt(urlToken);
      params.delete("token");
      params.delete("auth_error");
      const newSearch = params.toString();
      const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : "") + window.location.hash;
      window.history.replaceState({}, "", newUrl);
    }

    const token = urlToken ?? getStoredJwt();

    if (!token) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    fetch("/api/auth/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ user: AuthUser | null }>;
      })
      .then((data) => {
        if (!cancelled) {
          if (data.user) {
            setUser(data.user);
          } else {
            clearJwt();
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          clearJwt();
          setUser(null);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(() => {
    const base = getBasePath();
    window.location.href = `/api/auth/google?returnTo=${encodeURIComponent(base)}`;
  }, []);

  const logout = useCallback(() => {
    clearJwt();
    setUser(null);
    fetch("/api/logout", { method: "POST" }).catch(() => {});
    window.location.href = "/";
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
