import db from "../db/index.js";

export const createActivity = (
  cityId,
  name,
  type,
  description = null,
  cost = 0,
  duration = 0,
  image = null
) => {
  const result = db.prepare(`
    INSERT INTO activities (
      city_id,
      name,
      type,
      description,
      cost,
      duration,
      image
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    cityId,
    name,
    type,
    description,
    cost,
    duration,
    image
  );

  return getActivityById(result.lastInsertRowid);
};

export const getActivityById = (id) => {
  return db.prepare(`
    SELECT
      a.*,
      c.name AS city_name,
      c.country
    FROM activities a
    LEFT JOIN cities c ON c.id = a.city_id
    WHERE a.id = ?
  `).get(id);
};

export const getAllActivities = () => {
  return db.prepare(`
    SELECT
      a.*,
      c.name AS city_name,
      c.country
    FROM activities a
    LEFT JOIN cities c ON c.id = a.city_id
    ORDER BY a.name ASC
  `).all();
};

export const searchActivities = (
  search = "",
  type = null,
  maxCost = null,
  maxDuration = null
) => {
  let query = `
    SELECT
      a.*,
      c.name AS city_name,
      c.country
    FROM activities a
    LEFT JOIN cities c ON c.id = a.city_id
    WHERE (
      a.name LIKE ?
      OR a.type LIKE ?
      OR a.description LIKE ?
    )
  `;

  const params = [
    `%${search}%`,
    `%${search}%`,
    `%${search}%`
  ];

  if (type) {
    query += ` AND a.type = ?`;
    params.push(type);
  }

  if (maxCost !== null) {
    query += ` AND a.cost <= ?`;
    params.push(maxCost);
  }

  if (maxDuration !== null) {
    query += ` AND a.duration <= ?`;
    params.push(maxDuration);
  }

  query += ` ORDER BY a.name ASC`;

  return db.prepare(query).all(...params);
};