import { defineEventHandler, readBody } from "h3";
import { db } from "@db/index";
import { accounts } from "@db/schema/Accounts";
import { customers } from "@db/schema/Customers";
import { createToken, hashPassword } from "@utils/auth";
import {
  handleDatabaseError,
  validateBodyRequired,
} from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{
      userName: string;
      password: string;
      name: string;
      phone: string;
      address?: string;
    }>(event);
    validateBodyRequired(body, ["userName", "password", "name", "phone"]);

    const { userName, password, name, phone, address } = body;

    // Create customer first
    const [customer] = await db
      .insert(customers)
      .values({
        name,
        phone,
        address: address || null,
      })
      .returning();

    // Create account
    const hashedPassword = hashPassword(password);
    const [account] = await db
      .insert(accounts)
      .values({
        customerId: customer.id,
        userName,
        password: hashedPassword,
      })
      .returning();

    // Generate token
    const token = createToken({
      userId: account.id,
      customerId: customer.id,
      userName: account.userName,
      isAdmin: false,
    });

    return {
      success: true,
      data: {
        token,
        user: {
          id: account.id,
          customerId: customer.id,
          userName: account.userName,
          name: customer.name,
          phone: customer.phone,
          isAdmin: false,
        },
      },
    };
  } catch (error) {
    throw handleDatabaseError(error);
  }
});
