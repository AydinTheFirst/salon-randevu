export enum BusinessType {
  BARBER = "BARBER",
  SALON = "SALON"
}

export enum PaymentStatus {
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  PENDING = "PENDING"
}

export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  USER = "USER"
}

export interface Appointment {
  address: string;
  business?: Business;
  businessId: string;
  createdAt: string;
  date: string;
  fullName: string;
  id: string;
  payment?: null | Payment;
  phone: string;
  services?: Service[];
  updatedAt: string;
  user?: User;
  userId: string;
}

export interface Business {
  address: string;
  appointments?: Appointment[];
  BusinessManager?: BusinessManager[];
  city: string;
  createdAt: string;
  description?: null | string;
  district: string;
  id: string;
  name: string;
  phone: string;
  services?: Service[];
  type: BusinessType;
  updatedAt: string;
}

export interface BusinessManager {
  business?: Business;
  businessId: string;
  createdAt: string;
  id: string;
  updatedAt: string;
  user?: User;
  userId: string;
}

export interface Paginated<T> {
  items: T[];
  meta: {
    page: number;
    pageCount: number;
    total: number;
  };
}

export interface Payment {
  appointment?: Appointment;
  appointmentId: string;
  cardHolder: string;
  cardLast4: string;
  createdAt: string;
  id: string;
  meta: unknown;
  status: PaymentStatus;
  updatedAt: string;
}

export interface Profile {
  avatar?: null | string;
  bio?: null | string;
  createdAt: string;
  displayName: string;
  id: string;
  updatedAt: string;
  user?: User;
  userId: string;
}

export interface Service {
  appointments?: Appointment[];
  business?: Business;
  businessId: string;
  createdAt: string;
  duration: number; // in minutes
  id: string;
  name: string;
  price: number;
  updatedAt: string;
}

export interface Token {
  createdAt: string;
  expiresAt: string;
  id: string;
  token: string;
  updatedAt: string;
  user?: User;
  userId: string;
}

export interface User {
  appointments?: Appointment[];
  businesses?: BusinessManager[];
  createdAt: string;
  email: string;
  id: string;
  password: string;
  phone?: null | string;
  profile?: null | Profile;
  roles: UserRole[];
  tokens?: Token[];
  updatedAt: string;
}
