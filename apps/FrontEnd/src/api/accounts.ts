import { get, del } from "./client";
import type { Account } from "@/types";

export function getAccounts(limit?: number, offset?: number) {
  const params = new URLSearchParams();
  if (limit !== undefined) params.set("limit", String(limit));
  if (offset !== undefined) params.set("offset", String(offset));
  const qs = params.toString();
  return get<Account[]>(`/accounts${qs ? `?${qs}` : ""}`);
}

export function deleteAccount(id: number) {
  return del<Account>(`/accounts/${id}`);
}
