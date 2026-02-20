<script setup lang="ts">
import { ref, onMounted, h, computed } from "vue";
import {
  NDataTable,
  NButton,
  NSpace,
  NIcon,
  NModal,
  NCard,
  NTag,
  NText,
  useMessage,
  useDialog,
} from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { useOrdersStore } from "@/stores/orders";
import { useAuthStore } from "@/stores/auth";
import type { Order } from "@/types";
import { Eye, Trash } from "@vicons/fa";

const message = useMessage();
const dialog = useDialog();
const ordersStore = useOrdersStore();
const auth = useAuthStore();

const showDetail = ref(false);

onMounted(async () => {
  await ordersStore.fetchAll();
});

function formatPrice(price: number | null) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price || 0);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("vi-VN");
}

const columns = computed<DataTableColumns<Order>>(() => {
  const cols: DataTableColumns<Order> = [{ title: "ID", key: "id", width: 60 }];

  if (auth.isAdmin) {
    cols.push(
      { title: "Khách hàng", key: "customerName", width: 150 },
      { title: "SĐT", key: "customerPhone", width: 120 },
    );
  }

  cols.push(
    {
      title: "Tổng tiền",
      key: "totalPrice",
      width: 130,
      render(row) {
        return formatPrice(row.totalPrice);
      },
    },
    {
      title: "Giao hàng",
      key: "isDelivery",
      width: 100,
      render(row) {
        return h(
          NTag,
          {
            type: row.isDelivery ? "info" : "default",
            size: "small",
            round: true,
          },
          () => (row.isDelivery ? "Có" : "Không"),
        );
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      render(row) {
        const type = row.status === "completed" ? "success" : "warning";
        return h(NTag, { type, size: "small", round: true }, () =>
          row.status === "completed" ? "Hoàn thành" : "Đang xử lý",
        );
      },
    },
    {
      title: "Ngày tạo",
      key: "createdAt",
      width: 170,
      render(row) {
        return formatDate(row.createdAt);
      },
    },
    {
      title: "",
      key: "actions",
      width: 140,
      render(row) {
        const btns = [
          h(
            NButton,
            {
              size: "small",
              quaternary: true,
              type: "info",
              onClick: () => viewDetail(row.id),
            },
            { icon: () => h(NIcon, null, () => h(Eye)) },
          ),
        ];
        if (auth.isAdmin) {
          btns.push(
            h(
              NButton,
              {
                size: "small",
                quaternary: true,
                type: row.status === "completed" ? "warning" : "success",
                onClick: () => toggleStatus(row),
              },
              {
                default: () =>
                  row.status === "completed" ? "Pending" : "Done",
              },
            ),
          );
          btns.push(
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
          );
        }
        return h(NSpace, { size: "small" }, () => btns);
      },
    },
  );

  return cols;
});

async function viewDetail(id: number) {
  try {
    await ordersStore.fetchById(id);
    showDetail.value = true;
  } catch (err: unknown) {
    message.error((err as Error).message);
  }
}

async function toggleStatus(order: Order) {
  const newStatus = order.status === "completed" ? "pending" : "completed";
  try {
    await ordersStore.update(order.id, {
      status: newStatus as "pending" | "completed",
    });
    message.success("Cập nhật trạng thái thành công");
  } catch (err: unknown) {
    message.error((err as Error).message);
  }
}

function confirmDelete(order: Order) {
  dialog.warning({
    title: "Xác nhận xóa",
    content: `Bạn có chắc muốn xóa đơn hàng #${order.id}?`,
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await ordersStore.remove(order.id);
        message.success("Đã xóa đơn hàng");
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
      <h2 class="page-title">Lịch sử đơn hàng</h2>
    </div>

    <NDataTable
      :columns="columns"
      :data="ordersStore.items"
      :loading="ordersStore.loading"
      :bordered="false"
      striped
    />

    <!-- Order Detail Modal -->
    <NModal v-model:show="showDetail">
      <NCard
        title="Chi tiết đơn hàng"
        style="width: 560px; border-radius: 12px"
        :bordered="false"
      >
        <template v-if="ordersStore.currentOrder">
          <NSpace vertical :size="12">
            <NText>Đơn hàng #{{ ordersStore.currentOrder.id }}</NText>
            <NText v-if="ordersStore.currentOrder.customerName">
              Khách: {{ ordersStore.currentOrder.customerName }} —
              {{ ordersStore.currentOrder.customerPhone }}
            </NText>
            <NTag
              :type="
                ordersStore.currentOrder.status === 'completed'
                  ? 'success'
                  : 'warning'
              "
              round
            >
              {{
                ordersStore.currentOrder.status === "completed"
                  ? "Hoàn thành"
                  : "Đang xử lý"
              }}
            </NTag>
            <NDataTable
              :columns="[
                { title: 'Sản phẩm', key: 'productName' },
                { title: 'SL', key: 'quantity', width: 60 },
                {
                  title: 'Đơn giá',
                  key: 'price',
                  render: (row: any) => formatPrice(row.price),
                },
                {
                  title: 'Thành tiền',
                  key: 'total',
                  render: (row: any) => formatPrice(row.price * row.quantity),
                },
              ]"
              :data="ordersStore.currentOrder.items || []"
              :bordered="false"
              size="small"
            />
            <NText strong style="font-size: 16px">
              Tổng: {{ formatPrice(ordersStore.currentOrder.totalPrice) }}
            </NText>
          </NSpace>
        </template>
      </NCard>
    </NModal>
  </div>
</template>
