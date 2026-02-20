<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSpace,
  NDescriptions,
  NDescriptionsItem,
  NTag,
  useMessage,
} from "naive-ui";
import { useAuthStore } from "@/stores/auth";
import { useCustomersStore } from "@/stores/customers";

const message = useMessage();
const auth = useAuthStore();
const customersStore = useCustomersStore();

const editing = ref(false);
const loading = ref(false);
const formValue = ref({
  name: "",
  phone: "",
  address: "",
});

onMounted(async () => {
  await auth.fetchMe();
  if (auth.user && !auth.isAdmin && auth.user.customerId) {
    formValue.value = {
      name: auth.user.name || "",
      phone: auth.user.phone || "",
      address: auth.user.address || "",
    };
  }
});

async function handleSave() {
  if (!auth.user?.customerId) return;
  loading.value = true;
  try {
    await customersStore.update(auth.user.customerId, {
      name: formValue.value.name,
      phone: formValue.value.phone,
      address: formValue.value.address || undefined,
    });
    await auth.fetchMe();
    editing.value = false;
    message.success("Cập nhật thành công");
  } catch (err: unknown) {
    message.error((err as Error).message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="page-content">
    <div class="page-header">
      <h2 class="page-title">Hồ sơ</h2>
    </div>

    <NCard style="max-width: 600px; border-radius: 12px" :bordered="false">
      <!-- Admin view -->
      <template v-if="auth.isAdmin">
        <NDescriptions label-placement="left" :column="1" bordered>
          <NDescriptionsItem label="Tên đăng nhập">{{
            auth.user?.userName
          }}</NDescriptionsItem>
          <NDescriptionsItem label="Vai trò">
            <NTag type="success" round>Admin</NTag>
          </NDescriptionsItem>
        </NDescriptions>
      </template>

      <!-- Customer view -->
      <template v-else-if="!editing">
        <NDescriptions label-placement="left" :column="1" bordered>
          <NDescriptionsItem label="Tên đăng nhập">{{
            auth.user?.userName
          }}</NDescriptionsItem>
          <NDescriptionsItem label="Họ tên">{{
            auth.user?.name
          }}</NDescriptionsItem>
          <NDescriptionsItem label="Số điện thoại">{{
            auth.user?.phone
          }}</NDescriptionsItem>
          <NDescriptionsItem label="Địa chỉ">{{
            auth.user?.address || "—"
          }}</NDescriptionsItem>
          <NDescriptionsItem label="Vai trò">
            <NTag type="info" round>Khách hàng</NTag>
          </NDescriptionsItem>
        </NDescriptions>
        <NButton
          type="primary"
          style="margin-top: 16px; border-radius: 8px"
          @click="editing = true"
        >
          Chỉnh sửa
        </NButton>
      </template>

      <!-- Edit mode -->
      <template v-else>
        <NForm @submit.prevent="handleSave">
          <NFormItem label="Họ tên">
            <NInput v-model:value="formValue.name" placeholder="Nhập họ tên" />
          </NFormItem>
          <NFormItem label="Số điện thoại">
            <NInput v-model:value="formValue.phone" placeholder="Nhập SĐT" />
          </NFormItem>
          <NFormItem label="Địa chỉ">
            <NInput
              v-model:value="formValue.address"
              placeholder="Nhập địa chỉ"
            />
          </NFormItem>
          <NSpace>
            <NButton @click="editing = false">Hủy</NButton>
            <NButton type="primary" attr-type="submit" :loading="loading"
              >Lưu</NButton
            >
          </NSpace>
        </NForm>
      </template>
    </NCard>
  </div>
</template>
