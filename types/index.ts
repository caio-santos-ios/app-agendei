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
