const pool = require("../config/db");

// Create user
const createUser = async (name, email, password, role, location) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role, location)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, role, location, created_at`,
    [name, email, password, role, location]
  );

  return result.rows[0];
};

// Find user by email
const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0];
};

module.exports = { createUser, findUserByEmail };