import db from "../db/index.js";

export const createCity = (
  name,
  country,
  region = null,
  costIndex = 0,
  popularity = 0,
  image = null,
  description = null
) => {
  const result = db.prepare(`
    INSERT INTO cities (
      name,
      country,
      region,
      cost_index,
      popularity,
      image,
      description
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    name,
    country,
    region,
    costIndex,
    popularity,
    image,
    description
  );

  return getCityById(result.lastInsertRowid);
};

export const getCityById = (id) => {
  return db.prepare(`
    SELECT *
    FROM cities
    WHERE id = ?
  `).get(id);
};

export const searchCities = (search) => {
  const value = `%${search}%`;

  return db.prepare(`
    SELECT *
    FROM cities
    WHERE name LIKE ?
       OR country LIKE ?
       OR region LIKE ?
    ORDER BY popularity DESC
  `).all(value, value, value);
};

export const getAllCities = () => {
  return db.prepare(`
    SELECT *
    FROM cities
    ORDER BY popularity DESC
  `).all();
};