// features/city/cityController.js
const { City } = require("../../models");
const asyncHandler = require("express-async-handler");

// 1. Tüm şehirleri listele
const getAllCities = asyncHandler(async (req, res) => {
  const cities = await City.findAll({ order: [["city_name", "ASC"]] });
  res.json(cities);
});

// 2. Tek bir şehri getir (city_id ile)
const getCityById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const city = await City.findByPk(id);
  if (!city) {
    res.status(404);
    throw new Error("City bulunamadı");
  }
  res.json(city);
});

// 3. Yeni bir şehir ekle
const createCity = asyncHandler(async (req, res) => {
  const { city_id, city_name } = req.body;

  // city_id benzersiz mi kontrol et
  const existing = await City.findByPk(city_id);
  if (existing) {
    res.status(400);
    throw new Error("Bu city_id zaten mevcut");
  }

  const city = await City.create({ city_id, city_name });
  res.status(201).json(city);
});

// 4. Bir şehri güncelle (city_name değiştirilebilir)
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

// 5. Bir şehri sil (city_id ile)
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
