import { Router } from "express";

import {
  generateShareLink,
  getPublicTrip,
  removeShareLink,
  copyPublicTrip,
} from "../controllers/share.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/trips/:tripId/share",
  verifyToken,
  generateShareLink
);

router.delete(
  "/trips/:tripId/share",
  verifyToken,
  removeShareLink
);

router.get(
  "/public/trips/:shareId",
  getPublicTrip
);

router.post(
  "/public/trips/:shareId/copy",
  verifyToken,
  copyPublicTrip
);

export default router;