import { eq } from "drizzle-orm";
import { createError, defineEventHandler } from "h3";
import { db } from "@db/index";
import { categories } from "@db/schema/Categories";
import { handleDatabaseError, parseRouteId } from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    const id = parseRouteId(event);

    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

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
