import { defineStore } from "pinia";
import { ref } from "vue";
import * as api from "@/api/accounts";
import type { Account } from "@/types";

export const useAccountsStore = defineStore("accounts", () => {
  const items = ref<Account[]>([]);
  const loading = ref(false);

  async function fetchAll(limit?: number, offset?: number) {
    loading.value = true;
    try {
      const res = await api.getAccounts(limit, offset);
      items.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  async function remove(id: number) {
    await api.deleteAccount(id);
    items.value = items.value.filter((a) => a.id !== id);
  }

  return { items, loading, fetchAll, remove };
});
