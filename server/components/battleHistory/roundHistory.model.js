import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RoundHistorySchema = new Schema({
  battle: { type: Schema.Types.ObjectId, required: true },
  history: { type: Array, default: [] },
  round: { type: Number, required: true },
  nextAttackOrder: { type: Object }
}, {
  timestamps: true
});

RoundHistorySchema.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
  }
});
export default mongoose.model('RoundHistory', RoundHistorySchema);
