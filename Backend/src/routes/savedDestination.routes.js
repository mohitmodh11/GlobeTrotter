import { Router } from "express";

import {
  addSavedDestination,
  getMySavedDestinations,
  deleteSavedDestination,
} from "../controllers/savedDestination.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.post("/", addSavedDestination);

router.get("/", getMySavedDestinations);

router.delete("/:cityId", deleteSavedDestination);

export default router;