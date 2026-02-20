import { get, post, put, del } from "./client";
import type { Order, CreateOrderPayload } from "@/types";

export function getOrders(limit: number, offset: number) {
  return get<Order[]>(`/orders?limit=${limit}&offset=${offset}`);
}

export function getOrderById(id: number) {
  return get<Order>(`/orders/${id}`);
}

export function createOrder(payload: CreateOrderPayload) {
  return post<{ order: Order; items: Order["items"] }>("/orders", payload);
}

export function updateOrder(
  id: number,
  data: { status?: "pending" | "completed"; isDelivery?: boolean },
) {
  return put<Order>(`/orders/${id}`, data);
}

export function deleteOrder(id: number) {
  return del<Order>(`/orders/${id}`);
}
