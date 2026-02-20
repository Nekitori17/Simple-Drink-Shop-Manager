import { get, post, put, del } from "./client";
import type { Category } from "@/types";

export function getCategories(limit?: number, offset?: number) {
  const params = new URLSearchParams();
  if (limit !== undefined) params.set("limit", String(limit));
  if (offset !== undefined) params.set("offset", String(offset));
  const qs = params.toString();
  return get<Category[]>(`/categories${qs ? `?${qs}` : ""}`);
}

export function getCategoryById(id: number) {
  return get<Category>(`/categories/${id}`);
}

export function createCategory(name: string) {
  return post<Category>("/categories", { name });
}

export function updateCategory(id: number, name: string) {
  return put<Category>(`/categories/${id}`, { name });
}

export function deleteCategory(id: number) {
  return del<Category>(`/categories/${id}`);
}
