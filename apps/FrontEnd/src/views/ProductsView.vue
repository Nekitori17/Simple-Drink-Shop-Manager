<script setup lang="ts">
import { ref, onMounted, h, computed } from "vue";
import {
  NDataTable,
  NButton,
  NSpace,
  NIcon,
  NModal,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  useMessage,
  useDialog,
} from "naive-ui";
import type { DataTableColumns, SelectOption } from "naive-ui";
import { useProductsStore } from "@/stores/products";
import { useCategoriesStore } from "@/stores/categories";
import type { Product } from "@/types";
import { PencilAlt, Trash, Plus } from "@vicons/fa";

const message = useMessage();
const dialog = useDialog();
const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();

const showModal = ref(false);
const editingId = ref<number | null>(null);
const filterCategory = ref<number | undefined>(undefined);
const formValue = ref({
  name: "",
  price: 0,
  categoryId: null as number | null,
});

onMounted(async () => {
  await Promise.all([
    productsStore.fetchAll(50, 0),
    categoriesStore.fetchAll(),
  ]);
});

const categoryOptions = computed<SelectOption[]>(() =>
  categoriesStore.items.map((c) => ({ label: c.name, value: c.id })),
);

const filterOptions = computed<SelectOption[]>(() => [
  { label: "Tất cả", value: 0 },
  ...categoryOptions.value,
]);

function handleFilterChange(value: number) {
  filterCategory.value = value === 0 ? undefined : value;
  productsStore.fetchAll(50, 0, filterCategory.value);
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

const columns: DataTableColumns<Product> = [
  { title: "ID", key: "id", width: 60 },
  { title: "Tên sản phẩm", key: "name" },
  {
    title: "Giá",
    key: "price",
    width: 140,
    render(row) {
      return formatPrice(row.price);
    },
  },
  { title: "Danh mục", key: "categoryName", width: 160 },
  {
    title: "Hành động",
    key: "actions",
    width: 140,
    render(row) {
      return h(NSpace, { size: "small" }, () => [
        h(
          NButton,
          {
            size: "small",
            quaternary: true,
            type: "info",
            onClick: () => openEdit(row),
          },
          { icon: () => h(NIcon, null, () => h(PencilAlt)) },
        ),
        h(
          NButton,
          {
            size: "small",
            quaternary: true,
            type: "error",
            onClick: () => confirmDelete(row),
          },
          { icon: () => h(NIcon, null, () => h(Trash)) },
        ),
      ]);
    },
  },
];

function openCreate() {
  editingId.value = null;
  formValue.value = { name: "", price: 0, categoryId: null };
  showModal.value = true;
}

function openEdit(p: Product) {
  editingId.value = p.id;
  formValue.value = { name: p.name, price: p.price, categoryId: p.categoryId };
  showModal.value = true;
}

async function handleSubmit() {
  if (!formValue.value.name || !formValue.value.categoryId) {
    message.warning("Vui lòng điền đầy đủ thông tin");
    return;
  }
  try {
    const data = {
      name: formValue.value.name,
      price: formValue.value.price,
      categoryId: formValue.value.categoryId!,
    };
    if (editingId.value) {
      await productsStore.update(editingId.value, data);
      message.success("Cập nhật thành công");
    } else {
      await productsStore.create(data);
      message.success("Tạo sản phẩm thành công");
    }
    showModal.value = false;
    productsStore.fetchAll(50, 0, filterCategory.value);
  } catch (err: unknown) {
    message.error((err as Error).message);
  }
}

function confirmDelete(p: Product) {
  dialog.warning({
    title: "Xác nhận xóa",
    content: `Bạn có chắc muốn xóa sản phẩm "${p.name}"?`,
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await productsStore.remove(p.id);
        message.success("Đã xóa sản phẩm");
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
      <h2 class="page-title">Sản phẩm</h2>
      <NSpace>
        <NSelect
          :value="filterCategory ?? 0"
          :options="filterOptions"
          style="width: 180px"
          placeholder="Lọc danh mục"
          @update:value="handleFilterChange"
        />
        <NButton type="primary" @click="openCreate" style="border-radius: 8px">
          <template #icon
            ><NIcon><Plus /></NIcon
          ></template>
          Thêm sản phẩm
        </NButton>
      </NSpace>
    </div>

    <NDataTable
      :columns="columns"
      :data="productsStore.items"
      :loading="productsStore.loading"
      :bordered="false"
      striped
    />

    <NModal v-model:show="showModal">
      <NCard
        :title="editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm'"
        style="width: 460px; border-radius: 12px"
        :bordered="false"
      >
        <NForm @submit.prevent="handleSubmit">
          <NFormItem label="Tên sản phẩm">
            <NInput v-model:value="formValue.name" placeholder="Nhập tên" />
          </NFormItem>
          <NFormItem label="Giá (VND)">
            <NInputNumber
              v-model:value="formValue.price"
              :min="0"
              :step="1000"
              style="width: 100%"
              placeholder="Nhập giá"
            />
          </NFormItem>
          <NFormItem label="Danh mục">
            <NSelect
              v-model:value="formValue.categoryId"
              :options="categoryOptions"
              placeholder="Chọn danh mục"
            />
          </NFormItem>
          <NSpace justify="end">
            <NButton @click="showModal = false">Hủy</NButton>
            <NButton type="primary" attr-type="submit">
              {{ editingId ? "Cập nhật" : "Tạo mới" }}
            </NButton>
          </NSpace>
        </NForm>
      </NCard>
    </NModal>
  </div>
</template>
