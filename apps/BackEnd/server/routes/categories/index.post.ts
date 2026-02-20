import { defineEventHandler, readBody } from "h3";
import { db } from "@db/index";
import { categories } from "@db/schema/Categories";
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
    }>(event);
    validateBodyRequired(body, ["name"]);

    const { name } = body;

    const [category] = await db.insert(categories).values({ name }).returning();

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    throw handleDatabaseError(error);
  }
});
