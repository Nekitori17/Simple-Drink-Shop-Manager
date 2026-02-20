import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { categories } from "./Categories";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  price: integer("price").notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, {
      onDelete: "cascade",
    }),
});
