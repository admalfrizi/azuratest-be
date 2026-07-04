import { Request, Response, NextFunction } from "express";

export const listBooks = (req: Request, res: Response) => {
  res.json({ message: "List of books" });
}

export const getBook = async (
  req: Request, 
  res: Response,
  next: NextFunction
) => {
  try {

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
  res.json({ message: "Get book by ID" });
}
