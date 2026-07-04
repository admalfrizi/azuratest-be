import config from "./config";
import { checkDbConnection, closeDbConnection } from "./database";
import { createServer } from "./server";

const server = createServer();

const startServer = async () => {
  try {
    await checkDbConnection();
    const app = server.listen(config.port, () => {
      console.log(`api running on ${config.port}`);
    });

    const shutdown = async (signal: string) => {
      console.log(`${signal} received, shutting down...`);

      app.close(async () => {
        await closeDbConnection();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();