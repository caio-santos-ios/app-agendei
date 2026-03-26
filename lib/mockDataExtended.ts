// lib/mockDataExtended.ts
import {
  Review, SpendingRecord, SpendingSummary, Favorite,
  ChatMessage, Conversation, Notification, Payment,
  RevenueData, User, Service,
} from "@/types";
import { mockUsers, mockProviders, mockAppointments, mockDelay } from "./mockData";

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const mockReviews: Review[] = [
  {
    id: "rev1", appointmentId: "apt3", clientId: "client1",
    providerId: "prov3", rating: 5,
    comment: "Atendimento impecável! As unhas ficaram perfeitas, super cuidadosa e caprichosa.",
    client: mockUsers["client1"], service: mockProviders[2].services[1],
    createdAt: "2025-07-20T17:00:00Z",
  },
  {
    id: "rev2", appointmentId: "aptX", clientId: "client2",
    providerId: "prov1", rating: 5,
    comment: "Melhor barbearia da cidade! Carlos é craque, saí com o cabelo show.",
    client: { ...mockUsers["client1"], id: "client2", name: "Pedro Costa", email: "pedro@email.com", phone: "(73) 98888-0001" },
    createdAt: "2025-07-22T11:00:00Z",
  },
  {
    id: "rev3", appointmentId: "aptY", clientId: "client3",
    providerId: "prov1", rating: 4,
    comment: "Muito bom, só fiquei esperando uns 10 minutos além do horário.",
    client: { ...mockUsers["client1"], id: "client3", name: "Lucas Mendes", email: "lucas@email.com", phone: "(73) 97777-0001" },
    createdAt: "2025-07-19T14:00:00Z",
  },
];

// ─── Spending ─────────────────────────────────────────────────────────────────
export const mockSpendingRecords: SpendingRecord[] = [
  { id: "sp1", appointmentId: "apt3", amount: 55, date: "2025-07-20", service: mockProviders[2].services[1], provider: mockProviders[2], paymentMethod: "pix" },
  { id: "sp2", appointmentId: "aptX1", amount: 55, date: "2025-06-15", service: mockProviders[0].services[1], provider: mockProviders[0], paymentMethod: "credit_card" },
  { id: "sp3", appointmentId: "aptX2", amount: 120, date: "2025-06-05", service: mockProviders[1].services[2], provider: mockProviders[1], paymentMethod: "pix" },
  { id: "sp4", appointmentId: "aptX3", amount: 35, date: "2025-05-28", service: mockProviders[0].services[0], provider: mockProviders[0], paymentMethod: "cash" },
  { id: "sp5", appointmentId: "aptX4", amount: 55, date: "2025-05-10", service: mockProviders[2].services[1], provider: mockProviders[2], paymentMethod: "debit_card" },
  { id: "sp6", appointmentId: "aptX5", amount: 40, date: "2025-04-20", service: mockProviders[0].services[2], provider: mockProviders[0], paymentMethod: "pix" },
  { id: "sp7", appointmentId: "aptX6", amount: 60, date: "2025-03-14", service: mockProviders[1].services[0], provider: mockProviders[1], paymentMethod: "credit_card" },
];

export const mockSpendingSummary: SpendingSummary = {
  totalThisMonth: 55,
  totalThisYear: 420,
  totalAllTime: 420,
  byCategory: [
    { category: "barber", total: 130, count: 3 },
    { category: "hairdresser", total: 180, count: 2 },
    { category: "manicure", total: 110, count: 2 },
  ],
  byMonth: [
    { month: "Mar", total: 60 },
    { month: "Abr", total: 40 },
    { month: "Mai", total: 95 },
    { month: "Jun", total: 175 },
    { month: "Jul", total: 55 },
  ],
};

// ─── Favorites ────────────────────────────────────────────────────────────────
export const mockFavorites: Favorite[] = [
  { id: "fav1", clientId: "client1", providerId: "prov1", provider: mockProviders[0], createdAt: "2025-06-01T10:00:00Z" },
  { id: "fav2", clientId: "client1", providerId: "prov2", provider: mockProviders[1], createdAt: "2025-06-10T10:00:00Z" },
];

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const mockConversations: Conversation[] = [
  {
    id: "conv1", clientId: "client1", providerId: "prov1",
    client: mockUsers["client1"], provider: mockProviders[0],
    lastMessage: {
      id: "msg_last1", conversationId: "conv1", senderId: "provider1",
      senderRole: "provider", content: "Às 10h então, te aguardo! ✂️",
      type: "text", read: false, createdAt: "2025-07-26T14:32:00Z",
    },
    unreadCount: 2, updatedAt: "2025-07-26T14:32:00Z",
  },
  {
    id: "conv2", clientId: "client1", providerId: "prov2",
    client: mockUsers["client1"], provider: mockProviders[1],
    lastMessage: {
      id: "msg_last2", conversationId: "conv2", senderId: "client1",
      senderRole: "client", content: "Obrigada! Ficou lindo 😍",
      type: "text", read: true, createdAt: "2025-07-20T18:00:00Z",
    },
    unreadCount: 0, updatedAt: "2025-07-20T18:00:00Z",
  },
];

export const mockMessages: Record<string, ChatMessage[]> = {
  conv1: [
    { id: "m1", conversationId: "conv1", senderId: "client1", senderRole: "client", content: "Oi Carlos, tudo bem? Quero marcar um corte", type: "text", read: true, createdAt: "2025-07-26T14:00:00Z" },
    { id: "m2", conversationId: "conv1", senderId: "provider1", senderRole: "provider", content: "Oi! Tudo sim! Que dia fica melhor pra você?", type: "text", read: true, createdAt: "2025-07-26T14:05:00Z" },
    { id: "m3", conversationId: "conv1", senderId: "client1", senderRole: "client", content: "Segunda de manhã, tem horário?", type: "text", read: true, createdAt: "2025-07-26T14:20:00Z" },
    { id: "m4", conversationId: "conv1", senderId: "provider1", senderRole: "provider", content: "Tenho às 9h ou 10h, qual prefere?", type: "text", read: true, createdAt: "2025-07-26T14:25:00Z" },
    { id: "m5", conversationId: "conv1", senderId: "client1", senderRole: "client", content: "10h perfeito!", type: "text", read: true, createdAt: "2025-07-26T14:30:00Z" },
    { id: "m6", conversationId: "conv1", senderId: "provider1", senderRole: "provider", content: "Às 10h então, te aguardo! ✂️", type: "text", read: false, createdAt: "2025-07-26T14:32:00Z" },
  ],
  conv2: [
    { id: "m7", conversationId: "conv2", senderId: "provider2", senderRole: "provider", content: "Olá! Seu agendamento para coloração está confirmado para amanhã às 14h 💇‍♀️", type: "text", read: true, createdAt: "2025-07-19T09:00:00Z" },
    { id: "m8", conversationId: "conv2", senderId: "client1", senderRole: "client", content: "Ótimo! Obrigada pela confirmação", type: "text", read: true, createdAt: "2025-07-19T09:10:00Z" },
    { id: "m9", conversationId: "conv2", senderId: "provider2", senderRole: "provider", content: "Ficou maravilhosa a coloração! Obrigada pela visita 🌟", type: "text", read: true, createdAt: "2025-07-20T17:00:00Z" },
    { id: "m10", conversationId: "conv2", senderId: "client1", senderRole: "client", content: "Obrigada! Ficou lindo 😍", type: "text", read: true, createdAt: "2025-07-20T18:00:00Z" },
  ],
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  { id: "n1", userId: "client1", type: "appointment_confirmed", title: "Agendamento confirmado! ✅", body: "Barbearia do Carlos confirmou seu corte para amanhã às 10h.", read: false, data: { appointmentId: "apt1" }, createdAt: "2025-07-26T09:00:00Z" },
  { id: "n2", userId: "client1", type: "appointment_reminder", title: "Lembrete de amanhã 📅", body: "Você tem Coloração com Studio Ana Lima às 14h.", read: false, data: { appointmentId: "apt2" }, createdAt: "2025-07-29T08:00:00Z" },
  { id: "n3", userId: "client1", type: "new_message", title: "Nova mensagem de Carlos 💬", body: "Às 10h então, te aguardo! ✂️", read: false, data: { conversationId: "conv1" }, createdAt: "2025-07-26T14:32:00Z" },
  { id: "n4", userId: "client1", type: "appointment_confirmed", title: "Agendamento concluído 🎉", body: "Seu atendimento na Espaço Bella Nails foi concluído.", read: true, data: { appointmentId: "apt3" }, createdAt: "2025-07-20T16:00:00Z" },
];

// ─── Payments ─────────────────────────────────────────────────────────────────
export const mockPayments: Payment[] = [
  {
    id: "pay1", appointmentId: "apt1", amount: 55, method: "pix",
    status: "pending",
    pixCode: "00020126580014BR.GOV.BCB.PIX0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540555.005802BR5913Barbearia Carlos6006Ilheus62070503***6304A1B2",
    pixQrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    createdAt: "2025-07-26T10:00:00Z",
  },
];

// ─── Revenue (Provider) ───────────────────────────────────────────────────────
export const mockRevenueData: RevenueData = {
  totalMonth: 1240,
  totalWeek: 310,
  totalToday: 85,
  byMonth: [
    { month: "Fev", revenue: 980, appointments: 28 },
    { month: "Mar", revenue: 1100, appointments: 32 },
    { month: "Abr", revenue: 890, appointments: 25 },
    { month: "Mai", revenue: 1350, appointments: 38 },
    { month: "Jun", revenue: 1180, appointments: 34 },
    { month: "Jul", revenue: 1240, appointments: 36 },
  ],
  byService: [
    { serviceId: "s2", name: "Corte + Barba", revenue: 550, count: 10 },
    { serviceId: "s3", name: "Degradê", revenue: 360, count: 9 },
    { serviceId: "s1", name: "Corte Social", revenue: 245, count: 7 },
    { serviceId: "s4", name: "Barba Completa", revenue: 150, count: 5 },
  ],
  topClients: [
    { client: { ...mockUsers["client1"], name: "João Silva" }, totalSpent: 275, visits: 5 },
    { client: { ...mockUsers["client1"], id: "c2", name: "Pedro Costa", email: "pedro@email.com", phone: "" }, totalSpent: 220, visits: 4 },
    { client: { ...mockUsers["client1"], id: "c3", name: "Lucas Mendes", email: "lucas@email.com", phone: "" }, totalSpent: 165, visits: 3 },
  ],
};
