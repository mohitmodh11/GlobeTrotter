import {
  createExpense,
  getExpenseById,
  getExpensesByTrip,
  updateExpense,
  deleteExpense,
  getBudgetSummary,
} from "../models/expense.model.js";

import { getTripById } from "../models/trip.model.js";

const checkTripOwnership = (tripId, userId) => {
  const trip = getTripById(tripId);

  if (!trip) {
    return {
      error: "Trip not found.",
      status: 404,
    };
  }

  if (trip.user_id !== userId) {
    return {
      error: "You do not have access to this trip.",
      status: 403,
    };
  }

  return { trip };
};

export const addExpense = (req, res) => {
  const { tripId } = req.params;

  const ownership = checkTripOwnership(
    tripId,
    req.user.id
  );

  if (ownership.error) {
    return res.status(ownership.status).json({
      success: false,
      message: ownership.error,
    });
  }

  const {
    category,
    amount,
    description,
    expenseDate,
    stopId,
  } = req.body;

  const allowedCategories = [
    "transport",
    "stay",
    "activities",
    "meals",
  ];

  if (!category || amount === undefined) {
    return res.status(400).json({
      success: false,
      message: "Category and amount are required.",
    });
  }

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid category. Use transport, stay, activities or meals.",
    });
  }

  if (Number(amount) < 0) {
    return res.status(400).json({
      success: false,
      message: "Amount cannot be negative.",
    });
  }

  const expense = createExpense(
    tripId,
    category,
    Number(amount),
    description || null,
    expenseDate || null,
    stopId || null
  );

  return res.status(201).json({
    success: true,
    message: "Expense added successfully.",
    data: expense,
  });
};

export const getTripExpenses = (req, res) => {
  const { tripId } = req.params;

  const ownership = checkTripOwnership(
    tripId,
    req.user.id
  );

  if (ownership.error) {
    return res.status(ownership.status).json({
      success: false,
      message: ownership.error,
    });
  }

  const expenses = getExpensesByTrip(tripId);

  return res.status(200).json({
    success: true,
    count: expenses.length,
    data: expenses,
  });
};

export const getBudget = (req, res) => {
  const { tripId } = req.params;

  const ownership = checkTripOwnership(
    tripId,
    req.user.id
  );

  if (ownership.error) {
    return res.status(ownership.status).json({
      success: false,
      message: ownership.error,
    });
  }

  const summary = getBudgetSummary(tripId);

  const start = new Date(ownership.trip.start_date);
  const end = new Date(ownership.trip.end_date);

  const days = Math.max(
    1,
    Math.ceil(
      (end - start) /
        (1000 * 60 * 60 * 24)
    ) + 1
  );

  return res.status(200).json({
    success: true,
    data: {
      total: summary.total,
      averagePerDay:
        Number(summary.total) / days,
      breakdown: summary.breakdown,
      days,
    },
  });
};

export const editExpense = (req, res) => {
  const { expenseId } = req.params;

  const expense = getExpenseById(expenseId);

  if (!expense) {
    return res.status(404).json({
      success: false,
      message: "Expense not found.",
    });
  }

  const ownership = checkTripOwnership(
    expense.trip_id,
    req.user.id
  );

  if (ownership.error) {
    return res.status(ownership.status).json({
      success: false,
      message: ownership.error,
    });
  }

  const {
    category,
    amount,
    description,
    expenseDate,
    stopId,
  } = req.body;

  const updated = updateExpense(
    expenseId,
    category ?? expense.category,
    amount !== undefined
      ? Number(amount)
      : expense.amount,
    description ?? expense.description,
    expenseDate ?? expense.expense_date,
    stopId ?? expense.stop_id
  );

  return res.status(200).json({
    success: true,
    message: "Expense updated successfully.",
    data: updated,
  });
};

export const removeExpense = (req, res) => {
  const { expenseId } = req.params;

  const expense = getExpenseById(expenseId);

  if (!expense) {
    return res.status(404).json({
      success: false,
      message: "Expense not found.",
    });
  }

  const ownership = checkTripOwnership(
    expense.trip_id,
    req.user.id
  );

  if (ownership.error) {
    return res.status(ownership.status).json({
      success: false,
      message: ownership.error,
    });
  }

  deleteExpense(expenseId);

  return res.status(200).json({
    success: true,
    message: "Expense deleted successfully.",
  });
};