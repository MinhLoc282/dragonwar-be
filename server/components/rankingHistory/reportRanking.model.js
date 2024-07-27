import mongoose from 'mongoose';
import { BATTLE_TYPES } from '../../constants';

const Schema = mongoose.Schema;
const ReportRanking = new Schema({
  team: { type: Number },
  battleTime: { type: Number },
  battleTimes: { type: Number },
  reward: { type: Number },
  type: { type: String, required: true, enum: Object.values(BATTLE_TYPES) },
  month: { type: Number },
  year: { type: Number }
}, {
  timestamps: true
});

ReportRanking.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
  }
});


export default mongoose.model('ReportRanking', ReportRanking);
