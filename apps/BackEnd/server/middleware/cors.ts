import {
  defineEventHandler,
  getHeader,
  setResponseHeaders,
  setResponseStatus,
} from "h3";

export default defineEventHandler((event): void | string => {
  const origin = getHeader(event, "origin");
  const method = event.method;

  // Get allowed origins from environment or use defaults
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
  let allowedOrigins: string[];

  if (allowedOriginsEnv) {
    // Parse from environment: ALLOWED_ORIGINS="http://localhost:3000,https://yourdomain.com"
    allowedOrigins = allowedOriginsEnv.split(",").map((o) => o.trim());
  } else {
    // Default allowed origins for development
    allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:4173",
      "http://localhost:8080",
    ];
  }

  // Check environment
  const isDevelopment = process.env.NODE_ENV !== "production";

  // Determine if origin is allowed
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);
  const isWildcard = allowedOrigins.includes("*");
  const isNullOrigin = origin === "null" && isDevelopment;

  // Set CORS headers
  if (
    isAllowedOrigin ||
    isWildcard ||
    isNullOrigin ||
    (!origin && isDevelopment)
  ) {
    const allowOrigin = isWildcard ? "*" : origin || "*";

    const headers: Record<string, string> = {
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With, Accept, Origin",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Expose-Headers":
        "Content-Length, Content-Type, Authorization",
    };

    // Only set credentials header if not using wildcard
    if (!isWildcard) {
      headers["Access-Control-Allow-Credentials"] = "true";
    }

    setResponseHeaders(event, headers);
  }

  // Handle preflight request
  if (method === "OPTIONS") {
    setResponseStatus(event, 204);
    return "";
  }
});
