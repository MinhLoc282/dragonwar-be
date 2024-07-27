import mongoose from 'mongoose';
import { getImageLink } from '../../helpers/images';


const Equipment = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  key: { type: String, required: true },
  description: { type: String },
  part: { type: String, required: true },
  type: { type: Number, required: true },
  stat: { type: String, required: true },
  point: { type: Number, required: true },
  rarity: { type: String }
}, {
  timestamps: true,
});


Equipment.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
    ret.image = getImageLink(`resource/images/equipment/${ret.key}.png`);
  }
});


export default mongoose.model('Equipment', Equipment);
