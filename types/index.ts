// User Types
export type UserRole = "client" | "provider";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

// Service Types
export type ServiceCategory =
  | "barber"
  | "hairdresser"
  | "manicure"
  | "pedicure"
  | "makeup"
  | "massage"
  | "aesthetics"
  | "other";

export interface ServiceCategoryInfo {
  id: ServiceCategory;
  label: string;
  icon: string;
  description: string;
  color: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  category: ServiceCategory;
  providerId: string;
}

// Provider Types
export interface Provider {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  category: ServiceCategory;
  rating: number;
  reviewCount: number;
  address: string;
  distance?: number; // km
  services: Service[];
  bio: string;
  workingHours: WorkingHours;
  isAvailableNow: boolean;
}

export interface WorkingHours {
  [day: string]: { open: string; close: string; closed: boolean };
}

// Appointment Types
export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Appointment {
  id: string;
  clientId: string;
  providerId: string;
  serviceId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  service: Service;
  provider?: Provider;
  client?: User;
  notes?: string;
  createdAt: string;
}

export interface CreateAppointmentPayload {
  providerId: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
}

// API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Review Types
export interface Review {
  id: string;
  appointmentId: string;
  clientId: string;
  providerId: string;
  rating: number;
  comment: string;
  client?: User;
  service?: Service;
  createdAt: string;
}
export interface CreateReviewPayload {
  appointmentId: string;
  providerId: string;
  rating: number;
  comment: string;
}

// Spending
export type PaymentMethod = "pix" | "credit_card" | "debit_card" | "cash";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface SpendingRecord {
  id: string;
  appointmentId: string;
  amount: number;
  date: string;
  service: Service;
  provider: Provider;
  paymentMethod: PaymentMethod;
}
export interface SpendingSummary {
  totalThisMonth: number;
  totalThisYear: number;
  totalAllTime: number;
  byCategory: { category: ServiceCategory; total: number; count: number }[];
  byMonth: { month: string; total: number }[];
}

// Favorites
export interface Favorite {
  id: string;
  clientId: string;
  providerId: string;
  provider: Provider;
  createdAt: string;
}

// Chat
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: UserRole;
  content: string;
  type: "text" | "image" | "appointment";
  read: boolean;
  createdAt: string;
}
export interface Conversation {
  id: string;
  clientId: string;
  providerId: string;
  client?: User;
  provider?: Provider;
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string;
}

// Notifications
export type NotificationType =
  | "appointment_confirmed"
  | "appointment_cancelled"
  | "appointment_reminder"
  | "new_message"
  | "new_review"
  | "payment_received";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  data?: Record<string, string>;
  createdAt: string;
}

// Payment
export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  pixCode?: string;
  pixQrCode?: string;
  createdAt: string;
}
export interface CreatePaymentPayload {
  appointmentId: string;
  method: PaymentMethod;
  cardToken?: string;
}

// Revenue
export interface RevenueData {
  totalMonth: number;
  totalWeek: number;
  totalToday: number;
  byMonth: { month: string; revenue: number; appointments: number }[];
  byService: { serviceId: string; name: string; revenue: number; count: number }[];
  topClients: { client: User; totalSpent: number; visits: number }[];
}

// Schedule
export interface ScheduleSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
  appointment?: Appointment;
}
