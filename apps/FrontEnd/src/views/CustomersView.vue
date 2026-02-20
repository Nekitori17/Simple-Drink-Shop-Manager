<script setup lang="ts">
import { onMounted, h } from "vue";
import { NDataTable, NText } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { useCustomersStore } from "@/stores/customers";
import type { Customer } from "@/types";

const store = useCustomersStore();

onMounted(() => store.fetchAll());

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

const columns: DataTableColumns<Customer> = [
  { title: "ID", key: "id", width: 60 },
  { title: "Họ tên", key: "name" },
  { title: "Số điện thoại", key: "phone", width: 140 },
  { title: "Địa chỉ", key: "address", ellipsis: { tooltip: true } },
  {
    title: "Ngày tạo",
    key: "createdAt",
    width: 130,
    render(row) {
      return formatDate(row.createdAt);
    },
  },
];
</script>

<template>
  <div class="page-content">
    <div class="page-header">
      <h2 class="page-title">Khách hàng</h2>
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
