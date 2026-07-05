import { Request, Response, NextFunction } from "express";
import { getParamsData } from "../../../utils";
import { sendErrorResponse, sendSuccessResponse } from "../../../middleware/response-handler";
import { bookRepository } from "../../../data/repository/book.repository";
import { validateCreateBook } from "src/validators/book.validator";

export const listBooks = async (req: Request, res: Response) => {
  const { page, perPage, limit, offset } = getParamsData(req);
  
  const result = await bookRepository.findPaginated({ limit, offset });
  
  sendSuccessResponse(res, result.data, 200,
    { page, 
      perPage, 
      total_pages: Math.ceil(result.total / perPage),
      total_count: result.total, 
    }
  );
}

export const getBook = async (
  req: Request, 
  res: Response
) => {

  res.json({ message: "Get book by ID" });
}

export const createBook = async (
  req: Request, 
  res: Response
) => {
  const validation = validateCreateBook(req.body);
  
  if (!validation.isValid) {
    return sendErrorResponse(res, validation.errors.join(", "), 400);
  }

  const { title, author, category_id, publisher, publication_date, number_of_pages } = validation.data;

  

}
