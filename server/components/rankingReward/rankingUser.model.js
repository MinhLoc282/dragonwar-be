import mongoose from 'mongoose';


const RankingUserSchema = new mongoose.Schema({
  from: { type: Number, required: true, index: true },
  to: { type: Number },
  winPoint: { type: Number, default: 0 },
  losePoint: { type: Number, default: 0 }
}, {
  timestamps: true,
});

RankingUserSchema.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
  }
});


export default mongoose.model('RankingUser', RankingUserSchema);
