import { query } from "../../../src/database";
import { Book } from "../entities/Book";
import { createBaseRepository } from "./base_repository";

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