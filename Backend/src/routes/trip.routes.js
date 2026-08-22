import { Router } from "express";

import {
  createNewTrip,
  getMyTrips,
  getTrip,
  editTrip,
  removeTrip,

  addTripStop,
  getTripStops,
  editTripStop,
  removeTripStop,
  reorderTripStopsController,
} from "../controllers/trip.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/",
  verifyToken,
  upload.single("coverPhoto"),
  createNewTrip
);

router.get(
  "/",
  verifyToken,
  getMyTrips
);

router.get(
  "/:tripId",
  verifyToken,
  getTrip
);

router.put(
  "/:tripId",
  verifyToken,
  editTrip
);

router.delete(
  "/:tripId",
  verifyToken,
  removeTrip
);

// Trip Stops

router.post(
  "/:tripId/stops",
  verifyToken,
  addTripStop
);

router.get(
  "/:tripId/stops",
  verifyToken,
  getTripStops
);

router.put(
  "/:tripId/stops/reorder",
  verifyToken,
  reorderTripStopsController
);

router.put(
  "/stops/:stopId",
  verifyToken,
  editTripStop
);

router.delete(
  "/stops/:stopId",
  verifyToken,
  removeTripStop
);

export default router;