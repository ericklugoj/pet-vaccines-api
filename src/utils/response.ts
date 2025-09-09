export const createResponse = (
  statusCode: number,
  body: any,
  headers: Record<string, string> = {},
) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    ...headers,
  },
  body: JSON.stringify(body),
});

export const successResponse = (data: any, statusCode: number = 200) =>
  createResponse(statusCode, { success: true, data });

export const errorResponse = (message: string, statusCode: number = 500) =>
  createResponse(statusCode, { success: false, error: message });

export const notFoundResponse = (resource: string = "Resource") =>
  errorResponse(`${resource} not found`, 404);

export const validationErrorResponse = (message: string) =>
  errorResponse(`Validation error: ${message}`, 400);
