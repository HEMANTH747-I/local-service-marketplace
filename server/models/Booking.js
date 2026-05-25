const pool = require('../config/db');

const createBooking = async (customer_id, provider_id, service_id, scheduled_at) => {
  const result = await pool.query(
    `INSERT INTO bookings (customer_id, provider_id, service_id, scheduled_at)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [customer_id, provider_id, service_id, scheduled_at]
  );
  return result.rows[0];
};

const getBookingsByCustomer = async (customer_id) => {
  const result = await pool.query(
    `SELECT b.*, s.title, s.price, u.name as provider_name
     FROM bookings b
     JOIN services s ON b.service_id = s.id
     JOIN providers p ON b.provider_id = p.id
     JOIN users u ON p.user_id = u.id
     WHERE b.customer_id = $1
     ORDER BY b.created_at DESC`,
    [customer_id]
  );
  return result.rows;
};

const getBookingsByProvider = async (provider_id) => {
  const result = await pool.query(
    `SELECT b.*, s.title, s.price, u.name as customer_name
     FROM bookings b
     JOIN services s ON b.service_id = s.id
     JOIN users u ON b.customer_id = u.id
     WHERE b.provider_id = $1
     ORDER BY b.created_at DESC`,
    [provider_id]
  );
  return result.rows;
};

const updateBookingStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};

module.exports = {
  createBooking,
  getBookingsByCustomer,
  getBookingsByProvider,
  updateBookingStatus
};