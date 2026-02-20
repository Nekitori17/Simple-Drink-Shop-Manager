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
  name: "",
  phone: "",
  address: "",
});

async function handleSignup() {
  const { userName, password, name, phone } = formValue.value;
  if (!userName || !password || !name || !phone) {
    message.warning("Vui lòng điền đầy đủ thông tin bắt buộc");
    return;
  }

  loading.value = true;
  try {
    await auth.signup({
      userName,
      password,
      name,
      phone,
      address: formValue.value.address || undefined,
    });
    message.success("Đăng ký thành công!");
    router.push("/dashboard");
  } catch (err: unknown) {
    message.error((err as Error).message || "Đăng ký thất bại");
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
      style="background: #2a2a2e; border-radius: 16px; max-width: 480px"
    >
      <h1 class="auth-title">🍹 Tạo tài khoản</h1>
      <p class="auth-subtitle">Đăng ký để đặt hàng</p>
      <NForm @submit.prevent="handleSignup">
        <NFormItem label="Tên đăng nhập *" path="userName">
          <NInput
            v-model:value="formValue.userName"
            placeholder="Nhập tên đăng nhập"
            size="large"
          />
        </NFormItem>
        <NFormItem label="Mật khẩu *" path="password">
          <NInput
            v-model:value="formValue.password"
            type="password"
            placeholder="Nhập mật khẩu"
            show-password-on="click"
            size="large"
          />
        </NFormItem>
        <NFormItem label="Họ tên *" path="name">
          <NInput
            v-model:value="formValue.name"
            placeholder="Nhập họ tên"
            size="large"
          />
        </NFormItem>
        <NFormItem label="Số điện thoại *" path="phone">
          <NInput
            v-model:value="formValue.phone"
            placeholder="Nhập số điện thoại"
            size="large"
          />
        </NFormItem>
        <NFormItem label="Địa chỉ" path="address">
          <NInput
            v-model:value="formValue.address"
            placeholder="Nhập địa chỉ (không bắt buộc)"
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
          Đăng ký
        </NButton>
      </NForm>
      <p class="auth-footer">
        Đã có tài khoản?
        <RouterLink to="/login" style="color: #63e2b7; text-decoration: none">
          Đăng nhập
        </RouterLink>
      </p>
    </NCard>
  </div>
</template>
