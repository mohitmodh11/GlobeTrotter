import { Router } from "express";

import {
  getProfile,
  updateProfile,
  deleteAccount,
  changeLanguage,
} from "../controllers/user.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyToken);

router.get("/me", getProfile);

router.put(
  "/me",
  upload.single("photo"),
  updateProfile
);

router.put(
  "/language",
  changeLanguage
);

router.delete("/me", deleteAccount);

export default router;