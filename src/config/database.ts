import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Book } from "../entities/Book";
import { Loan } from "../entities/Loan";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "library_management",
  synchronize: process.env.NODE_ENV !== "production",
  logging: false,
  entities: [User, Book, Loan],
  subscribers: [],
  migrations: [],
});
