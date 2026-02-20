<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
  NGrid,
  NGi,
  NCard,
  NButton,
  NIcon,
  NInput,
  NTabs,
  NTab,
  NText,
  NSpace,
  NBadge,
  NEmpty,
  NSpin,
} from "naive-ui";
import { Search, Plus, ShoppingCart, Coffee } from "@vicons/fa";
import { useProductsStore } from "@/stores/products";
import { useCategoriesStore } from "@/stores/categories";
import { useCartStore } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth";
import type { Product } from "@/types";

const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();
const cartStore = useCartStore();
const authStore = useAuthStore();

const searchQuery = ref("");
const activeCategory = ref<number | "all">("all");

onMounted(async () => {
  await Promise.all([
    categoriesStore.fetchAll(),
    productsStore.fetchAll(100, 0),
  ]);
});

const filteredProducts = computed(() => {
  return productsStore.items.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesCategory =
      activeCategory.value === "all" || p.categoryId === activeCategory.value;
    return matchesSearch && matchesCategory;
  });
});

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function handleAddToCart(product: Product) {
  cartStore.addToCart(product, 1);
}
</script>

<template>
  <div class="storefront-container">
    <!-- Header/Search Area -->
    <div class="store-header">
      <div class="welcome-text">
        <h1 class="store-title">🍹 Drink Menu</h1>
        <p class="store-subtitle">
          Chào mừng, {{ authStore.user?.name || authStore.user?.userName }}!
        </p>
      </div>
      <NInput
        v-model:value="searchQuery"
        placeholder="Tìm món ngon..."
        size="large"
        clearable
        style="max-width: 400px; border-radius: 12px"
      >
        <template #prefix>
          <NIcon><Search /></NIcon>
        </template>
      </NInput>
    </div>

    <!-- Category Tabs -->
    <div class="category-tabs">
      <NTabs
        v-model:value="activeCategory"
        type="segment"
        animated
        style="margin-bottom: 24px"
      >
        <NTab name="all">Tất cả</NTab>
        <NTab v-for="cat in categoriesStore.items" :key="cat.id" :name="cat.id">
          {{ cat.name }}
        </NTab>
      </NTabs>
    </div>

    <!-- Product Grid -->
    <NSpin :show="productsStore.loading">
      <NGrid
        v-if="filteredProducts.length > 0"
        responsive="screen"
        cols="1 s:2 m:3 l:4 xl:5"
        :x-gap="16"
        :y-gap="16"
      >
        <NGi v-for="product in filteredProducts" :key="product.id">
          <NCard hoverable class="product-card" :bordered="false">
            <template #cover>
              <div class="product-image-placeholder">
                <NIcon :size="48" color="#ffffff20">
                  <Coffee />
                </NIcon>
              </div>
            </template>

            <div class="product-info">
              <NText strong class="product-name">{{ product.name }}</NText>
              <NText depth="3" class="product-category">{{
                product.categoryName
              }}</NText>

              <NSpace
                justify="space-between"
                align="center"
                style="margin-top: 12px"
              >
                <NText class="product-price">{{
                  formatPrice(product.price)
                }}</NText>
                <NButton
                  circle
                  type="primary"
                  @click="handleAddToCart(product)"
                >
                  <template #icon>
                    <NIcon><Plus /></NIcon>
                  </template>
                </NButton>
              </NSpace>
            </div>
          </NCard>
        </NGi>
      </NGrid>

      <NEmpty
        v-else-if="!productsStore.loading"
        description="Không tìm thấy sản phẩm nào"
        style="margin-top: 60px"
      />
    </NSpin>
  </div>
</template>

<style scoped>
.store-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
  gap: 24px;
}

.store-title {
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #63e2b7 0%, #18a058 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.store-subtitle {
  color: #ffffff70;
  margin: 4px 0 0 0;
}

@media (max-width: 640px) {
  .store-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .store-header .n-input {
    max-width: 100%;
  }
}

.category-tabs :deep(.n-tabs-tab) {
  padding: 8px 24px;
}

.product-card {
  height: 100%;
  background: #2a2a2e;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.product-card:hover {
  transform: translateY(-8px);
}

.product-image-placeholder {
  height: 160px;
  background: linear-gradient(135deg, #1e1e22 0%, #2a2a2e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-info {
  padding: 16px;
}

.product-name {
  font-size: 16px;
  display: block;
  margin-bottom: 2px;
}

.product-category {
  font-size: 12px;
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: #63e2b7;
}

.n-button--circle {
  transition: transform 0.2s;
}

.n-button--circle:active {
  transform: scale(0.9);
}
</style>
