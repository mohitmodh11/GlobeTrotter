import db from "../db/index.js";

import {
  saveDestination,
  getSavedDestinations,
  removeSavedDestination,
} from "../models/savedDestination.model.js";

export const addSavedDestination = (req, res) => {
  const { cityId } = req.body;

  if (!cityId) {
    return res.status(400).json({
      success: false,
      message: "City ID is required.",
    });
  }

  const city = db
    .prepare(`
      SELECT id
      FROM cities
      WHERE id = ?
    `)
    .get(cityId);

  if (!city) {
    return res.status(404).json({
      success: false,
      message: "City not found.",
    });
  }

  try {
    const destination = saveDestination(
      req.user.id,
      cityId
    );

    return res.status(201).json({
      success: true,
      message: "Destination saved successfully.",
      data: destination,
    });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        success: false,
        message: "Destination already saved.",
      });
    }

    console.error("Save destination error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save destination.",
    });
  }
};

export const getMySavedDestinations = (req, res) => {
  const destinations = getSavedDestinations(
    req.user.id
  );

  return res.status(200).json({
    success: true,
    count: destinations.length,
    data: destinations,
  });
};

export const deleteSavedDestination = (req, res) => {
  const { cityId } = req.params;

  const result = removeSavedDestination(
    req.user.id,
    cityId
  );

  if (result.changes === 0) {
    return res.status(404).json({
      success: false,
      message: "Saved destination not found.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Destination removed successfully.",
  });
};