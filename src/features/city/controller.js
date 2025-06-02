const { City } = require("../../models");
const asyncHandler = require("express-async-handler");

const getAllCities = asyncHandler(async (req, res) => {
  const cities = await City.findAll({ order: [["city_name", "ASC"]] });
  res.json(cities);
});

const getCityById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const city = await City.findByPk(id);
  if (!city) {
    res.status(404);
    throw new Error("City bulunamadı");
  }
  res.json(city);
});

const createCity = asyncHandler(async (req, res) => {
  const { city_id, city_name } = req.body;

  const existing = await City.findByPk(city_id);
  if (existing) {
    res.status(400);
    throw new Error("Bu city_id zaten mevcut");
  }

  const city = await City.create({ city_id, city_name });
  res.status(201).json(city);
});

const updateCity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { city_name } = req.body;

  const city = await City.findByPk(id);
  if (!city) {
    res.status(404);
    throw new Error("City bulunamadı");
  }

  city.city_name = city_name || city.city_name;
  await city.save();

  res.json(city);
});

const deleteCity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const city = await City.findByPk(id);
  if (!city) {
    res.status(404);
    throw new Error("City bulunamadı");
  }

  await city.destroy();
  res.json({ message: "City silindi" });
});

module.exports = {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
};
