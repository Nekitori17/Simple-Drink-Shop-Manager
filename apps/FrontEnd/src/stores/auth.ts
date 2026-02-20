import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { login as apiLogin, signup as apiSignup, getMe } from "@/api/auth";
import type { User, LoginPayload, SignupPayload } from "@/types";
import router from "@/router";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<User | null>(null);

  const isLoggedIn = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.isAdmin === true);

  async function login(payload: LoginPayload) {
    const res = await apiLogin(payload);
    token.value = res.data.token;
    user.value = res.data.user;
    localStorage.setItem("token", res.data.token);
  }

  async function signup(payload: SignupPayload) {
    const res = await apiSignup(payload);
    token.value = res.data.token;
    user.value = res.data.user;
    localStorage.setItem("token", res.data.token);
  }

  async function fetchMe() {
    try {
      const res = await getMe();
      user.value = res.data;
    } catch {
      logout();
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    router.push("/login");
  }

  return {
    token,
    user,
    isLoggedIn,
    isAdmin,
    login,
    signup,
    fetchMe,
    logout,
  };
});
