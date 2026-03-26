import api from "@/lib/axios";
import { mockDelay, mockUsers } from "@/lib/mockData";
import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  User,
} from "@/types";
import Cookies from "js-cookie";

const USE_MOCK = true; // Toggle to false when API is ready

// ─── Auth Services ──────────────────────────────────────────────────────────

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    if (USE_MOCK) {
      await mockDelay();
      // Simulate credential check
      if (payload.password.length < 6) {
        throw { response: { data: { message: "Credenciais inválidas" }, status: 401 } };
      }
      // Return provider if email contains "provider" or "carlos"
      const isProvider = payload.email.includes("provider") || payload.email.includes("carlos");
      const user = isProvider ? mockUsers["provider1"] : mockUsers["client1"];
      const token = `mock_token_${Date.now()}`;
      return { token, user };
    }

    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (USE_MOCK) {
      await mockDelay(1200);
      if (payload.password !== payload.confirmPassword) {
        throw { response: { data: { message: "As senhas não coincidem" }, status: 422 } };
      }
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        role: payload.role,
        createdAt: new Date().toISOString(),
      };
      const token = `mock_token_${Date.now()}`;
      return { token, user: newUser };
    }

    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },

  async logout(): Promise<void> {
    if (USE_MOCK) {
      await mockDelay(300);
      return;
    }
    await api.post("/auth/logout");
  },

  async getProfile(): Promise<User> {
    if (USE_MOCK) {
      await mockDelay(500);
      const stored = Cookies.get("agendei_user");
      if (stored) return JSON.parse(stored);
      return mockUsers["client1"];
    }
    const { data } = await api.get<User>("/auth/me");
    return data;
  },

  // Helpers
  saveSession(response: AuthResponse) {
    Cookies.set("agendei_token", response.token, { expires: 7 });
    Cookies.set("agendei_user", JSON.stringify(response.user), { expires: 7 });
  },

  clearSession() {
    Cookies.remove("agendei_token");
    Cookies.remove("agendei_user");
  },

  getStoredUser(): User | null {
    const stored = Cookies.get("agendei_user");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!Cookies.get("agendei_token");
  },
};
