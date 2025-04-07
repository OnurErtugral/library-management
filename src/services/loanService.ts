import { IsNull } from "typeorm";
import bookService from "./bookService";
import userService from "./userService";
import { AppDataSource } from "../config/database";
import { ErrorMessages } from "../constants/errorMessages";
import { Loan } from "../entities/Loan";
import { ReturnBookParams } from "../types";

const loanRepository = AppDataSource.getRepository(Loan);

const loanService = {
  borrowBook: async (userId: number, bookId: number): Promise<Loan> => {
    // Check if book exists using bookService
    const book = await bookService.getBookById(bookId);

    if (!book) {
      throw new Error(ErrorMessages.BOOK_NOT_FOUND);
    }

    // Check if user exists using userService
    const user = await userService.getUserById(userId);

    if (!user) {
      throw new Error(ErrorMessages.USER_NOT_FOUND);
    }

    // Check if user already has borrowed this book and not returned it
    const existingLoan = await loanService.findActiveLoanByUserAndBook(
      userId,
      bookId
    );

    if (existingLoan) {
      throw new Error(ErrorMessages.ALREADY_BORROWED);
    }

    // Create loan
    const loanData = {
      userId,
      bookId,
      borrowDate: new Date(),
    };

    const loan = loanRepository.create(loanData);

    return loanRepository.save(loan);
  },

  // Find active loan by user and book ID
  findActiveLoanByUserAndBook: async (
    userId: number,
    bookId: number
  ): Promise<Loan | null> => {
    const loan = await loanRepository.findOne({
      where: {
        userId,
        bookId,
        returnDate: IsNull(),
      },
    });
    return loan;
  },

  // Return a book with score in a transaction
  returnBookByUserAndBookId: async (
    params: ReturnBookParams
  ): Promise<Loan | null> => {
    const { userId, bookId, score } = params;

    // Find the active loan
    const activeLoan = await loanService.findActiveLoanByUserAndBook(
      userId,
      bookId
    );

    if (!activeLoan) {
      throw new Error(ErrorMessages.ACTIVE_LOAN_NOT_FOUND);
    }

    // Return the book with the optional score
    return loanService.returnBook(activeLoan.id, score);
  },

  returnBook: async (loanId: number, score?: number): Promise<Loan | null> => {
    // Start a transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const loanRepo = queryRunner.manager.getRepository(Loan);

      const loan = await loanRepo.findOne({
        where: { id: loanId },
        relations: ["book"],
      });

      if (!loan) {
        return null;
      }

      if (loan.returnDate) {
        throw new Error(ErrorMessages.ALREADY_RETURNED);
      }

      // Update loan with return date and score
      loan.returnDate = new Date();

      if (score !== undefined) {
        loan.score = score;

        // Update book score within the same transaction
        await bookService.updateBookScoreWithTransaction(
          loan.bookId,
          score,
          queryRunner
        );
      }

      const savedLoan = await loanRepo.save(loan);

      await queryRunner.commitTransaction();

      return savedLoan;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  },
};

export default loanService;
