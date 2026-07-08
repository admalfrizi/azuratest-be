import ValidationError from "../errors/ValidationError";

export interface CreateCategoryInput {
  name: string;
}

export function validateCreateCategory(input: unknown): CreateCategoryInput {
    const errors: string[] = [];
    const body = (input ?? {}) as Record<string, unknown>;
    const { name } = body;

    if (typeof name !== "string" || name.trim().length === 0) {
        errors.push("name is required and must be a non-empty string");
    }

    if (errors.length > 0) {
        throw new ValidationError("Invalid Category data", errors);
    }

    return {
        name: (name as string).trim(),
    }
} 