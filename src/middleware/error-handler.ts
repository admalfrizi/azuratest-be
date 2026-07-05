import { NextFunction, Request, Response } from "express";
import config from "../config";
import { getErrorMessage } from "../utils";
import { sendErrorResponse } from "./response-handler";
import CaseError from "../errors/CaseError";
import ValidationError from "../errors/ValidationError";

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

  if(error instanceof ValidationError) {
    sendErrorResponse(
      res, 
      error.message, 
      error.statusCode as number,
      error.details
    );
    return;
  }

  if (error instanceof CaseError) {
    sendErrorResponse(
      res, 
      error.message, 
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