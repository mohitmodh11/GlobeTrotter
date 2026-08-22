import db from "../db/index.js";

export const createTrip = (
  userId,
  name,
  startDate,
  endDate,
  description = null,
  coverPhoto = null
) => {
  const result = db.prepare(`
    INSERT INTO trips (
      user_id,
      name,
      start_date,
      end_date,
      description,
      cover_photo
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    name,
    startDate,
    endDate,
    description,
    coverPhoto
  );

  return getTripById(result.lastInsertRowid);
};

export const getTripById = (id) => {
  return db.prepare(`
    SELECT *
    FROM trips
    WHERE id = ?
  `).get(id);
};

export const getTripsByUser = (userId) => {
  return db.prepare(`
    SELECT *
    FROM trips
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(userId);
};

export const updateTrip = (
  id,
  name,
  startDate,
  endDate,
  description,
  coverPhoto
) => {
  db.prepare(`
    UPDATE trips
    SET name = ?,
        start_date = ?,
        end_date = ?,
        description = ?,
        cover_photo = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    name,
    startDate,
    endDate,
    description,
    coverPhoto,
    id
  );

  return getTripById(id);
};

export const deleteTrip = (id) => {
  return db.prepare(`
    DELETE FROM trips
    WHERE id = ?
  `).run(id);
};

export const setTripPublic = (id, isPublic) => {
  db.prepare(`
    UPDATE trips
    SET is_public = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(isPublic ? 1 : 0, id);

  return getTripById(id);
};