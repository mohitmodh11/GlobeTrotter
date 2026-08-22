import db from "../db/index.js";

export const getAnalytics = (req, res) => {
  const totalUsers = db
    .prepare(`
      SELECT COUNT(*) AS count
      FROM users
      WHERE role = 'user'
    `)
    .get();

  const totalTrips = db
    .prepare(`
      SELECT COUNT(*) AS count
      FROM trips
    `)
    .get();

  const totalCities = db
    .prepare(`
      SELECT COUNT(*) AS count
      FROM cities
    `)
    .get();

  const totalActivities = db
    .prepare(`
      SELECT COUNT(*) AS count
      FROM activities
    `)
    .get();

  const totalExpenses = db
    .prepare(`
      SELECT COALESCE(SUM(amount), 0) AS total
      FROM expenses
    `)
    .get();

  return res.status(200).json({
    success: true,
    data: {
      totalUsers: totalUsers.count,
      totalTrips: totalTrips.count,
      totalCities: totalCities.count,
      totalActivities: totalActivities.count,
      totalExpenses: totalExpenses.total,
    },
  });
};

export const getUsers = (req, res) => {
  const users = db
    .prepare(`
      SELECT
        id,
        name,
        email,
        role,
        created_at
      FROM users
      ORDER BY created_at DESC
    `)
    .all();

  return res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
};

export const deleteUserByAdmin = (req, res) => {
  const { userId } = req.params;

  const result = db
    .prepare(`
      DELETE FROM users
      WHERE id = ? AND role != 'admin'
    `)
    .run(userId);

  if (result.changes === 0) {
    return res.status(404).json({
      success: false,
      message: "User not found or cannot delete admin.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User deleted successfully.",
  });
};

export const getPopularCities = (req, res) => {
  const cities = db
    .prepare(`
      SELECT
        c.id,
        c.name,
        c.country,
        c.popularity,
        COUNT(ts.id) AS trip_usage
      FROM cities c
      LEFT JOIN trip_stops ts
        ON ts.city_id = c.id
      GROUP BY c.id
      ORDER BY trip_usage DESC, c.popularity DESC
      LIMIT 10
    `)
    .all();

  return res.status(200).json({
    success: true,
    data: cities,
  });
};

export const getPopularActivities = (req, res) => {
  const activities = db
    .prepare(`
      SELECT
        a.id,
        a.name,
        a.type,
        a.cost,
        COUNT(sa.id) AS usage_count
      FROM activities a
      LEFT JOIN stop_activities sa
        ON sa.activity_id = a.id
      GROUP BY a.id
      ORDER BY usage_count DESC
      LIMIT 10
    `)
    .all();

  return res.status(200).json({
    success: true,
    data: activities,
  });
};

export const getTripAnalytics = (req, res) => {
  const trips = db
    .prepare(`
      SELECT
        DATE(created_at) AS date,
        COUNT(*) AS count
      FROM trips
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `)
    .all();

  return res.status(200).json({
    success: true,
    data: trips,
  });
};