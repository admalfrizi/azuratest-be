import { query, transaction } from "../../../src/database";
import { createBaseRepository } from "./base_repository";

export interface Categories {
  id: number;
  name: string;
  created_at: Date;
}

export function createCategoriesRepository() {
    const base = createBaseRepository<Categories>("categories");

    return {
        ...base,
        async findByName(name: string): Promise<Categories | null> {
            const rows = await query<Categories>(
                "SELECT * FROM categories WHERE name = $1",
                [name]
            );
            return rows[0] ?? null;
        },
        async deleteAndReassignBooks(
            categoryId: number,
            fallbackCategoryId: number
        ): Promise<boolean> {
            return transaction(async (client) => {
                await client.query(
                    "UPDATE books SET category_id = $1 WHERE category_id = $2",
                    [fallbackCategoryId, categoryId]
                );
                
                const result = await client.query(
                    "DELETE FROM categories WHERE id = $1 RETURNING id",
                    [categoryId]
                );

                return result.rows.length > 0;
            });
        },
    }
}

export const categoriesRepository = createCategoriesRepository();