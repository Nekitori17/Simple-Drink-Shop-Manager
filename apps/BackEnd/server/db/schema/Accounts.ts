import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { customers } from "./Customers";

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id")
    .notNull()
    .unique()
    .references(() => customers.id, {
      onDelete: "cascade",
    }),
  userName: varchar("user_name", { length: 256 }).unique().notNull(),
  password: varchar("password", { length: 256 }).notNull(),
});
