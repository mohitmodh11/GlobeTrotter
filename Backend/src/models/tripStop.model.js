import db from "../db/index.js";

export const createTripStop = (
  tripId,
  cityId,
  startDate,
  endDate,
  stopOrder = 0
) => {
  const result = db.prepare(`
    INSERT INTO trip_stops (
      trip_id,
      city_id,
      start_date,
      end_date,
      stop_order
    )
    VALUES (?, ?, ?, ?, ?)
  `).run(
    tripId,
    cityId,
    startDate,
    endDate,
    stopOrder
  );

  return getTripStopById(result.lastInsertRowid);
};

export const getTripStopById = (id) => {
  return db.prepare(`
    SELECT
      ts.*,
      c.name AS city_name,
      c.country,
      c.cost_index,
      c.popularity,
      c.image AS city_image
    FROM trip_stops ts
    JOIN cities c ON c.id = ts.city_id
    WHERE ts.id = ?
  `).get(id);
};

export const getStopsByTrip = (tripId) => {
  return db.prepare(`
    SELECT
      ts.*,
      c.name AS city_name,
      c.country,
      c.cost_index,
      c.popularity,
      c.image AS city_image
    FROM trip_stops ts
    JOIN cities c ON c.id = ts.city_id
    WHERE ts.trip_id = ?
    ORDER BY ts.stop_order ASC
  `).all(tripId);
};

export const updateTripStop = (
  id,
  cityId,
  startDate,
  endDate
) => {
  db.prepare(`
    UPDATE trip_stops
    SET city_id = ?,
        start_date = ?,
        end_date = ?
    WHERE id = ?
  `).run(
    cityId,
    startDate,
    endDate,
    id
  );

  return getTripStopById(id);
};

export const deleteTripStop = (id) => {
  return db.prepare(`
    DELETE FROM trip_stops
    WHERE id = ?
  `).run(id);
};

export const reorderTripStops = (tripId, stopIds) => {
  const update = db.prepare(`
    UPDATE trip_stops
    SET stop_order = ?
    WHERE id = ? AND trip_id = ?
  `);

  const transaction = db.transaction(() => {
    stopIds.forEach((stopId, index) => {
      update.run(index, stopId, tripId);
    });
  });

  transaction();

  return getStopsByTrip(tripId);
};