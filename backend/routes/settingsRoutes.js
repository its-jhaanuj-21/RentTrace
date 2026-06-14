import express from 'express';
import Settings from '../models/Settings.js';

const router = express.Router();

const DEFAULT_SETTINGS = {
  tenantName: '',
  tenantPhone: '',
  defaultHouseRent: 0,
  defaultElecRate: 0,
  defaultWaterRate: 0,
  initialMeterReading: 0,
  landlordName: '',
  landlordUpi: '',
  landlordDetails: '',
  customServices: []
};

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    // Scope settings query to logged-in user
    let settings = await Settings.findOne({ userId: req.user.id });
    if (!settings) {
      // Return default settings if none exist yet, without creating a document in db yet
      return res.json(DEFAULT_SETTINGS);
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving settings', error: error.message });
  }
});

// POST /api/settings
router.post('/', async (req, res) => {
  try {
    const {
      tenantName,
      tenantPhone,
      defaultHouseRent,
      defaultElecRate,
      defaultWaterRate,
      initialMeterReading,
      landlordName,
      landlordUpi,
      landlordDetails,
      customServices
    } = req.body;

    let settings = await Settings.findOne({ userId: req.user.id });
    if (settings) {
      settings.tenantName = tenantName !== undefined ? tenantName : settings.tenantName;
      settings.tenantPhone = tenantPhone !== undefined ? tenantPhone : settings.tenantPhone;
      settings.defaultHouseRent = defaultHouseRent !== undefined ? defaultHouseRent : settings.defaultHouseRent;
      settings.defaultElecRate = defaultElecRate !== undefined ? defaultElecRate : settings.defaultElecRate;
      settings.defaultWaterRate = defaultWaterRate !== undefined ? defaultWaterRate : settings.defaultWaterRate;
      settings.initialMeterReading = initialMeterReading !== undefined ? initialMeterReading : settings.initialMeterReading;
      settings.landlordName = landlordName !== undefined ? landlordName : settings.landlordName;
      settings.landlordUpi = landlordUpi !== undefined ? landlordUpi : settings.landlordUpi;
      settings.landlordDetails = landlordDetails !== undefined ? landlordDetails : settings.landlordDetails;
      settings.customServices = customServices !== undefined ? customServices : settings.customServices;
      await settings.save();
    } else {
      settings = new Settings({
        userId: req.user.id, // Associate settings with the logged-in user
        tenantName,
        tenantPhone,
        defaultHouseRent,
        defaultElecRate,
        defaultWaterRate,
        initialMeterReading,
        landlordName,
        landlordUpi,
        landlordDetails,
        customServices
      });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
});

// POST /api/settings/reset
router.post('/reset', async (req, res) => {
  try {
    await Settings.deleteOne({ userId: req.user.id });
    res.json(DEFAULT_SETTINGS);
  } catch (error) {
    res.status(500).json({ message: 'Error resetting settings', error: error.message });
  }
});

export default router;
