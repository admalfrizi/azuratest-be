const config = {
  env: process.env.NODE_ENV || "development",
  debug: process.env.APP_DEBUG === "true",
  logInfo: process.env.LOG_LEVEL || "info",
  port: parseInt(process.env.PORT || "3000"),
  defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE || "5"),
};

export default config;