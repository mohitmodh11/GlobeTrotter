import { Router } from "express";

import {
  addExpense,
  getTripExpenses,
  getBudget,
  editExpense,
  removeExpense,
} from "../controllers/expense.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();


router.post(
  "/trips/:tripId/expenses",
  verifyToken,
  addExpense
);

router.get(
  "/trips/:tripId/expenses",
  verifyToken,
  getTripExpenses
);

router.get(
  "/trips/:tripId/budget",
  verifyToken,
  getBudget
);

router.put(
  "/expenses/:expenseId",
  verifyToken,
  editExpense
);

router.delete(
  "/expenses/:expenseId",
  verifyToken,
  removeExpense
);

export default router;