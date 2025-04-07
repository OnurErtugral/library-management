import express from "express";
import bookController from "../controllers/bookController";
import { validate } from "../middleware/validation";
import { validateId } from "../middleware/paramValidation";
import { createBookSchema } from "../validations";

const router = express.Router();

// GET /books - Get all books
router.get("/", bookController.getAllBooks);

// GET /books/:id - Get book by ID
router.get("/:id", validateId(), bookController.getBookById);

// POST /books - Create new book
router.post("/", validate(createBookSchema), bookController.createBook);

export default router;
