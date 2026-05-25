const pool = require('../config/db');
const {
  createBooking,
  getBookingsByCustomer,
  getBookingsByProvider,
  updateBookingStatus
} = require('../models/Booking');
const { getProviderByUserId } = require('../models/Provider');

// Customer creates booking
const makeBooking = async (req, res) => {
  const { provider_id, service_id, scheduled_at } = req.body;
  const customer_id = req.user.id;
  try {
    const booking = await createBooking(customer_id, provider_id, service_id, scheduled_at);
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Customer sees their bookings
const myBookings = async (req, res) => {
  const customer_id = req.user.id;
  try {
    const bookings = await getBookingsByCustomer(customer_id);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Provider sees their bookings
const providerBookings = async (req, res) => {
  const user_id = req.user.id;
  try {
    const provider = await getProviderByUserId(user_id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    const bookings = await getBookingsByProvider(provider.id);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Provider updates booking status
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user_id = req.user.id;
  const allowed = ['accepted', 'rejected', 'completed'];
  try {
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // DEBUG LINE
    console.log('user_id:', user_id, 'booking_id:', id, 'status:', status);

    const provider = await getProviderByUserId(user_id);
    
    // DEBUG LINE
    console.log('provider:', provider);

    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    const result = await pool.query(
      `UPDATE bookings SET status = $1 
       WHERE id = $2 AND provider_id = $3 
       RETURNING *`,
      [status, id, provider.id]
    );

    // DEBUG LINE

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { makeBooking, myBookings, providerBookings, updateStatus };