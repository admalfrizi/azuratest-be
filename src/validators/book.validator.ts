export interface CreateBookInput {
  title: string;
  author: string;
  category_id: number;
  publisher: string;
  publication_date: string;
  number_of_pages: number;
}

export type ValidationResult<T> =
  | { isValid: true; data: T }
  | { isValid: false; errors: string[] };

export function validateCreateBook(input: unknown): ValidationResult<CreateBookInput> {
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
 
  if (errors.length > 0) {
    return { isValid: false, errors };
  }
 
  return {
    isValid: true,
    data: {
        title: (title as string).trim(),
        author: (author as string).trim(),
        category_id: category_id as number,
        publisher: (publisher as string)?.trim() || "",
        publication_date: (publication_date as string).trim(),
        number_of_pages: (number_of_pages as number) || 0
    },
  };
}