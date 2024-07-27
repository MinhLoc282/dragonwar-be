import mongoose from 'mongoose';
import { BATTLE_TYPES } from '../../constants';
import { resetRankingPvE, resetRankingPvP } from '../team/team.service';

const Schema = mongoose.Schema;
const RankingHistory = new Schema({
  team: {
   type: Schema.Types.ObjectId, required: true, index: true, ref: 'Team'
  },
  owner: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'User'
  },
  rank: { type: Number, required: true },
  dragons: { type: Array, required: true },
  type: { type: String, required: true, enum: Object.values(BATTLE_TYPES) },
  point: { type: Number, required: true },
  battleTime: { type: Number, required: true },
  reward: { type: Number, required: true },
}, {
  timestamps: true
});

RankingHistory.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
  }
});

RankingHistory.post('save', async (doc) => {
  if (doc.type === BATTLE_TYPES.ADVENTURE) {
    await resetRankingPvE(doc?.team);
  }
  if (doc.type === BATTLE_TYPES.ARENA) {
    await resetRankingPvP(doc?.team);
  }
});

export default mongoose.model('rankingHistory', RankingHistory);
