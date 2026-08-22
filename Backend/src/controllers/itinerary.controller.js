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

const buildItinerary = (tripId) => {
  const stops = getStopsByTrip(tripId);

  return stops.map((stop) => ({
    ...stop,
    activities: getActivitiesByStop(stop.id),
  }));
};

export const getItinerary = (req, res) => {
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

  const itinerary = buildItinerary(tripId);

  return res.status(200).json({
    success: true,
    data: {
      trip: ownership.trip,
      stops: itinerary,
    },
  });
};

export const getCalendar = (req, res) => {
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

  const itinerary = buildItinerary(tripId);

  const calendar = [];

  itinerary.forEach((stop) => {
    stop.activities.forEach((activity) => {
      calendar.push({
        id: activity.id,
        stopId: stop.id,
        city: stop.city_name,
        country: stop.country,
        activityId: activity.activity_id,
        name: activity.name,
        type: activity.type,
        date: activity.activity_date,
        startTime: activity.start_time,
        endTime: activity.end_time,
        duration: activity.duration,
        cost:
          activity.custom_cost ??
          activity.cost,
      });
    });
  });

  calendar.sort((a, b) => {
    const dateA = a.date || "";
    const dateB = b.date || "";

    if (dateA !== dateB) {
      return dateA.localeCompare(dateB);
    }

    return (a.startTime || "").localeCompare(
      b.startTime || ""
    );
  });

  return res.status(200).json({
    success: true,
    data: {
      trip: ownership.trip,
      calendar,
    },
  });
};