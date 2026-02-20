import {
  boolean,
  pgTable,
  serial,
  timestamp,
  varchar,
  integer,
} from "drizzle-orm/pg-core";
import { customers } from "./Customers";
import { products } from "./Products";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id, {
      onDelete: "cascade",
    }),
  totalPrice: integer("total_price").default(0),
  isDelivery: boolean("is_delivery").default(false),
  status: varchar("status", {
    length: 256,
    enum: ["pending", "completed"],
  }).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
    }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").default(1),
  price: integer("price").default(0),
});
