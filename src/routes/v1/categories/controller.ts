import { getParamsData } from "src/utils";
import { sendSuccessResponse } from "../../../middleware/response-handler";
import { categoriesRepository } from "src/data/repository/category.repository";
import { Request, Response } from "express";

export const listCategories = async (req: Request, res: Response) => {
    const { page, perPage, limit, offset } = getParamsData(req);
    
    const result = await categoriesRepository.findPaginated({ limit, offset });

    sendSuccessResponse(res, result.data, 200,
        {   page, 
            perPage, 
            total_pages: Math.ceil(result.total / perPage),
            total_count: result.total, 
        }
    );
}