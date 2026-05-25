const pool = require('../config/db');

const createProvider = async (user_id, category, bio, experience) => {
  const result = await pool.query(
    `INSERT INTO providers (user_id, category, bio, experience)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [user_id, category, bio, experience]
  );
  return result.rows[0];
};

const getProviderByUserId = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM providers WHERE user_id = $1`,
    [user_id]
  );
  return result.rows[0];
};

const getAllProviders = async (category, location) => {
  let query = `
    SELECT p.*, u.name, u.location, u.email 
    FROM providers p
    JOIN users u ON p.user_id = u.id
    WHERE 1=1
  `;
  const values = [];

  if (category) {
    values.push(category);
    query += ` AND p.category = $${values.length}`;
  }

  if (location) {
    values.push(`%${location}%`);
    query += ` AND u.location ILIKE $${values.length}`;
  }

  const result = await pool.query(query, values);
  return result.rows;
};

module.exports = { createProvider, getProviderByUserId, getAllProviders };