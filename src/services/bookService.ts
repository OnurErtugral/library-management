import { QueryRunner } from "typeorm";
import { AppDataSource } from "../config/database";
import { Book } from "../entities/Book";
import { BookDetail, BookListItem, CreateBookParams } from "../types";

const bookRepository = AppDataSource.getRepository(Book);

const bookService = {
  getAllBooks: async (): Promise<Book[]> => {
    return await bookRepository.find();
  },

  getFormattedBooksList: async (): Promise<BookListItem[]> => {
    const books = await bookService.getAllBooks();
    return books.map((book) => ({
      id: book.id,
      name: book.name,
    }));
  },

  getBookById: async (id: number): Promise<Book | null> => {
    const book = await bookRepository.findOne({
      where: { id },
    });

    return book;
  },

  getFormattedBookDetails: async (id: number): Promise<BookDetail | null> => {
    const book = await bookService.getBookById(id);

    if (!book) {
      return null;
    }

    return {
      id: book.id,
      name: book.name,
      score:
        book.score !== null && book.score !== undefined
          ? book.score.toFixed(2)
          : "-1",
    };
  },

  createBook: async (bookData: CreateBookParams): Promise<Book> => {
    const bookDataToCreate = {
      name: bookData.name,
    };

    const newBook = bookRepository.create(bookDataToCreate);

    return bookRepository.save(newBook);
  },

  updateBookScoreWithTransaction: async (
    id: number,
    newScore: number,
    queryRunner: QueryRunner
  ): Promise<Book | null> => {
    const bookRepo = queryRunner.manager.getRepository(Book);

    const book = await bookRepo.findOne({
      where: { id },
      relations: ["loans"],
    });

    if (!book) {
      return null;
    }

    // Calculate average score
    const completedLoans = book.loans.filter(
      (loan) => loan.score !== null && loan.score !== undefined
    );
    const totalScores = completedLoans.length;
    if (totalScores > 0) {
      const sumScores = completedLoans.reduce(
        (sum, loan) => sum + (loan.score || 0),
        0
      );
      book.score = (sumScores + newScore) / (totalScores + 1);
    } else {
      book.score = newScore;
    }

    return bookRepo.save(book);
  },
};

export default bookService;
