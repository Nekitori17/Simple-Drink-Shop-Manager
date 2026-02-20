import { eq } from "drizzle-orm";
import { createError, defineEventHandler } from "h3";
import { db } from "@db/index";
import { orders } from "@db/schema/Orders";
import { requireAdmin } from "@utils/auth";
import { handleDatabaseError, parseRouteId } from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event);

    const id = parseRouteId(event);

    // Order items will be automatically deleted due to CASCADE
    const [order] = await db
      .delete(orders)
      .where(eq(orders.id, id))
      .returning();

    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Order not found",
      });
    }

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    throw handleDatabaseError(error);
  }
});
