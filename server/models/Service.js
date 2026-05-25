const pool = require('../config/db');

const createService = async (provider_id, title, description, price, category) => {
  const result = await pool.query(
    `INSERT INTO services (provider_id, title, description, price, category)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [provider_id, title, description, price, category]
  );
  return result.rows[0];
};

const getServicesByProvider = async (provider_id) => {
  const result = await pool.query(
    `SELECT * FROM services WHERE provider_id = $1`,
    [provider_id]
  );
  return result.rows;
};

module.exports = { createService, getServicesByProvider };