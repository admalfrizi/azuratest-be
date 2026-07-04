import { Request, Response, NextFunction } from "express";
import { getParamsData } from "../../../utils";
import { sendSuccessResponse } from "../../../middleware/response-handler";
import { bookRepository } from "../../../data/repository/book.repository";

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
