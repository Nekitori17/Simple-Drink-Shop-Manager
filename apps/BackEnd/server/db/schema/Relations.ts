import { relations } from "drizzle-orm";

import { customers } from "./Customers";
import { products } from "./Products";
import { categories } from "./Categories";
import { orders, orderItems } from "./Orders";
import { accounts } from "./Accounts";

export const customersRelations = relations(customers, ({ one, many }) => ({
  orders: many(orders),
  accounts: one(accounts),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  customer: one(customers, {
    fields: [accounts.customerId],
    references: [customers.id],
  }),
}));
