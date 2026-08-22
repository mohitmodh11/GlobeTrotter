import {
  createTrip,
  getTripById,
  getTripsByUser,
  updateTrip,
  deleteTrip,
} from "../models/trip.model.js";

import {
  createTripStop,
  getTripStopById,
  getStopsByTrip,
  updateTripStop,
  deleteTripStop,
  reorderTripStops,
} from "../models/tripStop.model.js";

import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const createNewTrip = async (req, res) => {
  const { name, startDate, endDate, description } = req.body;

  if (!name || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "Name, start date and end date are required.",
    });
  }

  if (new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({
      success: false,
      message: "Start date cannot be after end date.",
    });
  }

  let coverPhotoUrl = null;

  if (req.file) {
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "globetrotter/trips"
    );

    coverPhotoUrl = uploadResult.secure_url;
  }

  const trip = createTrip(
    req.user.id,
    name,
    startDate,
    endDate,
    description || null,
    coverPhotoUrl
  );

  return res.status(201).json({
    success: true,
    message: "Trip created successfully.",
    data: trip,
  });
};

export const getMyTrips = (req, res) => {
  const trips = getTripsByUser(req.user.id);

  return res.status(200).json({
    success: true,
    count: trips.length,
    data: trips,
  });
};

export const getTrip = (req, res) => {
  const trip = getTripById(req.params.tripId);

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: "Trip not found.",
    });
  }

  if (trip.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to this trip.",
    });
  }

  return res.status(200).json({
    success: true,
    data: trip,
  });
};

export const editTrip = (req, res) => {
  const trip = getTripById(req.params.tripId);

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: "Trip not found.",
    });
  }

  if (trip.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to this trip.",
    });
  }

  const { name, startDate, endDate, description, coverPhoto } = req.body;

  if (!name || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "Name, start date and end date are required.",
    });
  }

  const updatedTrip = updateTrip(
    trip.id,
    name,
    startDate,
    endDate,
    description || null,
    coverPhoto || null
  );

  return res.status(200).json({
    success: true,
    message: "Trip updated successfully.",
    data: updatedTrip,
  });
};

export const removeTrip = (req, res) => {
  const trip = getTripById(req.params.tripId);

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: "Trip not found.",
    });
  }

  if (trip.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to this trip.",
    });
  }

  deleteTrip(trip.id);

  return res.status(200).json({
    success: true,
    message: "Trip deleted successfully.",
  });
};

export const addTripStop = (req, res) => {
  const { tripId } = req.params;

  const trip = getTripById(tripId);

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: "Trip not found.",
    });
  }

  if (trip.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to this trip.",
    });
  }

  const { cityId, startDate, endDate, stopOrder } = req.body;

  if (!cityId || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "City, start date and end date are required.",
    });
  }

  if (new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({
      success: false,
      message: "Stop start date cannot be after end date.",
    });
  }

  if (
    new Date(startDate) < new Date(trip.start_date) ||
    new Date(endDate) > new Date(trip.end_date)
  ) {
    return res.status(400).json({
      success: false,
      message: "Stop dates must be within trip dates.",
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
    message: "Trip stop added successfully.",
    data: stop,
  });
};

export const getTripStops = (req, res) => {
  const { tripId } = req.params;

  const trip = getTripById(tripId);

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: "Trip not found.",
    });
  }

  if (trip.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to this trip.",
    });
  }

  const stops = getStopsByTrip(tripId);

  return res.status(200).json({
    success: true,
    count: stops.length,
    data: stops,
  });
};

export const editTripStop = (req, res) => {
  const { stopId } = req.params;

  const stop = getTripStopById(stopId);

  if (!stop) {
    return res.status(404).json({
      success: false,
      message: "Trip stop not found.",
    });
  }

  const trip = getTripById(stop.trip_id);

  if (!trip || trip.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to this stop.",
    });
  }

  const { cityId, startDate, endDate } = req.body;

  if (!cityId || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "City, start date and end date are required.",
    });
  }

  if (new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({
      success: false,
      message: "Stop start date cannot be after end date.",
    });
  }

  const updatedStop = updateTripStop(stopId, cityId, startDate, endDate);

  return res.status(200).json({
    success: true,
    message: "Trip stop updated successfully.",
    data: updatedStop,
  });
};

export const removeTripStop = (req, res) => {
  const { stopId } = req.params;

  const stop = getTripStopById(stopId);

  if (!stop) {
    return res.status(404).json({
      success: false,
      message: "Trip stop not found.",
    });
  }

  const trip = getTripById(stop.trip_id);

  if (!trip || trip.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to this stop.",
    });
  }

  deleteTripStop(stopId);

  return res.status(200).json({
    success: true,
    message: "Trip stop removed successfully.",
  });
};

export const reorderTripStopsController = (req, res) => {
  const { tripId } = req.params;
  const { stopIds } = req.body;

  const trip = getTripById(tripId);

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: "Trip not found.",
    });
  }

  if (trip.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to this trip.",
    });
  }

  if (!Array.isArray(stopIds)) {
    return res.status(400).json({
      success: false,
      message: "stopIds must be an array.",
    });
  }

  const stops = reorderTripStops(tripId, stopIds);

  return res.status(200).json({
    success: true,
    message: "Trip stops reordered successfully.",
    data: stops,
  });
};
