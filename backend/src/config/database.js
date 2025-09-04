import dotenv from "dotenv";
dotenv.config();

const dialect = process.env.DB_DIALECT || "mysql";

export const dbConfig = dialect === "sqlite"
  ? { dialect: "sqlite", storage: process.env.SQLITE_FILE || "./dev.sqlite", logging: false }
  : { host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), database: process.env.DB_NAME,
      username: process.env.DB_USER, password: process.env.DB_PASS, dialect: "mysql", logging: false };
