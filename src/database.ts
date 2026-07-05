import { Pool, PoolClient, QueryResultRow } from "pg";

export const DbConnection = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST, 
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

DbConnection.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export const checkDbConnection = async () => {
    const client = await DbConnection.connect();
    try {
        await client.query("SELECT NOW()");
        console.log("Database connection successful");
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    } finally {
        client.release();
    }
}

export const closeDbConnection = async () => {
    await DbConnection.end();
    console.log("Database connection closed");
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  try {
    const result = await DbConnection.query<T>(text, params);
    return result.rows;
  } catch (error) {
    console.error("Query failed:", { text, params, error });
    throw error;
  }
}

export async function queryOne<T extends QueryResultRow = any>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await DbConnection.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transaction rolled back:", error);
    throw error;
  } finally {
    client.release();
  }
}