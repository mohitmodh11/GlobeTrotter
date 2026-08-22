import db from "../db/index.js";

export const saveDestination = (userId, cityId) => {
  const result = db.prepare(`
    INSERT INTO saved_destinations (user_id, city_id)
    VALUES (?, ?)
  `).run(userId, cityId);

  return getSavedDestinationById(result.lastInsertRowid);
};

export const getSavedDestinationById = (id) => {
  return db.prepare(`
    SELECT
      sd.id,
      sd.user_id,
      sd.city_id,
      sd.created_at,
      c.name,
      c.country,
      c.region,
      c.image,
      c.description
    FROM saved_destinations sd
    JOIN cities c ON c.id = sd.city_id
    WHERE sd.id = ?
  `).get(id);
};

export const getSavedDestinations = (userId) => {
  return db.prepare(`
    SELECT
      sd.id,
      sd.city_id,
      sd.created_at,
      c.name,
      c.country,
      c.region,
      c.image,
      c.description
    FROM saved_destinations sd
    JOIN cities c ON c.id = sd.city_id
    WHERE sd.user_id = ?
    ORDER BY sd.created_at DESC
  `).all(userId);
};

export const removeSavedDestination = (userId, cityId) => {
  return db.prepare(`
    DELETE FROM saved_destinations
    WHERE user_id = ? AND city_id = ?
  `).run(userId, cityId);
};