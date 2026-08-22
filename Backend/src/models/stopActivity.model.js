import db from "../db/index.js";

export const addActivityToStop = (
  stopId,
  activityId,
  activityDate = null,
  startTime = null,
  endTime = null,
  customCost = null,
  activityOrder = 0
) => {
  const result = db.prepare(`
    INSERT INTO stop_activities (
      stop_id,
      activity_id,
      activity_date,
      start_time,
      end_time,
      custom_cost,
      activity_order
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    stopId,
    activityId,
    activityDate,
    startTime,
    endTime,
    customCost,
    activityOrder
  );

  return getStopActivityById(result.lastInsertRowid);
};

export const getStopActivityById = (id) => {
  return db.prepare(`
    SELECT
      sa.*,
      a.name,
      a.type,
      a.description,
      a.cost,
      a.duration,
      a.image
    FROM stop_activities sa
    JOIN activities a ON a.id = sa.activity_id
    WHERE sa.id = ?
  `).get(id);
};

export const getActivitiesByStop = (stopId) => {
  return db.prepare(`
    SELECT
      sa.*,
      a.name,
      a.type,
      a.description,
      a.cost,
      a.duration,
      a.image
    FROM stop_activities sa
    JOIN activities a ON a.id = sa.activity_id
    WHERE sa.stop_id = ?
    ORDER BY sa.activity_order ASC
  `).all(stopId);
};

export const updateStopActivity = (
  id,
  activityDate,
  startTime,
  endTime,
  customCost
) => {
  db.prepare(`
    UPDATE stop_activities
    SET activity_date = ?,
        start_time = ?,
        end_time = ?,
        custom_cost = ?
    WHERE id = ?
  `).run(
    activityDate,
    startTime,
    endTime,
    customCost,
    id
  );

  return getStopActivityById(id);
};

export const deleteStopActivity = (id) => {
  return db.prepare(`
    DELETE FROM stop_activities
    WHERE id = ?
  `).run(id);
};

export const reorderStopActivities = (
  stopId,
  activityIds
) => {
  const update = db.prepare(`
    UPDATE stop_activities
    SET activity_order = ?
    WHERE id = ? AND stop_id = ?
  `);

  const transaction = db.transaction(() => {
    activityIds.forEach((id, index) => {
      update.run(index, id, stopId);
    });
  });

  transaction();

  return getActivitiesByStop(stopId);
};