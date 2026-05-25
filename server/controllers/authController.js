const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/User');
const { createProvider } = require('../models/Provider');
// Register


const register = async (req, res) => {
  const { name, email, password, role, location, category, bio, experience } = req.body;
  try {
    const existing = await findUserByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, hashed, role, location);

    // Auto create provider profile if role is provider
    if (role === 'provider') {
      await createProvider(
        user.id,
        category || 'General',
        bio || 'No bio yet',
        experience || 0
      );
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = user;
    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user
    const user = await findUserByEmail(email);
    const { password: _, ...safeUser } = user;
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

  res.status(200).json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };