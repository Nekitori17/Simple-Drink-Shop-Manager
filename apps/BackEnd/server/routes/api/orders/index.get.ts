import { eq, desc } from "drizzle-orm";
import { createError, defineEventHandler, getQuery } from "h3";
import { db } from "@db/index";
import { orders } from "@db/schema/Orders";
import { customers } from "@db/schema/Customers";
import { requireAuth } from "@utils/auth";
import {
  handleDatabaseError,
  validateQueryRequired,
} from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    const payload = await requireAuth(event);
    const query = getQuery<{
      limit: string;
      offset: string;
    }>(event);

    validateQueryRequired(query, ["limit", "offset"]);

    const limit = parseInt(query.limit);
    const offset = parseInt(query.offset);

    if (Number.isNaN(limit) || Number.isNaN(offset)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Invalid limit or offset",
      });
    }

    let queryBuilder = db
      .select({
        id: orders.id,
        customerId: orders.customerId,
        customerName: customers.name,
        customerPhone: customers.phone,
        totalPrice: orders.totalPrice,
        isDelivery: orders.isDelivery,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .leftJoin(customers, eq(orders.customerId, customers.id))
      .orderBy(desc(orders.createdAt))
      .$dynamic();

    // Non-admin users can only see their own orders
    if (!payload.isAdmin) {
      queryBuilder = queryBuilder.where(
        eq(orders.customerId, payload.customerId),
      );
    }

    queryBuilder = queryBuilder.limit(limit).offset(offset);

    const results = await queryBuilder;

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    throw handleDatabaseError(error);
  }
});
