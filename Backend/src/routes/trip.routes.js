import { Router } from "express";

import {
  createNewTrip,
  getMyTrips,
  getTrip,
  editTrip,
  removeTrip,
} from "../controllers/trip.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.post("/", createNewTrip);
router.get("/", getMyTrips);
router.get("/:tripId", getTrip);
router.put("/:tripId", editTrip);
router.delete("/:tripId", removeTrip);

export default router;