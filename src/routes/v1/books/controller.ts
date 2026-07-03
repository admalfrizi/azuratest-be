import { Request, Response } from "express";

export const listBooks = (req: Request, res: Response) => {
  res.json({ message: "List of books" });
}

export const getBook = (req: Request, res: Response) => {
  res.json({ message: "Get book by ID" });
}
