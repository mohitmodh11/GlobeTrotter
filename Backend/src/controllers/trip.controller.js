import {
  createTrip,
  getTripById,
  getTripsByUser,
  updateTrip,
  deleteTrip,
} from "../models/trip.model.js";

export const createNewTrip = (req, res) => {
  const {
    name,
    startDate,
    endDate,
    description,
    coverPhoto,
  } = req.body;

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

  const trip = createTrip(
    req.user.id,
    name,
    startDate,
    endDate,
    description || null,
    coverPhoto || null
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

  const {
    name,
    startDate,
    endDate,
    description,
    coverPhoto,
  } = req.body;

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