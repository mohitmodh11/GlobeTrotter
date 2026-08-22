import { Router } from "express";

import {
  searchCity,
  getCity,
} from "../controllers/city.controller.js";

const router = Router();

router.get("/search", searchCity);
router.get("/:cityId", getCity);

export default router;