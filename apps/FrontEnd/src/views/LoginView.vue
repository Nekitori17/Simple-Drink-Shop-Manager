<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { NCard, NForm, NFormItem, NInput, NButton, useMessage } from "naive-ui";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const message = useMessage();
const auth = useAuthStore();

const loading = ref(false);
const formValue = ref({
  userName: "",
  password: "",
});

async function handleLogin() {
  if (!formValue.value.userName || !formValue.value.password) {
    message.warning("Vui lòng nhập tên đăng nhập và mật khẩu");
    return;
  }

  loading.value = true;
  try {
    await auth.login(formValue.value);
    message.success("Đăng nhập thành công!");
    router.push("/dashboard");
  } catch (err: unknown) {
    message.error((err as Error).message || "Đăng nhập thất bại");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-container">
    <NCard
      class="auth-card"
      :bordered="false"
      style="background: #2a2a2e; border-radius: 16px"
    >
      <h1 class="auth-title">🍹 Drink Shop</h1>
      <p class="auth-subtitle">Đăng nhập để quản lý cửa hàng</p>
      <NForm @submit.prevent="handleLogin">
        <NFormItem label="Tên đăng nhập" path="userName">
          <NInput
            v-model:value="formValue.userName"
            placeholder="Nhập tên đăng nhập"
            size="large"
          />
        </NFormItem>
        <NFormItem label="Mật khẩu" path="password">
          <NInput
            v-model:value="formValue.password"
            type="password"
            placeholder="Nhập mật khẩu"
            show-password-on="click"
            size="large"
          />
        </NFormItem>
        <NButton
          type="primary"
          block
          size="large"
          :loading="loading"
          attr-type="submit"
          style="margin-top: 8px; border-radius: 8px"
        >
          Đăng nhập
        </NButton>
      </NForm>
      <p class="auth-footer">
        Chưa có tài khoản?
        <RouterLink to="/signup" style="color: #63e2b7; text-decoration: none">
          Đăng ký ngay
        </RouterLink>
      </p>
    </NCard>
  </div>
</template>
