import { get, put } from "./client";
import type { Customer } from "@/types";

export function getCustomers(limit?: number, offset?: number) {
  const params = new URLSearchParams();
  if (limit !== undefined) params.set("limit", String(limit));
  if (offset !== undefined) params.set("offset", String(offset));
  const qs = params.toString();
  return get<Customer[]>(`/customers${qs ? `?${qs}` : ""}`);
}

export function getCustomerById(id: number) {
  return get<Customer>(`/customers/${id}`);
}

export function updateCustomer(
  id: number,
  data: { name: string; phone: string; address?: string },
) {
  return put<Customer>(`/customers/${id}`, data);
}
