import { inArray } from "drizzle-orm";
import { createError, defineEventHandler, readBody } from "h3";
import { db } from "@db/index";
import { products } from "@db/schema/Products";
import { orders, orderItems } from "@db/schema/Orders";
import { requireAuth } from "@utils/auth";
import {
  handleDatabaseError,
  validateBodyRequired,
} from "@utils/error-handler";

interface OrderItem {
  productId: number;
  quantity: number;
}

export default defineEventHandler(async (event) => {
  try {
    const payload = await requireAuth(event);
    const body = await readBody<{
      items: OrderItem[];
      isDelivery?: boolean;
    }>(event);

    validateBodyRequired(body, ["items"]);

    const { items, isDelivery } = body;

    if (!Array.isArray(items) || items.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Order must contain at least one item",
      });
    }

    // Get product prices
    const productIds = items.map((item) => item.productId);
    const productList = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    const productMap = new Map(productList.map((p) => [p.id, p.price]));

    // Calculate total price
    let totalPrice = 0;
    const orderItemsData = items.map((item) => {
      const price = productMap.get(item.productId);
      if (price === undefined) {
        throw createError({
          statusCode: 400,
          statusMessage: "Bad Request",
          message: `Product ${item.productId} not found`,
        });
      }
      const itemTotal = price * item.quantity;
      totalPrice += itemTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price,
      };
    });

    // Create order
    const [order] = await db
      .insert(orders)
      .values({
        customerId: payload.customerId,
        totalPrice,
        isDelivery: isDelivery || false,
        status: "pending",
      })
      .returning();

    // Create order items
    const createdItems = await db
      .insert(orderItems)
      .values(
        orderItemsData.map((item) => ({
          ...item,
          orderId: order.id,
        })),
      )
      .returning();

    return {
      success: true,
      data: {
        order,
        items: createdItems,
      },
    };
  } catch (error) {
    throw handleDatabaseError(error);
  }
});
