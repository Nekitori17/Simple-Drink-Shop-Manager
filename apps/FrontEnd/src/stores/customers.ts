import { defineStore } from "pinia";
import { ref } from "vue";
import * as api from "@/api/customers";
import type { Customer } from "@/types";

export const useCustomersStore = defineStore("customers", () => {
  const items = ref<Customer[]>([]);
  const loading = ref(false);

  async function fetchAll(limit?: number, offset?: number) {
    loading.value = true;
    try {
      const res = await api.getCustomers(limit, offset);
      items.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchById(id: number) {
    const res = await api.getCustomerById(id);
    return res.data;
  }

  async function update(
    id: number,
    data: { name: string; phone: string; address?: string },
  ) {
    const res = await api.updateCustomer(id, data);
    const idx = items.value.findIndex((c) => c.id === id);
    if (idx !== -1) items.value[idx] = res.data;
    return res.data;
  }

  return { items, loading, fetchAll, fetchById, update };
});
