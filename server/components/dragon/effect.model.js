import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Effect = new Schema({
  name: { type: String, index: true },
  type: { type: String },
  key: { type: String },
  level: { type: Array },
  id: { type: Number },
  description: { type: String }
}, {
  timestamps: true
});

Effect.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
  }
});
export default mongoose.model('effect', Effect);
