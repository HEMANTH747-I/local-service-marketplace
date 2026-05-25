const { createProvider, getProviderByUserId, getAllProviders } = require('../models/Provider');
const { createService, getServicesByProvider } = require('../models/Service');

// Create provider profile
const createProfile = async (req, res) => {
  const { category, bio, experience } = req.body;
  const user_id = req.user.id;
  try {
    const provider = await createProvider(user_id, category, bio, experience);
    res.status(201).json(provider);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my profile
const getMyProfile = async (req, res) => {
  const user_id = req.user.id;
  try {
    const provider = await getProviderByUserId(user_id);
    if (!provider) return res.status(404).json({ message: 'Profile not found' });
    const services = await getServicesByProvider(provider.id);
    res.json({ provider, services });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all providers (with search)
const getProviders = async (req, res) => {
  const { category, location } = req.query;
  try {
    const providers = await getAllProviders(category, location);
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a service
const addService = async (req, res) => {
  const { title, description, price, category } = req.body;
  const user_id = req.user.id;
  try {
    const provider = await getProviderByUserId(user_id);
    if (!provider) return res.status(404).json({ message: 'Provider profile not found' });
    const service = await createService(provider.id, title, description, price, category);
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createProfile, getMyProfile, getProviders, addService };