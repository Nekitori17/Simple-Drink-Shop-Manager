import { defineEventHandler, getQuery } from "h3";
import { db } from "@db/index";
import { categories } from "@db/schema/Categories";
import { handleDatabaseError } from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery<{
      limit?: string;
      offset?: string;
    }>(event);
    const limit = query.limit ? parseInt(query.limit) : undefined;
    const offset = query.offset ? parseInt(query.offset) : undefined;

    let queryBuilder = db.select().from(categories).$dynamic();

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
