import { eq } from "drizzle-orm";
import { createError, defineEventHandler, readBody } from "h3";
import { db } from "@db/index";
import { categories } from "@db/schema/Categories";
import { requireAdmin } from "@utils/auth";
import { handleDatabaseError, parseRouteId } from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event);

    const id = parseRouteId(event);
    const body = await readBody<{
      name: string;
    }>(event);

    const { name } = body;

    const [category] = await db
      .update(categories)
      .set({ name })
      .where(eq(categories.id, id))
      .returning();

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Category not found",
      });
    }

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    throw handleDatabaseError(error);
  }
});
