import { eq } from "drizzle-orm";
import { createError, defineEventHandler } from "h3";
import { db } from "@db/index";
import { accounts } from "@db/schema/Accounts";
import { requireAdmin } from "@utils/auth";
import { handleDatabaseError, parseRouteId } from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event);

    const id = parseRouteId(event);

    const [account] = await db
      .delete(accounts)
      .where(eq(accounts.id, id))
      .returning();

    if (!account) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Account not found",
      });
    }

    return {
      success: true,
      data: account,
    };
  } catch (error) {
    throw handleDatabaseError(error);
  }
});
