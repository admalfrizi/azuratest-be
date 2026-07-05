import { excludeFieldsFromArray, getParamsData } from "../../../utils";
import { sendSuccessResponse } from "../../../middleware/response-handler";
import { categoriesRepository } from "../../../data/repository/category.repository";
import { Request, Response } from "express";

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