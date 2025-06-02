const { Flight, City } = require("../../models");
const asyncHandler = require("express-async-handler");

const getAllFlights = asyncHandler(async (req, res) => {
  const flights = await Flight.findAll({
    include: [
      { model: City, as: "fromCity", attributes: ["city_id", "city_name"] },
      { model: City, as: "toCity", attributes: ["city_id", "city_name"] },
    ],
    order: [["departure_time", "ASC"]],
  });
  res.json(flights);
});

const getFlightById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const flight = await Flight.findByPk(id, {
    include: [
      { model: City, as: "fromCity", attributes: ["city_id", "city_name"] },
      { model: City, as: "toCity", attributes: ["city_id", "city_name"] },
    ],
  });
  if (!flight) {
    res.status(404);
    throw new Error("Flight bulunamadı");
  }
  res.json(flight);
});

const existsDepartureConflict = async (from_city_id, departure_time, excludeId = null) => {
  const where = { from_city_id, departure_time };
  if (excludeId) where.flight_id = { [require("sequelize").Op.ne]: excludeId };
  return await Flight.findOne({ where });
};

const existsArrivalConflict = async (to_city_id, arrival_time, excludeId = null) => {
  const where = { to_city_id, arrival_time };
  if (excludeId) where.flight_id = { [require("sequelize").Op.ne]: excludeId };
  return await Flight.findOne({ where });
};

const createFlight = asyncHandler(async (req, res) => {
  const {
    flight_id,
    from_city_id,
    to_city_id,
    departure_time,
    arrival_time,
    price,
    seats_total,
    seats_available,
  } = req.body;

  if (
    !flight_id ||
    !from_city_id ||
    !to_city_id ||
    !departure_time ||
    !arrival_time ||
    price == null ||
    seats_total == null ||
    seats_available == null
  ) {
    res.status(400);
    throw new Error("Eksik uçuş bilgisi");
  }

  const existing = await Flight.findByPk(flight_id);
  if (existing) {
    res.status(400);
    throw new Error("Bu flight_id zaten mevcut");
  }

  const departConflict = await existsDepartureConflict(from_city_id, departure_time);
  if (departConflict) {
    res.status(400);
    throw new Error(
      `${from_city_id} şehrinden ${departure_time} zamanında zaten bir uçuş var`
    );
  }

  const arrivalConflict = await existsArrivalConflict(to_city_id, arrival_time);
  if (arrivalConflict) {
    res.status(400);
    throw new Error(
      `${to_city_id} şehrine ${arrival_time} zamanında zaten bir uçuş var`
    );
  }

  const flight = await Flight.create({
    flight_id,
    from_city_id,
    to_city_id,
    departure_time,
    arrival_time,
    price,
    seats_total,
    seats_available,
  });

  res.status(201).json(flight);
});

const updateFlight = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    from_city_id,
    to_city_id,
    departure_time,
    arrival_time,
    price,
    seats_total,
    seats_available,
  } = req.body;

  const flight = await Flight.findByPk(id);
  if (!flight) {
    res.status(404);
    throw new Error("Flight bulunamadı");
  }

  if (from_city_id || departure_time) {
    const newFrom = from_city_id || flight.from_city_id;
    const newDepart = departure_time || flight.departure_time;
    const departConflict = await existsDepartureConflict(newFrom, newDepart, id);
    if (departConflict) {
      res.status(400);
      throw new Error(
        `${newFrom} şehrinden ${newDepart} zamanında zaten bir uçuş var`
      );
    }
    flight.from_city_id = newFrom;
    flight.departure_time = newDepart;
  }

  if (to_city_id || arrival_time) {
    const newTo = to_city_id || flight.to_city_id;
    const newArrive = arrival_time || flight.arrival_time;
    const arrivalConflict = await existsArrivalConflict(newTo, newArrive, id);
    if (arrivalConflict) {
      res.status(400);
      throw new Error(
        `${newTo} şehrine ${newArrive} zamanında zaten bir uçuş var`
      );
    }
    flight.to_city_id = newTo;
    flight.arrival_time = newArrive;
  }

  if (price != null) flight.price = price;
  if (seats_total != null) flight.seats_total = seats_total;
  if (seats_available != null) flight.seats_available = seats_available;

  await flight.save();
  res.json(flight);
});

const deleteFlight = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const flight = await Flight.findByPk(id);
  if (!flight) {
    res.status(404);
    throw new Error("Flight bulunamadı");
  }
  await flight.destroy();
  res.json({ message: "Flight silindi" });
});

module.exports = {
  getAllFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight,
};
