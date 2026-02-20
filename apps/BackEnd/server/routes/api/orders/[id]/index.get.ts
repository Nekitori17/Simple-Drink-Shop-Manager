import { eq } from "drizzle-orm";
import { createError, defineEventHandler } from "h3";
import { db } from "@db/index";
import { products } from "@db/schema/Products";
import { customers } from "@db/schema/Customers";
import { orders, orderItems } from "@db/schema/Orders";
import { requireAuth } from "@utils/auth";
import { handleDatabaseError, parseRouteId } from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    const payload = await requireAuth(event);
    const id = parseRouteId(event);

    // Get order details
    const [order] = await db
      .select({
        id: orders.id,
        customerId: orders.customerId,
        customerName: customers.name,
        customerPhone: customers.phone,
        customerAddress: customers.address,
        totalPrice: orders.totalPrice,
        isDelivery: orders.isDelivery,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .leftJoin(customers, eq(orders.customerId, customers.id))
      .where(eq(orders.id, id))
      .limit(1);

    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Order not found",
      });
    }

    // Check permission
    if (!payload.isAdmin && order.customerId !== payload.customerId) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
        message: "Access denied",
      });
    }

    // Get order items
    const items = await db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        productName: products.name,
        quantity: orderItems.quantity,
        price: orderItems.price,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, id));

    return {
      success: true,
      data: {
        ...order,
        items,
      },
    };
  } catch (error) {
    throw handleDatabaseError(error);
  }
});
