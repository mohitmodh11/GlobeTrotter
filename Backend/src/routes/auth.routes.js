import { Router } from "express";

import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/register",
  upload.single("photo"),
  register
);

router.post(
  "/login",
  login
);

router.post(
  "/logout",
  verifyToken,
  logout
);

router.get(
  "/me",
  verifyToken,
  getMe
);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password/:token",
  resetPassword
);

export default router;