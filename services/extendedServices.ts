import api from "@/lib/axios";
import { mockDelay } from "@/lib/mockData";
import {
  mockReviews, mockSpendingRecords, mockSpendingSummary,
  mockFavorites, mockConversations, mockMessages,
  mockNotifications, mockPayments, mockRevenueData,
} from "@/lib/mockDataExtended";
import {
  Review, CreateReviewPayload, SpendingRecord, SpendingSummary,
  Favorite, ChatMessage, Conversation, Notification,
  Payment, CreatePaymentPayload, RevenueData, Service,
} from "@/types";
import { mockProviders } from "@/lib/mockData";

const USE_MOCK = true;

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const reviewService = {
  async getProviderReviews(providerId: string): Promise<Review[]> {
    if (USE_MOCK) { await mockDelay(600); return mockReviews.filter(r => r.providerId === providerId); }
    const { data } = await api.get<Review[]>(`/providers/${providerId}/reviews`);
    return data;
  },
  async createReview(payload: CreateReviewPayload): Promise<Review> {
    if (USE_MOCK) {
      await mockDelay(900);
      return { id: `rev_${Date.now()}`, clientId: "client1", ...payload, createdAt: new Date().toISOString() };
    }
    const { data } = await api.post<Review>("/reviews", payload);
    return data;
  },
  async getMyReviews(): Promise<Review[]> {
    if (USE_MOCK) { await mockDelay(600); return mockReviews; }
    const { data } = await api.get<Review[]>("/reviews/me");
    return data;
  },
};

// ─── Spending ─────────────────────────────────────────────────────────────────
export const spendingService = {
  async getMySpending(): Promise<SpendingRecord[]> {
    if (USE_MOCK) { await mockDelay(700); return mockSpendingRecords; }
    const { data } = await api.get<SpendingRecord[]>("/spending/me");
    return data;
  },
  async getSpendingSummary(): Promise<SpendingSummary> {
    if (USE_MOCK) { await mockDelay(600); return mockSpendingSummary; }
    const { data } = await api.get<SpendingSummary>("/spending/summary");
    return data;
  },
};

// ─── Favorites ────────────────────────────────────────────────────────────────
export const favoritesService = {
  async getMyFavorites(): Promise<Favorite[]> {
    if (USE_MOCK) { await mockDelay(600); return mockFavorites; }
    const { data } = await api.get<Favorite[]>("/favorites");
    return data;
  },
  async addFavorite(providerId: string): Promise<Favorite> {
    if (USE_MOCK) {
      await mockDelay(500);
      const provider = mockProviders.find(p => p.id === providerId)!;
      return { id: `fav_${Date.now()}`, clientId: "client1", providerId, provider, createdAt: new Date().toISOString() };
    }
    const { data } = await api.post<Favorite>("/favorites", { providerId });
    return data;
  },
  async removeFavorite(providerId: string): Promise<void> {
    if (USE_MOCK) { await mockDelay(400); return; }
    await api.delete(`/favorites/${providerId}`);
  },
  async isFavorite(providerId: string): Promise<boolean> {
    if (USE_MOCK) { return mockFavorites.some(f => f.providerId === providerId); }
    const { data } = await api.get<{ isFavorite: boolean }>(`/favorites/${providerId}/check`);
    return data.isFavorite;
  },
};

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const chatService = {
  async getConversations(): Promise<Conversation[]> {
    if (USE_MOCK) { await mockDelay(700); return mockConversations; }
    const { data } = await api.get<Conversation[]>("/conversations");
    return data;
  },
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    if (USE_MOCK) { await mockDelay(500); return mockMessages[conversationId] || []; }
    const { data } = await api.get<ChatMessage[]>(`/conversations/${conversationId}/messages`);
    return data;
  },
  async sendMessage(conversationId: string, content: string): Promise<ChatMessage> {
    if (USE_MOCK) {
      await mockDelay(300);
      return { id: `msg_${Date.now()}`, conversationId, senderId: "client1", senderRole: "client", content, type: "text", read: false, createdAt: new Date().toISOString() };
    }
    const { data } = await api.post<ChatMessage>(`/conversations/${conversationId}/messages`, { content });
    return data;
  },
  async getOrCreateConversation(providerId: string): Promise<Conversation> {
    if (USE_MOCK) {
      await mockDelay(400);
      const existing = mockConversations.find(c => c.providerId === providerId);
      if (existing) return existing;
      const provider = mockProviders.find(p => p.id === providerId)!;
      return { id: `conv_${Date.now()}`, clientId: "client1", providerId, provider, unreadCount: 0, updatedAt: new Date().toISOString() };
    }
    const { data } = await api.post<Conversation>("/conversations", { providerId });
    return data;
  },
  async markAsRead(conversationId: string): Promise<void> {
    if (USE_MOCK) { await mockDelay(200); return; }
    await api.patch(`/conversations/${conversationId}/read`);
  },
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    if (USE_MOCK) { await mockDelay(600); return mockNotifications; }
    const { data } = await api.get<Notification[]>("/notifications");
    return data;
  },
  async markAsRead(id: string): Promise<void> {
    if (USE_MOCK) { await mockDelay(200); return; }
    await api.patch(`/notifications/${id}/read`);
  },
  async markAllAsRead(): Promise<void> {
    if (USE_MOCK) { await mockDelay(300); return; }
    await api.patch("/notifications/read-all");
  },
  async subscribePush(subscription: PushSubscription): Promise<void> {
    if (USE_MOCK) { await mockDelay(400); return; }
    await api.post("/notifications/subscribe", { subscription });
  },
};

// ─── Payments ─────────────────────────────────────────────────────────────────
export const paymentService = {
  async createPayment(payload: CreatePaymentPayload): Promise<Payment> {
    if (USE_MOCK) {
      await mockDelay(1200);
      return {
        id: `pay_${Date.now()}`,
        appointmentId: payload.appointmentId,
        amount: 55,
        method: payload.method,
        status: "pending",
        pixCode: payload.method === "pix" ? "00020126580014BR.GOV.BCB.PIX0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540555.005802BR5913Agendei6006Ilheus62070503***6304A1B2" : undefined,
        createdAt: new Date().toISOString(),
      };
    }
    const { data } = await api.post<Payment>("/payments", payload);
    return data;
  },
  async getPaymentStatus(paymentId: string): Promise<Payment> {
    if (USE_MOCK) { await mockDelay(500); return mockPayments[0]; }
    const { data } = await api.get<Payment>(`/payments/${paymentId}`);
    return data;
  },
};

// ─── Revenue (Provider) ───────────────────────────────────────────────────────
export const revenueService = {
  async getRevenueData(): Promise<RevenueData> {
    if (USE_MOCK) { await mockDelay(800); return mockRevenueData; }
    const { data } = await api.get<RevenueData>("/provider/revenue");
    return data;
  },
};

// ─── Provider Services CRUD ───────────────────────────────────────────────────
export const providerServicesService = {
  async getMyServices(): Promise<Service[]> {
    if (USE_MOCK) { await mockDelay(600); return mockProviders[0].services; }
    const { data } = await api.get<Service[]>("/provider/services");
    return data;
  },
  async createService(payload: Omit<Service, "id" | "providerId">): Promise<Service> {
    if (USE_MOCK) {
      await mockDelay(800);
      return { id: `svc_${Date.now()}`, providerId: "prov1", ...payload };
    }
    const { data } = await api.post<Service>("/provider/services", payload);
    return data;
  },
  async updateService(id: string, payload: Partial<Service>): Promise<Service> {
    if (USE_MOCK) {
      await mockDelay(700);
      const svc = mockProviders[0].services.find(s => s.id === id)!;
      return { ...svc, ...payload };
    }
    const { data } = await api.put<Service>(`/provider/services/${id}`, payload);
    return data;
  },
  async deleteService(id: string): Promise<void> {
    if (USE_MOCK) { await mockDelay(600); return; }
    await api.delete(`/provider/services/${id}`);
  },
};
