import { eq } from "drizzle-orm";
import { createError, defineEventHandler, readBody } from "h3";
import { db } from "@db/index";
import { customers } from "@db/schema/Customers";
import { requireAuth } from "@utils/auth";
import { handleDatabaseError, parseRouteId } from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    const payload = await requireAuth(event);
    const id = parseRouteId(event);
    const body = await readBody<{
      name: string;
      phone: string;
      address?: string;
    }>(event);

    // Non-admin users can only update their own profile
    if (!payload.isAdmin && payload.customerId !== id) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
        message: "Access denied",
      });
    }

    const updateData = {
      name: body.name,
      phone: body.phone,
      address: body.address,
    };

    const [customer] = await db
      .update(customers)
      .set(updateData)
      .where(eq(customers.id, id))
      .returning();

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
