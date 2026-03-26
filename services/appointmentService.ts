import api from "@/lib/axios";
import {
  mockDelay,
  mockProviders,
  mockAppointments,
  mockProviderAppointments,
} from "@/lib/mockData";
import {
  Provider,
  Appointment,
  CreateAppointmentPayload,
  ServiceCategory,
  PaginatedResponse,
} from "@/types";

const USE_MOCK = true;

// ─── Provider Service ────────────────────────────────────────────────────────

export const providerService = {
  async getProviders(
    category?: ServiceCategory,
    search?: string
  ): Promise<PaginatedResponse<Provider>> {
    if (USE_MOCK) {
      await mockDelay();
      let results = [...mockProviders];
      if (category) results = results.filter((p) => p.category === category);
      if (search) {
        const q = search.toLowerCase();
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.bio.toLowerCase().includes(q)
        );
      }
      return { data: results, total: results.length, page: 1, limit: 20, hasMore: false };
    }

    const { data } = await api.get<PaginatedResponse<Provider>>("/providers", {
      params: { category, search },
    });
    return data;
  },

  async getProviderById(id: string): Promise<Provider> {
    if (USE_MOCK) {
      await mockDelay(600);
      const provider = mockProviders.find((p) => p.id === id);
      if (!provider) throw new Error("Profissional não encontrado");
      return provider;
    }

    const { data } = await api.get<Provider>(`/providers/${id}`);
    return data;
  },

  async getFeaturedProviders(): Promise<Provider[]> {
    if (USE_MOCK) {
      await mockDelay(700);
      return mockProviders.slice(0, 4);
    }

    const { data } = await api.get<Provider[]>("/providers/featured");
    return data;
  },

  // For provider users - get their own profile
  async getMyProviderProfile(): Promise<Provider> {
    if (USE_MOCK) {
      await mockDelay(500);
      return mockProviders[0];
    }

    const { data } = await api.get<Provider>("/providers/me");
    return data;
  },

  async updateProviderProfile(payload: Partial<Provider>): Promise<Provider> {
    if (USE_MOCK) {
      await mockDelay(800);
      return { ...mockProviders[0], ...payload };
    }

    const { data } = await api.put<Provider>("/providers/me", payload);
    return data;
  },

  async getAvailableSlots(
    providerId: string,
    date: string
  ): Promise<string[]> {
    if (USE_MOCK) {
      await mockDelay(500);
      const slots = [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
        "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00", "17:30",
      ];
      // Randomly remove some slots
      return slots.filter(() => Math.random() > 0.25);
    }

    const { data } = await api.get<string[]>(
      `/providers/${providerId}/slots`,
      { params: { date } }
    );
    return data;
  },
};

// ─── Appointment Service ─────────────────────────────────────────────────────

export const appointmentService = {
  // Client: get own appointments
  async getMyAppointments(): Promise<Appointment[]> {
    if (USE_MOCK) {
      await mockDelay(700);
      return mockAppointments;
    }

    const { data } = await api.get<Appointment[]>("/appointments/me");
    return data;
  },

  // Provider: get incoming appointments
  async getProviderAppointments(): Promise<Appointment[]> {
    if (USE_MOCK) {
      await mockDelay(700);
      return mockProviderAppointments;
    }

    const { data } = await api.get<Appointment[]>("/appointments/provider");
    return data;
  },

  async createAppointment(
    payload: CreateAppointmentPayload
  ): Promise<Appointment> {
    if (USE_MOCK) {
      await mockDelay(1000);
      const provider = mockProviders.find((p) => p.id === payload.providerId);
      const service = provider?.services.find((s) => s.id === payload.serviceId);
      if (!provider || !service) throw new Error("Dados inválidos");

      const newApt: Appointment = {
        id: `apt_${Date.now()}`,
        clientId: "client1",
        providerId: payload.providerId,
        serviceId: payload.serviceId,
        date: payload.date,
        time: payload.time,
        status: "pending",
        service,
        provider,
        notes: payload.notes,
        createdAt: new Date().toISOString(),
      };
      return newApt;
    }

    const { data } = await api.post<Appointment>("/appointments", payload);
    return data;
  },

  async cancelAppointment(id: string): Promise<void> {
    if (USE_MOCK) {
      await mockDelay(600);
      return;
    }

    await api.patch(`/appointments/${id}/cancel`);
  },

  async confirmAppointment(id: string): Promise<void> {
    if (USE_MOCK) {
      await mockDelay(600);
      return;
    }

    await api.patch(`/appointments/${id}/confirm`);
  },

  async completeAppointment(id: string): Promise<void> {
    if (USE_MOCK) {
      await mockDelay(600);
      return;
    }

    await api.patch(`/appointments/${id}/complete`);
  },
};
