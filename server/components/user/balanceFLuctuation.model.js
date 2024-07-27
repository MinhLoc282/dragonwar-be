import mongoose from 'mongoose';
import { BALANCE_FLUCTUATION_STATUS, BALANCE_FLUCTUATION_TYPES } from '../../constants';


const BalanceFluctuationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User'
  },
  oldBalance: {
    base: { type: Number }
  },
  newBalance: {
    base: { type: Number }
  },
  amount: { type: Number, required: true },
  type: { type: String, enum: Object.values(BALANCE_FLUCTUATION_TYPES) },
  battleHistory: { type: mongoose.Schema.Types.ObjectId, ref: 'BattleHistory' },
  status: { type: String, enum: Object.values(BALANCE_FLUCTUATION_STATUS) },
  txHash: { type: String },
  lockedTime: { type: Number }
}, {
  timestamps: true,
});

BalanceFluctuationSchema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.__v;
  }
});


export default mongoose.model('BalanceFluctuation', BalanceFluctuationSchema);
