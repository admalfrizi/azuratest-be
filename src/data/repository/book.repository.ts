import { query } from "../../../src/database";
import { Book } from "../entities/Book";
import { BOOKS_QUERY } from "../entities/SqlQuery";
import { createBaseRepository, PaginationParams } from "./base_repository";


export function createBookRepository() {
    const base = createBaseRepository<Book>("books");

    return {
        ...base,
        async findByCategoryId(categoryId: number) {
            return query<Book>(
                `${BOOKS_QUERY} WHERE category_id = $1`, [categoryId]
            );
        },
        async findByTitle(title: string) {
            return query<Book>(
                `${BOOKS_QUERY} WHERE title ILIKE $1`, [`%${title}%`]
            );
        }
    }
}

export const bookRepository = createBookRepository();