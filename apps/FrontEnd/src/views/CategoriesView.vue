<script setup lang="ts">
import { ref, onMounted, h } from "vue";
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
  useMessage,
  useDialog,
} from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { useCategoriesStore } from "@/stores/categories";
import type { Category } from "@/types";
import { PencilAlt, Trash, Plus } from "@vicons/fa";

const message = useMessage();
const dialog = useDialog();
const store = useCategoriesStore();

const showModal = ref(false);
const editingId = ref<number | null>(null);
const formValue = ref({ name: "" });

onMounted(() => store.fetchAll());

const columns: DataTableColumns<Category> = [
  { title: "ID", key: "id", width: 80 },
  { title: "Tên danh mục", key: "name" },
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
  formValue.value = { name: "" };
  showModal.value = true;
}

function openEdit(cat: Category) {
  editingId.value = cat.id;
  formValue.value = { name: cat.name };
  showModal.value = true;
}

async function handleSubmit() {
  if (!formValue.value.name) {
    message.warning("Vui lòng nhập tên danh mục");
    return;
  }
  try {
    if (editingId.value) {
      await store.update(editingId.value, formValue.value.name);
      message.success("Cập nhật thành công");
    } else {
      await store.create(formValue.value.name);
      message.success("Tạo danh mục thành công");
    }
    showModal.value = false;
  } catch (err: unknown) {
    message.error((err as Error).message);
  }
}

function confirmDelete(cat: Category) {
  dialog.warning({
    title: "Xác nhận xóa",
    content: `Bạn có chắc muốn xóa danh mục "${cat.name}"?`,
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await store.remove(cat.id);
        message.success("Đã xóa danh mục");
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
      <h2 class="page-title">Danh mục</h2>
      <NButton type="primary" @click="openCreate" style="border-radius: 8px">
        <template #icon
          ><NIcon><Plus /></NIcon
        ></template>
        Thêm danh mục
      </NButton>
    </div>

    <NDataTable
      :columns="columns"
      :data="store.items"
      :loading="store.loading"
      :bordered="false"
      striped
    />

    <NModal v-model:show="showModal">
      <NCard
        :title="editingId ? 'Sửa danh mục' : 'Thêm danh mục'"
        style="width: 400px; border-radius: 12px"
        :bordered="false"
      >
        <NForm @submit.prevent="handleSubmit">
          <NFormItem label="Tên danh mục">
            <NInput v-model:value="formValue.name" placeholder="Nhập tên" />
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
