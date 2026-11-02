import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";

const errorHandlerMiddleware = (
  err: {
    statusCode?: number;
    message?: string;
    name?: string;
    code?: number;
    errors?: Record<string, { message: string }>;
    keyValue?: Record<string, unknown>;
    value?: unknown;
  },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const isProduction = process.env.NODE_ENV === "production";
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let defaultMessage = err.message || "Something went wrong try again later";
  if (statusCode === StatusCodes.INTERNAL_SERVER_ERROR && isProduction) {
    defaultMessage = "Internal server error";
  }

  let customError = {
    statusCode,
    msg: defaultMessage,
  };

  if (err.name === "ValidationError" && err.errors) {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000 && err.keyValue) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue,
    )} field, please choose another value`;
    customError.statusCode = 400;
  }
  if (err.name === "CastError") {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
