import { eq } from "drizzle-orm";
import { createError, defineEventHandler, readBody } from "h3";
import { db } from "@db/index";
import { products } from "@db/schema/Products";
import { requireAdmin } from "@utils/auth";
import {
  handleDatabaseError,
  parseRouteId,
  validateBodyRequired,
} from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event);

    const id = parseRouteId(event);
    const body = await readBody<{
      name: string;
      price: number;
      categoryId: number;
    }>(event);

    validateBodyRequired(body, ["name", "price", "categoryId"]);

    const updateData = {
      name: body.name,
      price: body.price,
      categoryId: body.categoryId,
    };

    const [product] = await db
      .update(products)
      .set(updateData)
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
