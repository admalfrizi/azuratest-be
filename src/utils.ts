import config from "./config";
import { Request } from "express";

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  if (typeof error === "string") {
    return error;
  }
  return "An error occurred";
}

export function getParamsData(req: Request) {
  const page = parseInt(req.query.page as string, 10);
  const perPage = parseInt(req.query.perPage as string, 10);

  const validPage = isNaN(page) || page < 1 ? 1 : page;
  const validPerPage =
    isNaN(perPage) || perPage < 1 ? config.defaultPageSize : perPage;

  const limit = validPerPage;
  const offset = (validPage - 1) * validPerPage;
  return {
    page: validPage,
    perPage: validPerPage,
    limit,
    offset,
  };
}

export function excludeFields<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keysToExclude: K[]
): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToExclude.includes(key as K))
  ) as Omit<T, K>;
}

export function excludeFieldsFromArray<T extends Record<string, any>, K extends keyof T>(
  arr: T[],
  keysToExclude: K[]
): Omit<T, K>[] {
  return arr.map(item => excludeFields(item, keysToExclude));
}