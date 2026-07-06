import { excludeFieldsFromArray, getParamsData } from "../../../utils";
import { sendSuccessResponse } from "../../../middleware/response-handler";
import { categoriesRepository } from "../../../data/repository/category.repository";
import { Request, Response } from "express";
import NotFoundError from "../../../errors/NotFoundError";

export const listCategories = async (req: Request, res: Response) => {
    const { page, perPage, limit, offset } = getParamsData(req);
    
    const result = await categoriesRepository.findPaginated({ limit, offset });

    const sanitizedData = excludeFieldsFromArray(
        result.data, 
        ["created_at", "updated_at"]
    );

    sendSuccessResponse(
        res, 
        sanitizedData, 
        200,
        "Successfully retrieved categories",
        {   page, 
            perPage, 
            total_pages: Math.ceil(result.total / perPage),
            total_count: result.total, 
        }
    );
}

export const createCategory = async (req: Request, res: Response) => {
    const category = await categoriesRepository.create(req.body);

    sendSuccessResponse(res, category, 201, "Category created successfully");
}

export const updateCategory = async (
  req: Request, 
  res: Response
) => {
    const id = Number(req.params.id)
    const { name } = req.body;
    
    const category = await categoriesRepository.findById(id);

    if(!category) {
        throw new NotFoundError("Category not found or exist");
    }

    const updateData = await categoriesRepository.update(id, { name });

    sendSuccessResponse(res,updateData, 201, "Category succesfully updated");
}

export const deleteCategory = async (
  req: Request, 
  res: Response
) => {
  const id = Number(req.params.id)

  const deleted = await categoriesRepository.delete(id);

  if(!deleted)
  {
    throw new NotFoundError("Category not found")
  }
    
  sendSuccessResponse(
    res,
    "",
    204,
    "Book delete successfully"
  )
}
