import db from "../db/index.js";

export const createShare = (tripId, shareId) => {
  const result = db.prepare(`
    INSERT INTO shares (
      trip_id,
      share_id
    )
    VALUES (?, ?)
  `).run(tripId, shareId);

  return getShareById(result.lastInsertRowid);
};

export const getShareById = (id) => {
  return db.prepare(`
    SELECT *
    FROM shares
    WHERE id = ?
  `).get(id);
};

export const getShareByTripId = (tripId) => {
  return db.prepare(`
    SELECT *
    FROM shares
    WHERE trip_id = ?
  `).get(tripId);
};

export const getShareByShareId = (shareId) => {
  return db.prepare(`
    SELECT
      s.*,
      t.name AS trip_name,
      t.user_id
    FROM shares s
    JOIN trips t ON t.id = s.trip_id
    WHERE s.share_id = ?
  `).get(shareId);
};

export const deleteShare = (tripId) => {
  return db.prepare(`
    DELETE FROM shares
    WHERE trip_id = ?
  `).run(tripId);
};