import { Request, Response, NextFunction } from "express";
import { getParamsData } from "../../../utils";
import { sendErrorResponse, sendSuccessResponse } from "../../../middleware/response-handler";
import { bookRepository } from "../../../data/repository/book.repository";
import { validateCreateBook } from "../../../../src/validators/book.validator";
import { categoriesRepository } from "../../../../src/data/repository/category.repository";
import NotFoundError from "../../../errors/NotFoundError";
import { BOOKS_QUERY } from "../../../data/entities/SqlQuery";

export const listBooks = async (req: Request, res: Response) => {
  const { page, perPage, limit, offset } = getParamsData(req);
  
  const result = await bookRepository.findPaginated({ limit, offset }, BOOKS_QUERY);
  
  sendSuccessResponse(
    res, 
    result.data, 
    200, 
    "Successfully retrieved books",
    { page, 
      perPage, 
      totalPages: Math.ceil(result.total / perPage),
      totalCount: result.total, 
    }
  );
}

export const getBook = async (
  req: Request, 
  res: Response
) => {

  const bookData = await bookRepository.findById(Number(req.params.id), BOOKS_QUERY);
  if (!bookData) {
    throw new NotFoundError("Book not found");
  }

  sendSuccessResponse(res, bookData, 200, "Successfully retrieved book");
}

export const createBook = async (
  req: Request, 
  res: Response
) => {
  const { title, author, category_id, publisher, publication_date, number_of_pages } = validateCreateBook(req.body);
  const category = await categoriesRepository.findById(category_id);

  if (!category) {
    return sendErrorResponse(res, "category_id does not exist", 400);
  }

  const book = await bookRepository.create({
    title,
    author,
    category_id,
    publisher,
    publication_date,
    number_of_pages
  });

  sendSuccessResponse(res, book, 201, "Book created successfully");

}

export const updateBook = async (
  req: Request, 
  res: Response
) => {
  const { title, author, category_id, publisher, publication_date, number_of_pages } = validateCreateBook(req.body);

  const category = await categoriesRepository.findById(category_id);

  if (!category) {
    return sendErrorResponse(res, "category_id does not exist", 400);
  }

  const book = await bookRepository.update(
    Number(req.params.id),
    {
      title,
      author,
      category_id,
      publisher,
      publication_date,
      number_of_pages
    }
  );

  sendSuccessResponse(res, book, 201, "Book updated successfully");
}

export const deleteBook = async (
  req: Request, 
  res: Response
) => {
  const id = Number(req.params.id)

  const deleted = await bookRepository.delete(id);

  if(!deleted)
  {
    throw new NotFoundError("Book not found")
  }
    
  sendSuccessResponse(
    res,
    "",
    204,
    "Book delete successfully"
  )
}
