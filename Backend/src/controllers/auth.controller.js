import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  getUserByEmail,
  getUserById,
} from "../models/user.model.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

export const register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required.",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters.",
    });
  }

  const existingUser = getUserByEmail(email);

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists.",
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = createUser(
    name,
    email,
    hashedPassword
  );

  const token = generateToken(user);

  res.cookie("accessToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
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
};

export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const user = getUserByEmail(email);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const isPasswordValid = bcrypt.compareSync(
    password,
    user.password
  );

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const token = generateToken(user);

  res.cookie("accessToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
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