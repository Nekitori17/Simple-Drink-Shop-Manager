import { eq } from "drizzle-orm";
import { createError, defineEventHandler } from "h3";
import { db } from "@db/index";
import { categories } from "@db/schema/Categories";
import { products } from "@db/schema/Products";
import { handleDatabaseError, parseRouteId } from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    const id = parseRouteId(event);

    const [product] = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        categoryId: products.categoryId,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id))
      .limit(1);

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
