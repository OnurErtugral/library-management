import express from "express";
import userRoutes from "./userRoutes";
import bookRoutes from "./bookRoutes";
import loanRoutes from "./loanRoutes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/books", bookRoutes);
// Add loan routes under users (for borrow/return functionality)
router.use("/users", loanRoutes);

export default router;
