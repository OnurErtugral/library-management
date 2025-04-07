import { QueryFailedError } from "typeorm";
import { ErrorMessages } from "../constants/errorMessages";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { Loan } from "../entities/Loan";
import { CreateUserParams, UserDetail, UserListItem } from "../types";

const userRepository = AppDataSource.getRepository(User);
const loanRepository = AppDataSource.getRepository(Loan);

const userService = {
  getAllUsers: async (): Promise<User[]> => {
    return await userRepository.find();
  },

  getFormattedUsersList: async (): Promise<UserListItem[]> => {
    const users = await userService.getAllUsers();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
    }));
  },

  getUserById: async (id: number): Promise<User | null> => {
    const user = await userRepository.findOne({
      where: { id },
      relations: ["loans", "loans.book"],
    });

    return user;
  },

  getFormattedUserDetails: async (id: number): Promise<UserDetail | null> => {
    const user = await userService.getUserById(id);

    if (!user) {
      return null;
    }

    const pastBooks = user.loans
      .filter((loan) => loan.returnDate !== null)
      .map((loan) => ({
        name: loan.book.name,
        userScore: loan.score || -1,
      }));

    const presentBooks = user.loans
      .filter((loan) => loan.returnDate === null)
      .map((loan) => ({
        name: loan.book.name,
      }));

    return {
      id: user.id,
      name: user.name,
      books: {
        past: pastBooks,
        present: presentBooks,
      },
    };
  },

  createUser: async (userData: CreateUserParams): Promise<User> => {
    try {
      // Check if user with this name already exists
      const existingUser = await userRepository.findOne({
        where: { name: userData.name },
      });

      if (existingUser) {
        throw new Error(ErrorMessages.USER_NAME_EXISTS);
      }

      const newUser = userRepository.create({
        name: userData.name,
        membershipDate: new Date(),
      });

      return await userRepository.save(newUser);
    } catch (error) {
      // Handle database constraint violations
      if (
        error instanceof QueryFailedError &&
        error.message.includes("duplicate key value violates unique constraint")
      ) {
        throw new Error(ErrorMessages.USER_NAME_EXISTS);
      }
      throw error;
    }
  },
};

export default userService;
