import { get, post } from "./client";
import type { AuthData, LoginPayload, SignupPayload, User } from "@/types";

export function login(payload: LoginPayload) {
  return post<AuthData>("/auth/login", payload);
}

export function signup(payload: SignupPayload) {
  return post<AuthData>("/auth/signup", payload);
}

export function getMe() {
  return get<User>("/auth/me");
}
