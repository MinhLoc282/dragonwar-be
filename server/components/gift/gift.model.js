import mongoose from 'mongoose';
import { GIFT_STATUS, GIFT_TYPES } from '../../constants';

const GiftSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User'
  },
  team: {
    type: mongoose.Schema.Types.ObjectId, index: true, ref: 'Team'
  },
  type: { type: String, enum: Object.values(GIFT_TYPES), required: true },
  status: { type: String, enum: Object.values(GIFT_STATUS), default: GIFT_STATUS.UNOPENED },
  battle: { type: mongoose.Schema.Types.ObjectId, ref: 'BattleHistory' }
}, {
  timestamps: true,
});


GiftSchema.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
  }
});


export default mongoose.model('Gift', GiftSchema);
