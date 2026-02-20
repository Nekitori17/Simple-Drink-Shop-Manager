import { defineStore } from "pinia";
import { ref } from "vue";
import * as api from "@/api/products";
import type { Product } from "@/types";

export const useProductsStore = defineStore("products", () => {
  const items = ref<Product[]>([]);
  const loading = ref(false);

  async function fetchAll(limit = 50, offset = 0, categoryId?: number) {
    loading.value = true;
    try {
      const res = await api.getProducts(limit, offset, categoryId);
      items.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  async function create(data: {
    name: string;
    price: number;
    categoryId: number;
  }) {
    const res = await api.createProduct(data);
    items.value.push(res.data);
    return res.data;
  }

  async function update(
    id: number,
    data: { name: string; price: number; categoryId: number },
  ) {
    const res = await api.updateProduct(id, data);
    const idx = items.value.findIndex((p) => p.id === id);
    if (idx !== -1) items.value[idx] = res.data;
    return res.data;
  }

  async function remove(id: number) {
    await api.deleteProduct(id);
    items.value = items.value.filter((p) => p.id !== id);
  }

  return { items, loading, fetchAll, create, update, remove };
});
