import { eq } from "drizzle-orm";
import { createError, defineEventHandler } from "h3";
import { db } from "@db/index";
import { products } from "@db/schema/Products";
import { requireAdmin } from "@utils/auth";
import { handleDatabaseError, parseRouteId } from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event);

    const id = parseRouteId(event);

    const [product] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Product not found",
      });
    }

    return {
      success: true,
      data: product,
    };
  } catch (error) {
    throw handleDatabaseError(error);
  }
});
