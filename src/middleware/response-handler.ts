import { Response } from "express";

export interface ApiSuccessResponse<T>{
    success: boolean;
    code: number;
    data: T,
    message: string;
    meta?: Record<string, unknown>
}

export interface ApiErrorResponse {
    success: boolean;
    code: number;
    message: string;
}

export function sendSuccessResponse<T>(
    res: any, 
    data: T, 
    code: number = 200, 
    message: string = "Success",
    meta?: Record<string, unknown>
): Response { 
    const body: ApiSuccessResponse<T> = {
        success: true,
        code,
        data,
        message,
        meta
    };
    if (meta) body.meta = meta;
    return res.status(code).json(body);
}

export function sendErrorResponse(res: any, message: string, code: number = 500): Response {
    const body: ApiErrorResponse = {
        success: false,
        code,
        message
    };
    return res.status(code).json(body);
}