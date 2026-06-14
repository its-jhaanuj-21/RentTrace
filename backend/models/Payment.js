import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  houseRent: {
    type: Number,
    required: true,
    default: 0
  },
  prevMeter: {
    type: Number,
    required: true,
    default: 0
  },
  currMeter: {
    type: Number,
    required: true,
    default: 0
  },
  elecRate: {
    type: Number,
    required: true,
    default: 0
  },
  elecAmount: {
    type: Number,
    required: true,
    default: 0
  },
  meterImage: {
    type: String,
    default: ''
  },
  waterJars: {
    type: Number,
    default: 0
  },
  waterRate: {
    type: Number,
    default: 0
  },
  waterAmount: {
    type: Number,
    default: 0
  },
  otherDesc: {
    type: String,
    default: ''
  },
  otherAmount: {
    type: Number,
    default: 0
  },
  otherCharges: [
    {
      desc: { type: String, default: '' },
      amount: { type: Number, default: 0 }
    }
  ],
  grandTotal: {
    type: Number,
    required: true,
    default: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online'],
    default: 'cash'
  },
  paidAmount: {
    type: Number,
    required: true,
    default: 0
  },
  txnId: {
    type: String,
    default: ''
  },
  paymentScreenshot: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
