import {Request, Response, NextFunction } from "express";
import NotFoundError from "../errors/NotFoundError";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
}
