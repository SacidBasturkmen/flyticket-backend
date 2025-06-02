// features/ticket/ticketController.js
const { sequelize, Ticket, Flight } = require("../../models");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

// 1. Tüm biletleri listele (Admin-only)
const getAllTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.findAll({
    include: [
      {
        model: Flight,
        as: "flight",
        attributes: [
          "flight_id",
          "from_city_id",
          "to_city_id",
          "departure_time",
          "arrival_time",
          "price",
        ],
      },
    ],
    order: [["ticket_id", "ASC"]],
  });
  res.json(tickets);
});

// 2. Bir kullanıcının e-posta adresine göre biletlerini getir (public)
const getTicketsByEmail = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const tickets = await Ticket.findAll({
    where: { passenger_email: email },
    include: [
      {
        model: Flight,
        as: "flight",
        attributes: [
          "flight_id",
          "from_city_id",
          "to_city_id",
          "departure_time",
          "arrival_time",
          "price",
        ],
      },
    ],
    order: [["ticket_id", "ASC"]],
  });
  res.json(tickets);
});

// 3. Yeni bir bilet (ticket) oluştur (book ticket)
const bookTicket = asyncHandler(async (req, res) => {
  const {
    passenger_name,
    passenger_surname,
    passenger_email,
    flight_id,
    seat_number,
  } = req.body;

  if (
    !passenger_name ||
    !passenger_surname ||
    !passenger_email ||
    !flight_id
  ) {
    res.status(400);
    throw new Error("Eksik bilet bilgisi");
  }

  // Uçuşu bul
  const flight = await Flight.findByPk(flight_id);
  if (!flight) {
    res.status(404);
    throw new Error("Flight bulunamadı");
  }

  // Eğer seat_number belirttiyse, o koltuk dolu mu kontrol et
  if (seat_number) {
    const existingSeat = await Ticket.findOne({
      where: { flight_id, seat_number },
    });
    if (existingSeat) {
      res.status(400);
      throw new Error(`Bu uçuş için ${seat_number} numaralı koltuk dolu`);
    }
  }

  // Boş koltuk var mı?
  if (flight.seats_available <= 0) {
    res.status(400);
    throw new Error("Bu uçuşta boş koltuk kalmadı");
  }

  // Yeni ticket_id’yi UUID olarak üret
  const newTicketId = uuidv4();

  // **BURADA** sequelize örneğini kullanarak transaction oluştur
  await sequelize.transaction(async (t) => {
    await Ticket.create(
      {
        ticket_id: newTicketId,
        passenger_name,
        passenger_surname,
        passenger_email,
        flight_id,
        seat_number: seat_number || null,
      },
      { transaction: t }
    );

    flight.seats_available -= 1;
    await flight.save({ transaction: t });
  });

  // Oluşturulan bileti, ilişkilendirilmiş Flight verisiyle getir
  const newTicket = await Ticket.findByPk(newTicketId, {
    include: [{ model: Flight, as: "flight" }],
  });

  res.status(201).json(newTicket);
});

module.exports = {
  getAllTickets,
  getTicketsByEmail,
  bookTicket,
};
