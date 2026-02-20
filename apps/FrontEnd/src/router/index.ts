import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
      meta: { guest: true },
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("@/views/SignupView.vue"),
      meta: { guest: true },
    },
    {
      path: "/",
      component: () => import("@/layouts/AppLayout.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          redirect: "/dashboard",
        },
        {
          path: "dashboard",
          name: "dashboard",
          component: () => import("@/views/DashboardView.vue"),
        },
        {
          path: "categories",
          name: "categories",
          component: () => import("@/views/CategoriesView.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "products",
          name: "products",
          component: () => import("@/views/ProductsView.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "orders",
          name: "orders",
          component: () => import("@/views/OrdersView.vue"),
        },
        {
          path: "customers",
          name: "customers",
          component: () => import("@/views/CustomersView.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "accounts",
          name: "accounts",
          component: () => import("@/views/AccountsView.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "profile",
          name: "profile",
          component: () => import("@/views/ProfileView.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/dashboard",
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore();

  // If token exists but user data not loaded yet, fetch user info
  if (auth.isLoggedIn && !auth.user) {
    try {
      await auth.fetchMe();
    } catch {
      auth.logout();
      return next("/login");
    }
  }

  // Guest-only routes (login, signup)
  if (to.meta.guest && auth.isLoggedIn) {
    return next("/dashboard");
  }

  // Auth-required routes
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next("/login");
  }

  // Admin-required routes
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return next("/dashboard");
  }

  next();
});

export default router;
