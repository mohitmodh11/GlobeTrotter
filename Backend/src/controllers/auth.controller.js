import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  createUser,
  getUserByEmail,
  getUserByUsername,
  getUserById,
  updateUserPassword,
} from "../models/user.model.js";

import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

export const register = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      confirmPassword,
    } = req.body;

    if (
      !name ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, username, email, password and confirm password are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }

    const existingEmail = getUserByEmail(email);

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const existingUsername =
      getUserByUsername(username);

    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "Username already exists.",
      });
    }

    let profileImageUrl = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "globetrotter/users"
      );
      profileImageUrl = uploadResult.secure_url;
    }

    const hashedPassword = bcrypt.hashSync(
      password,
      10
    );

    const user = createUser(
      name,
      username,
      email,
      hashedPassword,
      profileImageUrl
    );

    const token = generateToken(user);

    res.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure:
        process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Username/email and password are required.",
      });
    }

    let user = getUserByEmail(identifier);

    if (!user) {
      user = getUserByUsername(identifier);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username/email or password.",
      });
    }

    const isPasswordValid =
      bcrypt.compareSync(
        password,
        user.password
      );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username/email or password.",
      });
    }

    const token = generateToken(user);

    res.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure:
        process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const safeUser = getUserById(user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user: safeUser,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("accessToken");

  return res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
};

export const getMe = (req, res) => {
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

export const forgotPassword = (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = getUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist.",
      });
    }

    const resetToken = jwt.sign(
      {
        id: user.id,
        purpose: "password-reset",
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset token generated.",
      data: {
        resetToken,
      },
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process forgot password request.",
    });
  }
};

export const resetPassword = (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (decoded.purpose !== "password-reset") {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token.",
      });
    }

    const user = getUserById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    updateUserPassword(user.id, hashedPassword);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to reset password.",
    });
  }
};