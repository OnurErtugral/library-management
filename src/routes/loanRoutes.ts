import express from "express";
import loanController from "../controllers/loanController";
import { validate } from "../middleware/validation";
import { validateId } from "../middleware/paramValidation";
import { returnBookSchema } from "../validations";

const router = express.Router();

// POST /users/:userId/borrow/:bookId - Borrow a book
router.post(
  "/:userId/borrow/:bookId",
  validateId("userId"),
  validateId("bookId"),
  loanController.borrowBook
);

// POST /users/:userId/return/:bookId - Return a book
router.post(
  "/:userId/return/:bookId",
  validateId("userId"),
  validateId("bookId"),
  validate(returnBookSchema),
  loanController.returnBook
);

export default router;
