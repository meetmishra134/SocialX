class ApiError extends Error {
  public statusCode: number;
  public errors?: unknown[];
  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors?: unknown[],
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}
export { ApiError };
