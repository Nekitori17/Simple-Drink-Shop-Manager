import type { ApiResponse } from "@/types";

const BASE_URL = import.meta.env.BASE_URL || "";

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${BASE_URL}/api${endpoint}`.replace(/\/+/g, "/");
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function get<T>(endpoint: string): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>(endpoint);
}

export function post<T>(
  endpoint: string,
  body: unknown,
): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function put<T>(
  endpoint: string,
  body: unknown,
): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>(endpoint, {
    method: "DELETE",
  });
}
