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
  appointmentAt: Date;
  business?: Business;
  businessId: string;
  createdAt: Date;
  fullName: string;
  id: string;
  payment?: null | Payment;
  phone: string;
  services?: Service[];
  updatedAt: Date;
  user?: User;
  userId: string;
}

export interface Business {
  address: string;
  appointments?: Appointment[];
  BusinessManager?: BusinessManager[];
  createdAt: Date;
  description?: null | string;
  district: string;
  id: string;
  name: string;
  phone: string;
  services?: Service[];
  type: BusinessType;
  updatedAt: Date;
}

export interface BusinessManager {
  business?: Business;
  businessId: string;
  createdAt: Date;
  id: string;
  updatedAt: Date;
  user?: User;
  userId: string;
}

export interface Pagination<T> {
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
  createdAt: Date;
  id: string;
  meta: unknown;
  status: PaymentStatus;
  updatedAt: Date;
}

export interface Profile {
  avatar?: null | string;
  bio?: null | string;
  createdAt: Date;
  displayName: string;
  id: string;
  updatedAt: Date;
  user?: User;
  userId: string;
}

export interface Service {
  appointments?: Appointment[];
  business?: Business;
  businessId: string;
  createdAt: Date;
  id: string;
  name: string;
  price: number;
  updatedAt: Date;
}

export interface Token {
  createdAt: Date;
  expiresAt: Date;
  id: string;
  token: string;
  updatedAt: Date;
  user?: User;
  userId: string;
}

export interface User {
  appointments?: Appointment[];
  businesses?: BusinessManager[];
  createdAt: Date;
  email: string;
  id: string;
  password: string;
  phone?: null | string;
  profile?: null | Profile;
  roles: UserRole[];
  tokens?: Token[];
  updatedAt: Date;
}
