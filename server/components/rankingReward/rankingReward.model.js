import mongoose from 'mongoose';


const RankingRewardSchema = new mongoose.Schema({
  from: { type: Number, required: true, index: true },
  to: { type: Number },
  reward: { type: Number, required: true }
}, {
  timestamps: true,
});

RankingRewardSchema.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
  }
});


export default mongoose.model('RankingReward', RankingRewardSchema);
