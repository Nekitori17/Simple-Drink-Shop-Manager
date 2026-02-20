import { H3Event, H3Error, createError, isError, getRouterParam } from "h3";
import { PG_ERROR } from "../db/const/pg-error-code";

interface DatabaseError {
  code?: string;
  constraint?: string;
  detail?: string;
  table?: string;
  column?: string;
}

export function handleDatabaseError(error: unknown): H3Error {
  if (isError(error)) {
    return error;
  }

  const dbError = error as DatabaseError;

  switch (dbError.code) {
    case PG_ERROR.UNIQUE_VIOLATION:
      return createError({
        statusCode: 409,
        statusMessage: "Conflict",
        message: `Duplicate entry: ${dbError.detail || "Record already exists"}`,
      });

    case PG_ERROR.FOREIGN_KEY_VIOLATION:
      return createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: `Invalid reference: ${dbError.detail || "Referenced record does not exist"}`,
      });

    case PG_ERROR.NOT_NULL_VIOLATION:
      return createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: `Missing required field: ${dbError.column || "Required field cannot be null"}`,
      });

    case PG_ERROR.CHECK_VIOLATION:
      return createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: `Invalid value: ${dbError.detail || "Value does not meet constraints"}`,
      });

    case PG_ERROR.INVALID_TEXT_REPRESENTATION:
      return createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Invalid data format",
      });

    case PG_ERROR.UNDEFINED_TABLE:
      return createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
        message: "Database table not found",
      });

    case PG_ERROR.UNDEFINED_COLUMN:
      return createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
        message: "Database column not found",
      });

    default:
      console.error("Database error:", error);
      return createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
        message: "Internal server error",
      });
  }
}

export function validateBodyRequired<T extends Record<string, unknown>>(
  data: T,
  fields: (keyof T)[],
): void {
  const missing = fields.filter(
    (field) => data[field] === undefined || data[field] === null,
  );

  if (missing.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: `Missing required body fields: ${missing.join(", ")}`,
    });
  }
}

export function validateQueryRequired<T extends Record<string, unknown>>(
  data: T,
  fields: (keyof T)[],
): void {
  const missing = fields.filter(
    (field) => data[field] === undefined || data[field] === null,
  );

  if (missing.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: `Missing required query params: ${missing.join(", ")}`,
    });
  }
}

export function parseRouteId(event: H3Event, param: string = "id"): number {
  const raw = getRouterParam(event, param);
  const id = Number(raw);

  if (!raw || Number.isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: `Invalid ${param}`,
    });
  }

  return id;
}
