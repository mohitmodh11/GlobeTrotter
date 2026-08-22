import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  createUser,
  getUserByEmail,
  getUserByUsername,
  getUserById,
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile photo is required.",
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

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "globetrotter/users"
    );

    const hashedPassword = bcrypt.hashSync(
      password,
      10
    );

    const user = createUser(
      name,
      username,
      email,
      hashedPassword,
      uploadResult.secure_url
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Photo is required.",
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