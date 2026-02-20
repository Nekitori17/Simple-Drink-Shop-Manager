import { defineStore } from "pinia";
import { ref } from "vue";
import * as api from "@/api/orders";
import type { Order, CreateOrderPayload } from "@/types";

export const useOrdersStore = defineStore("orders", () => {
  const items = ref<Order[]>([]);
  const loading = ref(false);
  const currentOrder = ref<Order | null>(null);

  async function fetchAll(limit = 50, offset = 0) {
    loading.value = true;
    try {
      const res = await api.getOrders(limit, offset);
      items.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchById(id: number) {
    const res = await api.getOrderById(id);
    currentOrder.value = res.data;
    return res.data;
  }

  async function create(payload: CreateOrderPayload) {
    const res = await api.createOrder(payload);
    return res.data;
  }

  async function update(
    id: number,
    data: { status?: "pending" | "completed"; isDelivery?: boolean },
  ) {
    const res = await api.updateOrder(id, data);
    const idx = items.value.findIndex((o) => o.id === id);
    if (idx !== -1) {
      items.value[idx] = { ...items.value[idx], ...res.data };
    }
    return res.data;
  }

  async function remove(id: number) {
    await api.deleteOrder(id);
    items.value = items.value.filter((o) => o.id !== id);
  }

  return {
    items,
    loading,
    currentOrder,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
  };
});
