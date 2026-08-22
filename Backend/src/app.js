import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import stopRoutes from "./routes/stop.routes.js";
import cityRoutes from "./routes/city.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import itineraryRoutes from "./routes/itinerary.routes.js";
import shareRoutes from "./routes/share.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import savedDestinationRoutes from "./routes/savedDestination.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GlobeTrotter API is running.",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/trips", tripRoutes);

app.use("/api", stopRoutes);

app.use("/api/cities", cityRoutes);
app.use("/api/activities", activityRoutes);

app.use("/api", expenseRoutes);

app.use("/api", itineraryRoutes);

app.use("/api", shareRoutes);

app.use("/api/admin", adminRoutes);

app.use(
  "/api/saved-destinations",
  savedDestinationRoutes
);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
});

export { app };
