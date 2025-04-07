import { Request, Response } from "express";
import { ErrorMessages } from "../constants/errorMessages";
import userService from "../services/userService";
import { CreateUserParams, UserDetail, UserListItem } from "../types";

const userController = {
  getAllUsers: async (
    req: Request,
    res: Response<UserListItem[] | { message: string }>
  ) => {
    try {
      const formattedUsers = await userService.getFormattedUsersList();
      res.status(200).json(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: ErrorMessages.FAILED_TO_FETCH_USERS });
    }
  },

  getUserById: async (
    req: Request,
    res: Response<UserDetail | { message: string }>
  ) => {
    try {
      const userId = parseInt(req.params.id);
      const formattedUser = await userService.getFormattedUserDetails(userId);

      if (!formattedUser) {
        return res.status(404).json({ message: ErrorMessages.USER_NOT_FOUND });
      }

      res.status(200).json(formattedUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: ErrorMessages.FAILED_TO_FETCH_USERS });
    }
  },

  createUser: async (req: Request<{}, {}, CreateUserParams>, res: Response) => {
    try {
      const userData = req.body;

      await userService.createUser(userData);
      res.status(201).json();
    } catch (error) {
      console.error("Error creating user:", error);

      // Check for duplicate name error
      if ((error as Error).message === ErrorMessages.USER_NAME_EXISTS) {
        return res
          .status(409)
          .json({ message: ErrorMessages.USER_NAME_EXISTS });
      }

      res.status(500).json({ message: ErrorMessages.FAILED_TO_CREATE_USER });
    }
  },
};

export default userController;
