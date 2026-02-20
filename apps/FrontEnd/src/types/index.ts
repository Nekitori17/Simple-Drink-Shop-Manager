// ─── API Response ────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// ─── Auth ────────────────────────────────────────────────────
export interface LoginPayload {
  userName: string;
  password: string;
}

export interface SignupPayload {
  userName: string;
  password: string;
  name: string;
  phone: string;
  address?: string;
}

export interface User {
  id?: number;
  customerId?: number;
  userName: string;
  name?: string;
  phone?: string;
  address?: string | null;
  isAdmin: boolean;
}

export interface AuthData {
  token: string;
  user: User;
}

// ─── Category ────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
}

// ─── Product ─────────────────────────────────────────────────
export interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  categoryName?: string | null;
}

// ─── Order ───────────────────────────────────────────────────
export interface OrderItem {
  id: number;
  productId: number;
  productName?: string | null;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  customerId: number;
  customerName?: string | null;
  customerPhone?: string | null;
  customerAddress?: string | null;
  totalPrice: number | null;
  isDelivery: boolean | null;
  status: "pending" | "completed" | null;
  createdAt: string;
  items?: OrderItem[];
}

export interface CreateOrderPayload {
  items: { productId: number; quantity: number }[];
  isDelivery?: boolean;
}

// ─── Customer ────────────────────────────────────────────────
export interface Customer {
  id: number;
  name: string;
  phone: string;
  address?: string | null;
  createdAt: string;
}

// ─── Account ─────────────────────────────────────────────────
export interface Account {
  id: number;
  customerId: number;
  userName: string;
  customerName?: string | null;
  customerPhone?: string | null;
}
