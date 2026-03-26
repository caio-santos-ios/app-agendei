"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, LoginPayload, RegisterPayload } from "@/types";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) setUser(storedUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await authService.login(payload);
      authService.saveSession(response);
      setUser(response.user);
      toast.success(`Bem-vindo, ${response.user.name.split(" ")[0]}! 👋`);
      router.push("/home");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await authService.register(payload);
      authService.saveSession(response);
      setUser(response.user);
      toast.success("Conta criada com sucesso! 🎉");
      router.push("/home");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      authService.clearSession();
      setUser(null);
      setIsLoading(false);
      router.push("/login");
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
