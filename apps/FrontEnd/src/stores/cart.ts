import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type { Product } from "@/types";

export interface CartItem extends Product {
  quantity: number;
}

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([]);

  // Load from localStorage
  const savedCart = localStorage.getItem("shopping-cart");
  if (savedCart) {
    try {
      items.value = JSON.parse(savedCart);
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }

  // Persist to localStorage
  watch(
    items,
    (newItems) => {
      localStorage.setItem("shopping-cart", JSON.stringify(newItems));
    },
    { deep: true },
  );

  const itemCount = computed(() =>
    items.value.reduce((acc, item) => acc + item.quantity, 0),
  );
  const totalAmount = computed(() =>
    items.value.reduce((acc, item) => acc + item.price * item.quantity, 0),
  );

  function addToCart(product: Product, quantity: number = 1) {
    const existingItem = items.value.find((i) => i.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.value.push({ ...product, quantity });
    }
  }

  function removeFromCart(productId: number) {
    const index = items.value.findIndex((i) => i.id === productId);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find((i) => i.id === productId);
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  function clearCart() {
    items.value = [];
  }

  return {
    items,
    itemCount,
    totalAmount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
});
