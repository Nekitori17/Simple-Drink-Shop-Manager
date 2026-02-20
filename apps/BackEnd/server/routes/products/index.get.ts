import { eq, and } from "drizzle-orm";
import { createError, defineEventHandler, getQuery } from "h3";
import { db } from "@db/index";
import { products } from "@db/schema/Products";
import { categories } from "@db/schema/Categories";
import {
  handleDatabaseError,
  validateQueryRequired,
} from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery<{
      categoryId?: string;
      limit?: string;
      offset?: string;
    }>(event);

    validateQueryRequired(query, ["limit", "offset"]);

    const categoryId =
      query.categoryId !== undefined ? Number(query.categoryId) : undefined;

    const limit = Number(query.limit);
    const offset = Number(query.offset);

    if (Number.isNaN(limit) || Number.isNaN(offset)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Invalid limit or offset",
      });
    }

    const conditions = [];

    if (categoryId !== undefined && !Number.isNaN(categoryId)) {
      conditions.push(eq(products.categoryId, categoryId));
    }

    const results = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        categoryId: products.categoryId,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset);

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    throw handleDatabaseError(error);
  }
});
