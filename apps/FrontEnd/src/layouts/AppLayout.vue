<script setup lang="ts">
import { ref, computed, h } from "vue";
import { useRouter, useRoute, RouterView } from "vue-router";
import {
  NLayout,
  NLayoutSider,
  NLayoutContent,
  NLayoutHeader,
  NMenu,
  NButton,
  NIcon,
  NSpace,
  NText,
  NAvatar,
  NBadge,
} from "naive-ui";
import type { MenuOption } from "naive-ui";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import CartDrawer from "@/components/CartDrawer.vue";
import {
  Home,
  Tags,
  Coffee,
  ShoppingCart,
  Users,
  UserShield,
  User,
  SignOutAlt,
} from "@vicons/fa";
import type { Component } from "vue";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const cart = useCartStore();

const showCart = ref(false);

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = computed<MenuOption[]>(() => {
  const items: MenuOption[] = [
    { label: "Trang chủ", key: "/dashboard", icon: renderIcon(Home) },
  ];

  if (auth.isAdmin) {
    items.push(
      { label: "Danh mục", key: "/categories", icon: renderIcon(Tags) },
      { label: "Sản phẩm", key: "/products", icon: renderIcon(Coffee) },
      { label: "Khách hàng", key: "/customers", icon: renderIcon(Users) },
      { label: "Tài khoản", key: "/accounts", icon: renderIcon(UserShield) },
    );
  }

  items.push(
    { label: "Đơn hàng", key: "/orders", icon: renderIcon(ShoppingCart) },
    { label: "Hồ sơ", key: "/profile", icon: renderIcon(User) },
  );

  return items;
});

const activeKey = computed(() => route.path);

function handleMenuUpdate(key: string) {
  router.push(key);
}

function handleLogout() {
  auth.logout();
}
</script>

<template>
  <NLayout has-sider style="height: 100vh">
    <NLayoutSider
      bordered
      :width="240"
      :collapsed-width="64"
      collapse-mode="width"
      show-trigger
      :native-scrollbar="false"
      style="background: #1e1e22"
    >
      <div style="padding: 20px 16px; text-align: center">
        <h2
          style="
            font-size: 18px;
            font-weight: 700;
            background: linear-gradient(135deg, #63e2b7 0%, #18a058 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          "
        >
          🍹 Drink Shop
        </h2>
      </div>
      <NMenu
        :value="activeKey"
        :options="menuOptions"
        :indent="20"
        @update:value="handleMenuUpdate"
      />
    </NLayoutSider>
    <NLayout style="height: 100vh">
      <NLayoutHeader
        bordered
        style="
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 24px;
          background: #1e1e22;
        "
      >
        <NSpace align="center" :size="20">
          <NButton
            v-if="!auth.isAdmin"
            quaternary
            circle
            @click="showCart = true"
          >
            <template #icon>
              <NBadge :value="cart.itemCount" :show="cart.itemCount > 0">
                <NIcon><ShoppingCart /></NIcon>
              </NBadge>
            </template>
          </NButton>

          <NSpace align="center" :size="12">
            <NAvatar
              round
              :size="32"
              style="
                background: linear-gradient(135deg, #63e2b7 0%, #18a058 100%);
              "
            >
              {{ auth.user?.userName?.charAt(0).toUpperCase() || "?" }}
            </NAvatar>
            <NText style="color: #ffffffd1; font-weight: 500">
              {{ auth.user?.userName || "" }}
            </NText>
            <NButton quaternary circle size="small" @click="handleLogout">
              <template #icon>
                <NIcon><SignOutAlt /></NIcon>
              </template>
            </NButton>
          </NSpace>
        </NSpace>
      </NLayoutHeader>
      <NLayoutContent
        :native-scrollbar="false"
        content-style="padding: 24px; min-height: calc(100vh - 56px)"
        style="background: #18181c"
      >
        <RouterView />
      </NLayoutContent>
    </NLayout>
    <CartDrawer v-model:show="showCart" />
  </NLayout>
</template>
