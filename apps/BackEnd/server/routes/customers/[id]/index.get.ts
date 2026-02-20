import { eq } from "drizzle-orm";
import { createError, defineEventHandler } from "h3";
import { db } from "@db/index";
import { customers } from "@db/schema/Customers";
import { requireAuth } from "@utils/auth";
import { handleDatabaseError, parseRouteId } from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    const payload = await requireAuth(event);
    const id = parseRouteId(event);

    // Non-admin users can only view their own profile
    if (!payload.isAdmin && payload.customerId !== id) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
        message: "Access denied",
      });
    }

    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, id))
      .limit(1);

    if (!customer) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Customer not found",
      });
    }

    return {
      success: true,
      data: customer,
    };
  } catch (error) {
    throw handleDatabaseError(error);
  }
});
