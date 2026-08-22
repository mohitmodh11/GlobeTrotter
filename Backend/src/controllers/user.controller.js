import {
  getUserById,
  updateUser,
  deleteUser,
  updateUserLanguage,
} from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const getProfile = (req, res) => {
  const user = getUserById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required.",
      });
    }

    let profileImage = null;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "globetrotter/users"
      );

      profileImage = uploadResult.secure_url;
    }

    const currentUser = getUserById(req.user.id);

    const updatedUser = updateUser(
      req.user.id,
      name,
      email,
      profileImage || currentUser.profile_image
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

export const changeLanguage = (req, res) => {
  const { language } = req.body;

  const allowedLanguages = ["en", "hi", "gu"];

  if (!language) {
    return res.status(400).json({
      success: false,
      message: "Language is required.",
    });
  }

  if (!allowedLanguages.includes(language)) {
    return res.status(400).json({
      success: false,
      message: "Invalid language. Use en, hi or gu.",
    });
  }

  const user = updateUserLanguage(
    req.user.id,
    language
  );

  return res.status(200).json({
    success: true,
    message: "Language updated successfully.",
    data: user,
  });
};

export const deleteAccount = (req, res) => {
  const result = deleteUser(req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  res.clearCookie("accessToken");

  return res.status(200).json({
    success: true,
    message: "Account deleted successfully.",
  });
};