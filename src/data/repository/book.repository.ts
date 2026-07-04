import { query } from "src/database";
import { createBaseRepository } from "./base_repository";

export interface Book {
  id: number;
  title: string;
  author: string;
  category_id: number;
  created_at: Date;
}

export function createBookRepository() {
    const base = createBaseRepository<Book>("books");

    return {
        ...base,
        async findByCategoryId(categoryId: number) {
            return query<Book>(
                `SELECT * FROM books WHERE category_id = $1`, [categoryId]
            );
        },
        async findByTitle(title: string) {
            return query<Book>(
                "SELECT * FROM books WHERE title ILIKE $1 ORDER BY id", [`%${title}%`]
            );
        }
    }
}

export const bookRepository = createBookRepository();