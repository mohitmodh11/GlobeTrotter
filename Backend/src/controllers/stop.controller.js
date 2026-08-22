import {
  createTripStop,
  getTripStopById,
  getStopsByTrip,
  updateTripStop,
  deleteTripStop,
  reorderTripStops,
} from "../models/tripStop.model.js";

import { getTripById } from "../models/trip.model.js";

const checkTripOwnership = (tripId, userId) => {
  const trip = getTripById(tripId);

  if (!trip) {
    return {
      error: "Trip not found.",
      status: 404,
    };
  }

  if (trip.user_id !== userId) {
    return {
      error: "You do not have access to this trip.",
      status: 403,
    };
  }

  return { trip };
};

export const addStop = (req, res) => {
  const { cityId, startDate, endDate, stopOrder } = req.body;
  const { tripId } = req.params;

  const ownership = checkTripOwnership(
    tripId,
    req.user.id
  );

  if (ownership.error) {
    return res.status(ownership.status).json({
      success: false,
      message: ownership.error,
    });
  }

  if (!cityId || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "City, start date and end date are required.",
    });
  }

  const stop = createTripStop(
    tripId,
    cityId,
    startDate,
    endDate,
    stopOrder || 0
  );

  return res.status(201).json({
    success: true,
    message: "Stop added successfully.",
    data: stop,
  });
};

export const getTripStops = (req, res) => {
  const { tripId } = req.params;

  const ownership = checkTripOwnership(
    tripId,
    req.user.id
  );

  if (ownership.error) {
    return res.status(ownership.status).json({
      success: false,
      message: ownership.error,
    });
  }

  const stops = getStopsByTrip(tripId);

  return res.status(200).json({
    success: true,
    count: stops.length,
    data: stops,
  });
};

export const editStop = (req, res) => {
  const { stopId } = req.params;
  const { cityId, startDate, endDate } = req.body;

  const stop = getTripStopById(stopId);

  if (!stop) {
    return res.status(404).json({
      success: false,
      message: "Stop not found.",
    });
  }

  const ownership = checkTripOwnership(
    stop.trip_id,
    req.user.id
  );

  if (ownership.error) {
    return res.status(ownership.status).json({
      success: false,
      message: ownership.error,
    });
  }

  if (!cityId || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "City, start date and end date are required.",
    });
  }

  const updatedStop = updateTripStop(
    stopId,
    cityId,
    startDate,
    endDate
  );

  return res.status(200).json({
    success: true,
    message: "Stop updated successfully.",
    data: updatedStop,
  });
};

export const removeStop = (req, res) => {
  const { stopId } = req.params;

  const stop = getTripStopById(stopId);

  if (!stop) {
    return res.status(404).json({
      success: false,
      message: "Stop not found.",
    });
  }

  const ownership = checkTripOwnership(
    stop.trip_id,
    req.user.id
  );

  if (ownership.error) {
    return res.status(ownership.status).json({
      success: false,
      message: ownership.error,
    });
  }

  deleteTripStop(stopId);

  return res.status(200).json({
    success: true,
    message: "Stop deleted successfully.",
  });
};

export const reorderStops = (req, res) => {
  const { tripId } = req.params;
  const { stopIds } = req.body;

  const ownership = checkTripOwnership(
    tripId,
    req.user.id
  );

  if (ownership.error) {
    return res.status(ownership.status).json({
      success: false,
      message: ownership.error,
    });
  }

  if (!Array.isArray(stopIds)) {
    return res.status(400).json({
      success: false,
      message: "stopIds must be an array.",
    });
  }

  const stops = reorderTripStops(
    tripId,
    stopIds
  );

  return res.status(200).json({
    success: true,
    message: "Stops reordered successfully.",
    data: stops,
  });
};