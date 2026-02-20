import { get, post, put, del } from "./client";
import type { Product } from "@/types";

export function getProducts(
  limit: number,
  offset: number,
  categoryId?: number,
) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (categoryId !== undefined) params.set("categoryId", String(categoryId));
  return get<Product[]>(`/products?${params.toString()}`);
}

export function getProductById(id: number) {
  return get<Product>(`/products/${id}`);
}

export function createProduct(data: {
  name: string;
  price: number;
  categoryId: number;
}) {
  return post<Product>("/products", data);
}

export function updateProduct(
  id: number,
  data: { name: string; price: number; categoryId: number },
) {
  return put<Product>(`/products/${id}`, data);
}

export function deleteProduct(id: number) {
  return del<Product>(`/products/${id}`);
}
