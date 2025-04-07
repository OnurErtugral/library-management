import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import { logger } from "./middleware/logger";
import routes from "./routes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");

    // Middleware
    app.use(express.json());
    app.use(logger);

    // Routes
    app.use("/", routes);

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      "Error connecting to database. Make sure to run 'yarn db:start' to start the database:",
      error
    );
  });
