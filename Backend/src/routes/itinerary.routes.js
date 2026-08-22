import { Router } from "express";

import {
  getItinerary,
  getCalendar,
} from "../controllers/itinerary.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();


router.get(
  "/trips/:tripId/itinerary",
  verifyToken,
  getItinerary
);

router.get(
  "/trips/:tripId/calendar",
  verifyToken,
  getCalendar
);

export default router;