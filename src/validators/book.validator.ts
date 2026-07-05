import ValidationError from "../../src/errors/ValidationError";

export interface CreateBookInput {
  title: string;
  author: string;
  category_id: number;
  publisher: string;
  publication_date: string;
  number_of_pages: number;
}

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

// export type ValidationResult<T> =
//   | { isValid: true; data: T }
//   | { isValid: false; errors: string[] };

export function validateCreateBook(input: unknown): CreateBookInput{
  const errors: string[] = [];
  const body = (input ?? {}) as Record<string, unknown>;
  const { title, author, category_id, publisher, publication_date, number_of_pages } = body;
 
  if (typeof title !== "string" || title.trim().length === 0) {
    errors.push("title is required and must be a non-empty string");
  }
 
  if (typeof author !== "string" || author.trim().length === 0) {
    errors.push("author is required and must be a non-empty string");
  }
 
  if (typeof category_id !== "number" || !Number.isInteger(category_id)) {
    errors.push("category_id is required and must be an integer");
  }
 
  if (typeof publication_date !== "string" || publication_date.trim().length === 0) {
    errors.push("publication_date is required and must be a date string (YYYY-MM-DD)");
  } else if (!DATE_FORMAT.test(publication_date.trim())) {
    errors.push("publication_date must be in YYYY-MM-DD format");
  } else {
    const parsed = new Date(publication_date);
    if (Number.isNaN(parsed.getTime())) {
      errors.push("publication_date must be a valid calendar date");
    } else if (parsed.getTime() > Date.now()) {
      errors.push("publication_date cannot be in the future");
    }
  }
 
  if (errors.length > 0) {
    throw new ValidationError("Invalid book data", errors);
  }
 
  return {
    title: (title as string).trim(),
    author: (author as string).trim(),
    category_id: category_id as number,
    publisher: (publisher as string)?.trim() || "",
    publication_date: (publication_date as string).trim(),
    number_of_pages: (number_of_pages as number) || 0
  };
}