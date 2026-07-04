import { Pool } from "pg";

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