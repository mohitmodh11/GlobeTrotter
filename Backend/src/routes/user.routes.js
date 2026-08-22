import { Router } from "express";

import {
  getProfile,
  updateProfile,
  deleteAccount,
} from "../controllers/user.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.get("/me", getProfile);
router.put("/me", updateProfile);
router.delete("/me", deleteAccount);

export default router;