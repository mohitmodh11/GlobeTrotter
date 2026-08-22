import {
  getActivityById,
  getAllActivities,
  searchActivities,
  createActivity,
} from "../models/activity.model.js";

import {
  addActivityToStop,
  getStopActivityById,
  getActivitiesByStop,
  updateStopActivity,
  deleteStopActivity,
  reorderStopActivities,
} from "../models/stopActivity.model.js";

import { getTripStopById } from "../models/tripStop.model.js";
import { getTripById } from "../models/trip.model.js";

const checkStopOwnership = (stopId, userId) => {
  const stop = getTripStopById(stopId);

  if (!stop) {
    return {
      error: "Stop not found.",
      status: 404,
    };
  }

  const trip = getTripById(stop.trip_id);

  if (!trip) {
    return {
      error: "Trip not found.",
      status: 404,
    };
  }

  if (trip.user_id !== userId) {
    return {
      error: "You do not have access to this stop.",
      status: 403,
    };
  }

  return { stop, trip };
};

export const getActivities = (req, res) => {
  const {
    q = "",
    type = null,
    maxCost = null,
    maxDuration = null,
  } = req.query;

  const hasFilter =
    q ||
    type ||
    maxCost !== null ||
    maxDuration !== null;

  const activities = hasFilter
    ? searchActivities(
        q,
        type,
        maxCost !== null ? Number(maxCost) : null,
        maxDuration !== null ? Number(maxDuration) : null
      )
    : getAllActivities();

  return res.status(200).json({
    success: true,
    count: activities.length,
    data: activities,
  });
};

export const getActivity = (req, res) => {
  const activity = getActivityById(
    req.params.activityId
  );

  if (!activity) {
    return res.status(404).json({
      success: false,
      message: "Activity not found.",
    });
  }

  return res.status(200).json({
    success: true,
    data: activity,
  });
};

export const createNewActivity = (req, res) => {
  const {
    cityId,
    name,
    type,
    description,
    cost,
    duration,
    image,
  } = req.body;

  if (!name || !type) {
    return res.status(400).json({
      success: false,
      message: "Name and type are required.",
    });
  }

  const activity = createActivity(
    cityId || null,
    name,
    type,
    description || null,
    Number(cost) || 0,
    Number(duration) || 0,
    image || null
  );

  return res.status(201).json({
    success: true,
    message: "Activity created successfully.",
    data: activity,
  });
};

export const addActivity = (req, res) => {
  const { stopId } = req.params;

  const {
    activityId,
    activityDate,
    startTime,
    endTime,
    customCost,
    activityOrder,
  } = req.body;

  const ownership = checkStopOwnership(
    stopId,
    req.user.id
  );

  if (ownership.error) {
    return res.status(ownership.status).json({
      success: false,
      message: ownership.error,
    });
  }

  if (!activityId) {
    return res.status(400).json({
      success: false,
      message: "Activity ID is required.",
    });
  }

  const activity = getActivityById(activityId);

  if (!activity) {
    return res.status(404).json({
      success: false,
      message: "Activity not found.",
    });
  }

  const stopActivity = addActivityToStop(
    stopId,
    activityId,
    activityDate || null,
    startTime || null,
    endTime || null,
    customCost !== undefined
      ? Number(customCost)
      : null,
    activityOrder || 0
  );

  return res.status(201).json({
    success: true,
    message: "Activity added to itinerary.",
    data: stopActivity,
  });
};

export const getStopActivities = (req, res) => {
  const { stopId } = req.params;

  const ownership = checkStopOwnership(
    stopId,
    req.user.id
  );

  if (ownership.error) {
    return res.status(ownership.status).json({
      success: false,
      message: ownership.error,
    });
  }

  const activities = getActivitiesByStop(stopId);

  return res.status(200).json({
    success: true,
    count: activities.length,
    data: activities,
  });
};

export const editStopActivity = (req, res) => {
  const { id } = req.params;

  const existing = getStopActivityById(id);

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: "Itinerary activity not found.",
    });
  }

  const ownership = checkStopOwnership(
    existing.stop_id,
    req.user.id
  );

  if (ownership.error) {
    return res.status(ownership.status).json({
      success: false,
      message: ownership.error,
    });
  }

  const {
    activityDate,
    startTime,
    endTime,
    customCost,
  } = req.body;

  const updated = updateStopActivity(
    id,
    activityDate ?? existing.activity_date,
    startTime ?? existing.start_time,
    endTime ?? existing.end_time,
    customCost !== undefined
      ? Number(customCost)
      : existing.custom_cost
  );

  return res.status(200).json({
    success: true,
    message: "Activity updated successfully.",
    data: updated,
  });
};

export const removeStopActivity = (req, res) => {
  const { id } = req.params;

  const existing = getStopActivityById(id);

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: "Itinerary activity not found.",
    });
  }

  const ownership = checkStopOwnership(
    existing.stop_id,
    req.user.id
  );

  if (ownership.error) {
    return res.status(ownership.status).json({
      success: false,
      message: ownership.error,
    });
  }

  deleteStopActivity(id);

  return res.status(200).json({
    success: true,
    message: "Activity removed from itinerary.",
  });
};

export const reorderActivities = (req, res) => {
  const { stopId } = req.params;
  const { activityIds } = req.body;

  const ownership = checkStopOwnership(
    stopId,
    req.user.id
  );

  if (ownership.error) {
    return res.status(ownership.status).json({
      success: false,
      message: ownership.error,
    });
  }

  if (!Array.isArray(activityIds)) {
    return res.status(400).json({
      success: false,
      message: "activityIds must be an array.",
    });
  }

  const activities = reorderStopActivities(
    stopId,
    activityIds
  );

  return res.status(200).json({
    success: true,
    message: "Activities reordered successfully.",
    data: activities,
  });
};