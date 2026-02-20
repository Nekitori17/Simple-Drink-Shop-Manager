<script setup lang="ts">
import { onMounted, h } from "vue";
import {
  NDataTable,
  NButton,
  NSpace,
  NIcon,
  useMessage,
  useDialog,
} from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { useAccountsStore } from "@/stores/accounts";
import type { Account } from "@/types";
import { Trash } from "@vicons/fa";

const message = useMessage();
const dialog = useDialog();
const store = useAccountsStore();

onMounted(() => store.fetchAll());

const columns: DataTableColumns<Account> = [
  { title: "ID", key: "id", width: 60 },
  { title: "Tên đăng nhập", key: "userName" },
  { title: "Tên khách hàng", key: "customerName" },
  { title: "SĐT", key: "customerPhone", width: 140 },
  {
    title: "Hành động",
    key: "actions",
    width: 100,
    render(row) {
      return h(
        NButton,
        {
          size: "small",
          quaternary: true,
          type: "error",
          onClick: () => confirmDelete(row),
        },
        { icon: () => h(NIcon, null, () => h(Trash)) },
      );
    },
  },
];

function confirmDelete(acc: Account) {
  dialog.warning({
    title: "Xác nhận xóa",
    content: `Bạn có chắc muốn xóa tài khoản "${acc.userName}"?`,
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await store.remove(acc.id);
        message.success("Đã xóa tài khoản");
      } catch (err: unknown) {
        message.error((err as Error).message);
      }
    },
  });
}
</script>

<template>
  <div class="page-content">
    <div class="page-header">
      <h2 class="page-title">Tài khoản</h2>
    </div>
    <NDataTable
      :columns="columns"
      :data="store.items"
      :loading="store.loading"
      :bordered="false"
      striped
    />
  </div>
</template>
