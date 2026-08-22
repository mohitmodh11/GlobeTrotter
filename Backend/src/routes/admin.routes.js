import { Router } from "express";

import {
  getAnalytics,
  getUsers,
  deleteUserByAdmin,
  getPopularCities,
  getPopularActivities,
  getTripAnalytics,
} from "../controllers/admin.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.use(
  verifyToken,
  verifyAdmin
);

router.get(
  "/analytics",
  getAnalytics
);

router.get(
  "/users",
  getUsers
);

router.delete(
  "/users/:userId",
  deleteUserByAdmin
);

router.get(
  "/popular-cities",
  getPopularCities
);

router.get(
  "/popular-activities",
  getPopularActivities
);

router.get(
  "/trip-analytics",
  getTripAnalytics
);

export default router;