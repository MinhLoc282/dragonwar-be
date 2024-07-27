import mongoose from 'mongoose';
import { getImageLink } from '../../helpers/images';

const BossSchema = new mongoose.Schema({
  id: { type: Number, required: true, index: true },
  name: { type: String, required: true, index: true },
  skills: { type: Array, default: [] },
  stats: { type: Object, default: {} },
}, {
  timestamps: true,
});

BossSchema.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
    ret.image = {
      root: getImageLink(`resource/monsters/${ret.id}/images/${ret.id}.png`)
    };
    ret.figure = {
      atlas: getImageLink(`resource/monsters/${ret.id}/figure/${ret.id}.atlas`),
      dragon: getImageLink(`resource/monsters/${ret.id}/figure/${ret.id}.png`),
      skeleton: getImageLink(`resource/monsters/${ret.id}/figure/${ret.id}.json`)
    };
  }
});


export default mongoose.model('boss', BossSchema);
