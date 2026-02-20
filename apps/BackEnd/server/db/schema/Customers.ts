import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  phone: varchar("phone", { length: 256 }).unique().notNull(),
  address: varchar("address", { length: 256 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
