import { Request, Response } from "express";
import { ErrorMessages } from "../constants/errorMessages";
import loanService from "../services/loanService";
import { ReturnBookParams } from "../types";

const loanController = {
  borrowBook: async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const bookId = parseInt(req.params.bookId);

      await loanService.borrowBook(userId, bookId);
      return res.status(204).send();
    } catch (error: any) {
      if (
        error.message === ErrorMessages.BOOK_NOT_FOUND ||
        error.message === ErrorMessages.USER_NOT_FOUND
      ) {
        return res.status(404).json({ error: error.message });
      } else if (error.message === ErrorMessages.ALREADY_BORROWED) {
        return res.status(409).json({ error: error.message });
      }

      return res
        .status(500)
        .json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  },

  returnBook: async (
    req: Request<{ userId: string; bookId: string }, {}, { score?: number }>,
    res: Response
  ) => {
    try {
      const userId = parseInt(req.params.userId);
      const bookId = parseInt(req.params.bookId);
      const { score } = req.body;

      const returnParams: ReturnBookParams = { userId, bookId, score };
      await loanService.returnBookByUserAndBookId(returnParams);
      res.status(204).send();
    } catch (error) {
      console.error("Error returning book:", error);

      if ((error as Error).message === ErrorMessages.ACTIVE_LOAN_NOT_FOUND) {
        return res
          .status(404)
          .json({ message: ErrorMessages.ACTIVE_LOAN_NOT_FOUND });
      } else if ((error as Error).message === ErrorMessages.ALREADY_RETURNED) {
        return res
          .status(400)
          .json({ message: ErrorMessages.ALREADY_RETURNED });
      }

      res.status(500).json({ message: ErrorMessages.FAILED_TO_RETURN_BOOK });
    }
  },
};

export default loanController;
