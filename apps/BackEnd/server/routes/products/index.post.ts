import { defineEventHandler, readBody } from "h3";
import { db } from "@db/index";
import { products } from "@db/schema/Products";
import { requireAdmin } from "@utils/auth";
import {
  handleDatabaseError,
  validateBodyRequired,
} from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event);

    const body = await readBody<{
      name: string;
      price: number;
      categoryId: number;
    }>(event);
    validateBodyRequired(body, ["name", "price", "categoryId"]);

    const { name, price, categoryId } = body;

    const [product] = await db
      .insert(products)
      .values({
        name,
        price,
        categoryId,
      })
      .returning();

    return {
      success: true,
      data: product,
    };
  } catch (error) {
    throw handleDatabaseError(error);
  }
});
