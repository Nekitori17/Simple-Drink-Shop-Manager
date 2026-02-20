import { defineStore } from "pinia";
import { ref } from "vue";
import * as api from "@/api/categories";
import type { Category } from "@/types";

export const useCategoriesStore = defineStore("categories", () => {
  const items = ref<Category[]>([]);
  const loading = ref(false);

  async function fetchAll() {
    loading.value = true;
    try {
      const res = await api.getCategories();
      items.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  async function create(name: string) {
    const res = await api.createCategory(name);
    items.value.push(res.data);
    return res.data;
  }

  async function update(id: number, name: string) {
    const res = await api.updateCategory(id, name);
    const idx = items.value.findIndex((c) => c.id === id);
    if (idx !== -1) items.value[idx] = res.data;
    return res.data;
  }

  async function remove(id: number) {
    await api.deleteCategory(id);
    items.value = items.value.filter((c) => c.id !== id);
  }

  return { items, loading, fetchAll, create, update, remove };
});
