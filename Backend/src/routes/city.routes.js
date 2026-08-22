import { Router } from "express";

import {
  searchCity,
  getCity,
  saveCity,
} from "../controllers/city.controller.js";

const router = Router();

router.get("/search", searchCity);
router.get("/:cityId", getCity);
router.post("/", saveCity);

export default router;