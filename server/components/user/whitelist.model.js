import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const WhitelistSchema = new Schema({
  address: { type: String, required: true, index: true }
}, {
  timestamps: true
});

WhitelistSchema.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
  }
});

export default mongoose.model('Whitelist', WhitelistSchema);
