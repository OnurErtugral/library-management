import { Request, Response } from "express";
import { ErrorMessages } from "../constants/errorMessages";
import bookService from "../services/bookService";
import { BookDetail, BookListItem, CreateBookParams } from "../types";

const bookController = {
  getAllBooks: async (
    req: Request,
    res: Response<BookListItem[] | { message: string }>
  ) => {
    try {
      const formattedBooks = await bookService.getFormattedBooksList();
      res.status(200).json(formattedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: ErrorMessages.FAILED_TO_FETCH_BOOKS });
    }
  },

  getBookById: async (
    req: Request,
    res: Response<BookDetail | { message: string }>
  ) => {
    try {
      const bookId = parseInt(req.params.id);
      const formattedBook = await bookService.getFormattedBookDetails(bookId);

      if (!formattedBook) {
        return res.status(404).json({ message: ErrorMessages.BOOK_NOT_FOUND });
      }

      res.status(200).json(formattedBook);
    } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).json({ message: ErrorMessages.FAILED_TO_FETCH_BOOKS });
    }
  },

  createBook: async (req: Request<{}, {}, CreateBookParams>, res: Response) => {
    try {
      const bookData = req.body;

      await bookService.createBook(bookData);
      res.status(201).json();
    } catch (error) {
      console.error("Error creating book:", error);
      res.status(500).json({ message: ErrorMessages.FAILED_TO_CREATE_BOOK });
    }
  },
};

export default bookController;
