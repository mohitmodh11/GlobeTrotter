import { Router } from "express";

import {
  addStop,
  getTripStops,
  editStop,
  removeStop,
  reorderStops,
} from "../controllers/stop.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/trips/:tripId/stops",
  verifyToken,
  addStop
);

router.get(
  "/trips/:tripId/stops",
  verifyToken,
  getTripStops
);

router.put(
  "/stops/:stopId",
  verifyToken,
  editStop
);

router.delete(
  "/stops/:stopId",
  verifyToken,
  removeStop
);

router.put(
  "/trips/:tripId/stops/reorder",
  verifyToken,
  reorderStops
);

export default router;