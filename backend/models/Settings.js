import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  tenantName: {
    type: String,
    default: ''
  },
  tenantPhone: {
    type: String,
    default: ''
  },
  defaultHouseRent: {
    type: Number,
    default: 0
  },
  defaultElecRate: {
    type: Number,
    default: 0
  },
  defaultWaterRate: {
    type: Number,
    default: 0
  },
  initialMeterReading: {
    type: Number,
    default: 0
  },
  landlordName: {
    type: String,
    default: ''
  },
  landlordUpi: {
    type: String,
    default: ''
  },
  landlordDetails: {
    type: String,
    default: ''
  },
  customServices: [
    {
      name: { type: String, required: true },
      rate: { type: Number, default: 0 }
    }
  ]
}, {
  timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
