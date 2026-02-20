import { eq } from "drizzle-orm";
import { defineEventHandler, getQuery } from "h3";
import { db } from "@db/index";
import { accounts } from "@db/schema/Accounts";
import { customers } from "@db/schema/Customers";
import { requireAdmin } from "@utils/auth";
import { handleDatabaseError } from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event);

    const query = getQuery<{
      limit?: string;
      offset?: string;
    }>(event);

    const limit = query.limit ? parseInt(query.limit) : undefined;
    const offset = query.offset ? parseInt(query.offset) : undefined;

    let queryBuilder = db
      .select({
        id: accounts.id,
        customerId: accounts.customerId,
        userName: accounts.userName,
        customerName: customers.name,
        customerPhone: customers.phone,
      })
      .from(accounts)
      .leftJoin(customers, eq(accounts.customerId, customers.id))
      .$dynamic();

    if (limit !== undefined) {
      queryBuilder = queryBuilder.limit(limit);
    }

    if (offset !== undefined) {
      queryBuilder = queryBuilder.offset(offset);
    }

    const results = await queryBuilder;

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    throw handleDatabaseError(error);
  }
});
