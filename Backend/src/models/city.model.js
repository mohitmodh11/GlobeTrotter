import db from "../db/index.js";

export const getCityById = (id) => {
  return db
    .prepare(
      `
      SELECT *
      FROM cities
      WHERE id = ?
    `
    )
    .get(id);
};

export const findCityByNameAndCountry = (name, country) => {
  return db
    .prepare(
      `
      SELECT *
      FROM cities
      WHERE name = ? AND country = ?
    `
    )
    .get(name, country);
};

export const saveSelectedCity = (
  name,
  country,
  countryCode,
  region,
  latitude,
  longitude,
  timezone,
  population
) => {
  const existingCity = findCityByNameAndCountry(name, country);

  if (existingCity) {
    return existingCity;
  }

  const result = db
    .prepare(
      `
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
    `
    )
    .run(name, country, region || null, 0, population || 0, null, null);

  return getCityById(result.lastInsertRowid);
};
