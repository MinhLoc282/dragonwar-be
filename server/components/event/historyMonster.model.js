import mongoose from 'mongoose';
import { HISTORY_MONSTER, HISTORY_MONSTER_TYPE } from '../../constants';

const Schema = mongoose.Schema;

const HistoryMonster = new Schema({
  trxHash: { type: String },
  monster: { type: String, enum: Object.values(HISTORY_MONSTER) },
  type: { type: String, enum: Object.values(HISTORY_MONSTER_TYPE) },
  data: { type: Object }
}, {
  timestamps: true
});

HistoryMonster.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret._id;
    delete ret.updatedAt;
  }
});
export default mongoose.model('historyMonster', HistoryMonster);
