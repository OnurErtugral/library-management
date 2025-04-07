import express from "express";
import userController from "../controllers/userController";
import { validate } from "../middleware/validation";
import { validateId } from "../middleware/paramValidation";
import { createUserSchema } from "../validations";

const router = express.Router();

// GET /users - Get all users
router.get("/", userController.getAllUsers);

// GET /users/:id - Get user by ID
router.get("/:id", validateId(), userController.getUserById);

// POST /users - Create new user
router.post("/", validate(createUserSchema), userController.createUser);

export default router;
