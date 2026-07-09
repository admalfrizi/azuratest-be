import { query } from "../../../src/database";
import { Book } from "../entities/Book";
import { BOOKS_QUERY } from "../entities/SqlQuery";
import { createBaseRepository, PaginationParams } from "./base_repository";

export interface BookEntity extends Omit<Book, 'category_id' | 'category'> {
  category: {
    id: number;
    name: string;
  };
}

const mapToBookEntity = (rawBook: any): BookEntity => {
    const { category_id, category, ...rest } = rawBook;
    return {
        ...rest,
        category: {
            id: category_id,
            name: category
        }
    };
};

export function createBookRepository() {
    const base = createBaseRepository<Book>("books");

    return {
        ...base,
        async findPaginated(
            params: PaginationParams = {}, 
           filters?: { categoryId?: number; publicationDate?: string, search?: string }
        ) {
            let baseQuery = BOOKS_QUERY;
            const values: any[] = [];
            let conditions: string[] = [];

            if (filters) {
                if (filters.categoryId) {
                    values.push(filters.categoryId);
                    conditions.push(`category_id = $${values.length}`);
                }
                if (filters.publicationDate) {
                    values.push(filters.publicationDate);
                    conditions.push(`publication_date = $${values.length}`);
                }
                if (filters.search) {
                    values.push(`%${filters.search}%`);
                    const idx = values.length;
                    conditions.push(`(title ILIKE $${idx} OR author ILIKE $${idx} OR publisher ILIKE $${idx})`);
                }
            }

            const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
            baseQuery += whereClause;

            const paginatedQuery = `${baseQuery} LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
            const paginatedValues = [...values, params.limit, params.offset];

            const rawData = await query<any>(paginatedQuery, paginatedValues);
            
            const mappedData = rawData.map(mapToBookEntity);
            
            const countQuery = `SELECT COUNT(*) FROM books${whereClause}`;
            const countResult = await query<any>(countQuery, values);
            const total = parseInt(countResult[0].count, 10);

            return { data: mappedData, total };
        },
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