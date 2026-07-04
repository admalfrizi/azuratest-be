import { QueryResultRow } from "pg";
import { query, queryOne } from "src/database";

export interface Repository<T> {
  findAll: () => Promise<T[]>;
  findById: (id: number) => Promise<T | null>;
  findPaginated: (params: PaginationParams) => Promise<PaginatedResult<T>>;
  create: (data: Record<string, unknown>) => Promise<T>;
  update: (id: number, data: Record<string, unknown>) => Promise<T | null>;
  delete: (id: number) => Promise<boolean>;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export function createBaseRepository<T extends QueryResultRow>(
  tableName: string
): Repository<T> {
  return {
    async findAll() {
      return query<T>(`SELECT * FROM ${tableName} ORDER BY id`);
    },
 
    async findById(id: number) {
      return queryOne<T>(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
    },

    async findPaginated(params: PaginationParams = {}) {
      const limit = params.limit ?? 20;
      const offset = params.offset ?? 0;
 
      const [data, countRows] = await Promise.all([
        query<T>(`SELECT * FROM ${tableName} ORDER BY id LIMIT $1 OFFSET $2`, [
          limit,
          offset,
        ]),
        query<{ count: number }>(`SELECT COUNT(*)::int AS count FROM ${tableName}`),
      ]);
 
      return {
        data,
        total: countRows[0].count,
        limit,
        offset,
      };
    },
 
    async create(data: Record<string, unknown>) {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
 
      const text = `
        INSERT INTO ${tableName} (${columns.join(", ")})
        VALUES (${placeholders})
        RETURNING *
      `;
      const rows = await query<T>(text, values);
      return rows[0];
    },
 
    async update(id: number, data: Record<string, unknown>) {
      const columns = Object.keys(data);
      if (columns.length === 0) {
        return queryOne<T>(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
      }
 
      const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(", ");
      const values = Object.values(data);
 
      const text = `
        UPDATE ${tableName}
        SET ${setClause}
        WHERE id = $${columns.length + 1}
        RETURNING *
      `;
      return queryOne<T>(text, [...values, id]);
    },
 
    async delete(id: number) {
      const rows = await query<{ id: number }>(
        `DELETE FROM ${tableName} WHERE id = $1 RETURNING id`,
        [id]
      );
      return rows.length > 0;
    },
  };
}