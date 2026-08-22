import db from "../db/index.js";

export const createExpense = (
  tripId,
  category,
  amount,
  description = null,
  expenseDate = null,
  stopId = null
) => {
  const result = db.prepare(`
    INSERT INTO expenses (
      trip_id,
      stop_id,
      category,
      amount,
      description,
      expense_date
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    tripId,
    stopId,
    category,
    amount,
    description,
    expenseDate
  );

  return getExpenseById(result.lastInsertRowid);
};

export const getExpenseById = (id) => {
  return db.prepare(`
    SELECT *
    FROM expenses
    WHERE id = ?
  `).get(id);
};

export const getExpensesByTrip = (tripId) => {
  return db.prepare(`
    SELECT *
    FROM expenses
    WHERE trip_id = ?
    ORDER BY expense_date ASC, created_at ASC
  `).all(tripId);
};

export const updateExpense = (
  id,
  category,
  amount,
  description,
  expenseDate,
  stopId
) => {
  db.prepare(`
    UPDATE expenses
    SET category = ?,
        amount = ?,
        description = ?,
        expense_date = ?,
        stop_id = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    category,
    amount,
    description,
    expenseDate,
    stopId,
    id
  );

  return getExpenseById(id);
};

export const deleteExpense = (id) => {
  return db.prepare(`
    DELETE FROM expenses
    WHERE id = ?
  `).run(id);
};

export const getBudgetSummary = (tripId) => {
  const total = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM expenses
    WHERE trip_id = ?
  `).get(tripId);

  const breakdown = db.prepare(`
    SELECT
      category,
      SUM(amount) AS total
    FROM expenses
    WHERE trip_id = ?
    GROUP BY category
    ORDER BY total DESC
  `).all(tripId);

  return {
    total: total.total,
    breakdown
  };
};