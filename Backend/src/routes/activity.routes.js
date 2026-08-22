import { Router } from "express";

import {
  getActivities,
  getActivity,
  createNewActivity,
  addActivity,
  getStopActivities,
  editStopActivity,
  removeStopActivity,
  reorderActivities,
} from "../controllers/activity.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getActivities);

router.post("/", verifyToken, createNewActivity);

router.post(
  "/stops/:stopId",
  verifyToken,
  addActivity
);

router.get(
  "/stops/:stopId",
  verifyToken,
  getStopActivities
);

router.put(
  "/stops/:stopId/reorder",
  verifyToken,
  reorderActivities
);

router.put(
  "/stop-activities/:id",
  verifyToken,
  editStopActivity
);

router.delete(
  "/stop-activities/:id",
  verifyToken,
  removeStopActivity
);

router.get("/:activityId", getActivity);

export default router;