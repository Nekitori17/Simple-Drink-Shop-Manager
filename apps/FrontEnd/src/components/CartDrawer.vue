<script setup lang="ts">
import { computed, ref } from "vue";
import {
  NDrawer,
  NDrawerContent,
  NList,
  NListItem,
  NThing,
  NButton,
  NIcon,
  NInputNumber,
  NSpace,
  NText,
  NEmpty,
  useMessage,
} from "naive-ui";
import { Trash, ShoppingCart, ArrowRight } from "@vicons/fa";
import { useCartStore } from "@/stores/cart";
import { useOrdersStore } from "@/stores/orders";

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits(["update:show"]);

const message = useMessage();
const cart = useCartStore();
const ordersStore = useOrdersStore();
const loading = ref(false);

const showDrawer = computed({
  get: () => props.show,
  set: (val) => emit("update:show", val),
});

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

async function handleCheckout() {
  if (cart.items.length === 0) return;

  loading.value = true;
  try {
    const items = cart.items.map((i) => ({
      productId: i.id,
      quantity: i.quantity,
    }));

    await ordersStore.create({ items, isDelivery: false });
    message.success("Đặt hàng thành công!");
    cart.clearCart();
    showDrawer.value = false;
  } catch (err: unknown) {
    message.error((err as Error).message || "Đặt hàng thất bại");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <NDrawer v-model:show="showDrawer" :width="400" placement="right">
    <NDrawerContent title="Giỏ hàng của bạn" closable>
      <div v-if="cart.items.length > 0">
        <NList hoverable clickable>
          <NListItem v-for="item in cart.items" :key="item.id">
            <template #suffix>
              <NButton
                quaternary
                circle
                type="error"
                @click="cart.removeFromCart(item.id)"
              >
                <template #icon
                  ><NIcon><Trash /></NIcon
                ></template>
              </NButton>
            </template>
            <NThing :title="item.name">
              <template #description>
                <NText depth="3">{{ formatPrice(item.price) }}</NText>
              </template>
              <NSpace align="center" style="margin-top: 8px">
                <NInputNumber
                  v-model:value="item.quantity"
                  size="small"
                  :min="1"
                  style="width: 100px"
                  @update:value="(v) => cart.updateQuantity(item.id, v || 1)"
                />
                <NText strong>{{
                  formatPrice(item.price * item.quantity)
                }}</NText>
              </NSpace>
            </NThing>
          </NListItem>
        </NList>
      </div>

      <NEmpty v-else description="Giỏ hàng trống" style="margin-top: 100px">
        <template #icon>
          <NIcon><ShoppingCart /></NIcon>
        </template>
        <template #extra>
          <NButton @click="showDrawer = false">Tiếp tục mua sắm</NButton>
        </template>
      </NEmpty>

      <template #footer v-if="cart.items.length > 0">
        <div style="width: 100%">
          <NSpace
            justify="space-between"
            align="center"
            style="margin-bottom: 16px"
          >
            <NText depth="3">Tổng cộng:</NText>
            <NText strong style="font-size: 20px; color: #63e2b7">
              {{ formatPrice(cart.totalAmount) }}
            </NText>
          </NSpace>
          <NButton
            type="primary"
            block
            size="large"
            :loading="loading"
            @click="handleCheckout"
            style="border-radius: 8px"
          >
            <template #icon
              ><NIcon><ArrowRight /></NIcon
            ></template>
            Đặt hàng ngay
          </NButton>
        </div>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
