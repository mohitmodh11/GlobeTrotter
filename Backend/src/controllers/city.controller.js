import { getCityById, saveSelectedCity } from "../models/city.model.js";

export const searchCity = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter at least 2 characters.",
      });
    }

    const url =
      `https://geocoding-api.open-meteo.com/v1/search` +
      `?name=${encodeURIComponent(q.trim())}` +
      `&count=10` +
      `&language=en` +
      `&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "City search service is unavailable.",
      });
    }

    const result = await response.json();

    let cities = result.results || [];

    // Prefer India results
    const indiaCities = cities.filter((city) => city.country_code === "IN");

    if (indiaCities.length > 0) {
      cities = indiaCities;
    }

    // Prefer exact city-name matches
    const searchTerm = q.trim().toLowerCase();

    const exactMatches = cities.filter(
      (city) => city.name.toLowerCase() === searchTerm
    );

    if (exactMatches.length > 0) {
      cities = exactMatches;
    }

    cities = cities.map((city) => ({
      id: city.id,
      name: city.name,
      country: city.country,
      countryCode: city.country_code,
      state: city.admin1 || null,
      latitude: city.latitude,
      longitude: city.longitude,
      timezone: city.timezone || null,
      population: city.population || 0,
    }));

    return res.status(200).json({
      success: true,
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    console.error("City search error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search cities.",
    });
  }
};

export const getCity = (req, res) => {
  const city = getCityById(req.params.cityId);

  if (!city) {
    return res.status(404).json({
      success: false,
      message: "City not found.",
    });
  }

  return res.status(200).json({
    success: true,
    data: city,
  });
};

export const saveCity = (req, res) => {
  try {
    const {
      name,
      country,
      countryCode,
      state,
      latitude,
      longitude,
      timezone,
      population,
    } = req.body;

    if (
      !name ||
      !country ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, country, latitude and longitude are required.",
      });
    }

    const city = saveSelectedCity(
      name,
      country,
      countryCode || null,
      state || null,
      latitude,
      longitude,
      timezone || null,
      population || 0
    );

    return res.status(201).json({
      success: true,
      message: "City saved successfully.",
      data: city,
    });
  } catch (error) {
    console.error("Save city error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save city.",
    });
  }
};
