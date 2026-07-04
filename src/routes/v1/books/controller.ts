import { Request, Response, NextFunction } from "express";
import NotFoundError from "../../../errors/NotFoundError";
import { getParamsData } from "src/utils";
//import { bookRepository } from "src/data/repository/books_repository";

export const listBooks = (req: Request, res: Response) => {
  const { page, perPage, limit, offset } = getParamsData(req);
  
  res.json({ message: "List of books" });
}

export const getBook = async (
  req: Request, 
  res: Response
) => {

  res.json({ message: "Get book by ID" });
}
