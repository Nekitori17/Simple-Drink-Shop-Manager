import { eq } from "drizzle-orm";
import { createError, defineEventHandler, readBody } from "h3";
import { db } from "@db/index";
import { orders } from "@db/schema/Orders";
import { requireAdmin } from "@utils/auth";
import { handleDatabaseError, parseRouteId } from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event);

    const id = parseRouteId(event);
    const body = await readBody<{
      status?: "pending" | "completed";
      isDelivery?: boolean;
    }>(event);

    const updateData: Partial<typeof orders.$inferInsert> = {};

    if (body.status !== undefined) {
      if (!orders.status.enumValues.includes(body.status)) {
        throw createError({
          statusCode: 400,
          statusMessage: "Bad Request",
          message: "Invalid status. Must be 'pending' or 'completed'",
        });
      }
      updateData.status = body.status;
    }

    if (body.isDelivery !== undefined) {
      updateData.isDelivery = body.isDelivery;
    }

    const [order] = await db
      .update(orders)
      .set(updateData)
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
