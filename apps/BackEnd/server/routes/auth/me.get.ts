import { eq } from "drizzle-orm";
import { createError, defineEventHandler } from "h3";
import { db } from "@db/index";
import { accounts } from "@db/schema/Accounts";
import { customers } from "@db/schema/Customers";
import { requireAuth } from "@utils/auth";
import { handleDatabaseError } from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    const payload = await requireAuth(event);

    if (payload.isAdmin) {
      return {
        success: true,
        data: {
          userName: payload.userName,
          isAdmin: true,
        },
      };
    }

    // Get user details
    const [result] = await db
      .select({
        id: accounts.id,
        userName: accounts.userName,
        customerId: accounts.customerId,
        customerName: customers.name,
        customerPhone: customers.phone,
        customerAddress: customers.address,
      })
      .from(accounts)
      .innerJoin(customers, eq(accounts.customerId, customers.id))
      .where(eq(accounts.id, payload.userId))
      .limit(1);

    if (!result) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
        message: "User not found",
      });
    }

    return {
      success: true,
      data: {
        id: result.id,
        userName: result.userName,
        customerId: result.customerId,
        name: result.customerName,
        phone: result.customerPhone,
        address: result.customerAddress,
        isAdmin: false,
      },
    };
  } catch (error) {
    throw handleDatabaseError(error);
  }
});
