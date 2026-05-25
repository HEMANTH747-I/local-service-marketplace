const pool = require('../config/db');

// Get all unverified providers
const getPendingProviders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name, u.email, u.location
       FROM providers p
       JOIN users u ON p.user_id = u.id
       WHERE p.is_verified = false`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify a provider → award badge
const verifyProvider = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE providers 
       SET is_verified = true, badge_issued_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    res.json({
      message: '✅ Provider verified and badge awarded!',
      provider: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject/delete a provider
const deleteProvider = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM providers WHERE id = $1`, [id]);
    res.json({ message: 'Provider removed from platform' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, location, created_at FROM users`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPendingProviders,
  verifyProvider,
  deleteProvider,
  getAllUsers
};