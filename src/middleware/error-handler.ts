import { NextFunction, Request, Response } from "express";
import config from "../config";
import { getErrorMessage } from "../utils";
import { sendErrorResponse } from "./response-handler";
import CaseError from "../errors/CaseError";

export default function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent || config.debug) {
    next(error);
    return;
  }

  if (error instanceof CaseError) {
    sendErrorResponse(
      res, 
      getErrorMessage(error), 
      error.statusCode as number
    );
    return;
  }

  sendErrorResponse(
    res, 
    getErrorMessage(error), 
    500
  );
}