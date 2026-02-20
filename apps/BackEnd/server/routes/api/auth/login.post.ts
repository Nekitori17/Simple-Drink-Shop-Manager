import { eq } from "drizzle-orm";
import { createError, defineEventHandler, readBody } from "h3";
import { db } from "@db/index";
import { accounts } from "@db/schema/Accounts";
import {
  createToken,
  verifyPassword,
  checkAdminCredentials,
} from "@utils/auth";
import {
  handleDatabaseError,
  validateBodyRequired,
} from "@utils/error-handler";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{
      userName: string;
      password: string;
    }>(event);
    validateBodyRequired(body, ["userName", "password"]);

    const { userName, password } = body;

    // Check if admin login
    if (checkAdminCredentials(userName, password)) {
      const token = createToken({
        userId: 0,
        customerId: 0,
        userName,
        isAdmin: true,
      });

      return {
        success: true,
        data: {
          token,
          user: {
            userName,
            isAdmin: true,
          },
        },
      };
    }

    // Check regular user login
    const [account] = await db
      .select({
        id: accounts.id,
        customerId: accounts.customerId,
        userName: accounts.userName,
        password: accounts.password,
      })
      .from(accounts)
      .where(eq(accounts.userName, userName))
      .limit(1);

    if (!account) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Invalid username or password",
      });
    }

    if (!verifyPassword(password, account.password)) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Invalid username or password",
      });
    }

    const token = createToken({
      userId: account.id,
      customerId: account.customerId,
      userName: account.userName,
      isAdmin: false,
    });

    return {
      success: true,
      data: {
        token,
        user: {
          id: account.id,
          customerId: account.customerId,
          userName: account.userName,
          isAdmin: false,
        },
      },
    };
  } catch (error) {
    throw handleDatabaseError(error);
  }
});
