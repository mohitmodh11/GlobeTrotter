import {
  getUserById,
  updateUser,
  deleteUser,
} from "../models/user.model.js";

export const getProfile = (req, res) => {
  const user =
    getUserById(req.user.id);

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

export const updateProfile = (
  req,
  res
) => {
  const {
    name,
    email,
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message:
        "Name and email are required.",
    });
  }

  const user = updateUser(
    req.user.id,
    name,
    email
  );

  return res.status(200).json({
    success: true,
    message:
      "Profile updated successfully.",
    data: user,
  });
};

export const deleteAccount = (
  req,
  res
) => {
  const result =
    deleteUser(req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  res.clearCookie(
    "accessToken"
  );

  return res.status(200).json({
    success: true,
    message:
      "Account deleted successfully.",
  });
};