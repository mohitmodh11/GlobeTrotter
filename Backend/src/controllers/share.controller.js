import crypto from "crypto";

import {
  createShare,
  getShareByTripId,
  getShareByShareId,
  deleteShare,
} from "../models/share.model.js";

import { getTripById } from "../models/trip.model.js";
import { getStopsByTrip } from "../models/tripStop.model.js";
import { getActivitiesByStop } from "../models/stopActivity.model.js";

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

const buildPublicTrip = (tripId) => {
  const trip = getTripById(tripId);

  if (!trip) return null;

  const stops = getStopsByTrip(tripId);

  return {
    ...trip,
    stops: stops.map((stop) => ({
      ...stop,
      activities: getActivitiesByStop(stop.id),
    })),
  };
};

export const generateShareLink = (req, res) => {
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

  let share = getShareByTripId(tripId);

  if (!share) {
    const shareId = crypto.randomBytes(16).toString("hex");

    share = createShare(
      tripId,
      shareId
    );
  }

  return res.status(200).json({
    success: true,
    message: "Share link generated successfully.",
    data: {
      shareId: share.share_id,
      shareUrl: `/public/trips/${share.share_id}`,
    },
  });
};

export const getPublicTrip = (req, res) => {
  const { shareId } = req.params;

  const share = getShareByShareId(shareId);

  if (!share) {
    return res.status(404).json({
      success: false,
      message: "Public trip not found.",
    });
  }

  const trip = buildPublicTrip(
    share.trip_id
  );

  return res.status(200).json({
    success: true,
    data: trip,
  });
};

export const removeShareLink = (req, res) => {
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

  deleteShare(tripId);

  return res.status(200).json({
    success: true,
    message: "Share link removed successfully.",
  });
};

export const copyPublicTrip = (req, res) => {
  const { shareId } = req.params;

  const share = getShareByShareId(shareId);

  if (!share) {
    return res.status(404).json({
      success: false,
      message: "Public trip not found.",
    });
  }

  const originalTrip = getTripById(
    share.trip_id
  );

  if (!originalTrip) {
    return res.status(404).json({
      success: false,
      message: "Original trip not found.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Trip is available to copy.",
    data: {
      originalTripId: originalTrip.id,
      name: `${originalTrip.name} - Copy`,
      startDate: originalTrip.start_date,
      endDate: originalTrip.end_date,
      description: originalTrip.description,
    },
  });
};