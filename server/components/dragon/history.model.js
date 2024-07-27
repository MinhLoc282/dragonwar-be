import mongoose from 'mongoose';
import { HISTORY_TYPE, HISTORY_TYPE_NAME } from '../../constants';
const Schema = mongoose.Schema;

const History = new Schema({
  trxHash: { type: String },
  id: { type: Number, index: true },
  from: { type: String },
  to: { type: String },
  price: { type: Number },
  type: { type: String, enum: Object.values(HISTORY_TYPE) },
  data: { type: Object }
}, {
  timestamps: true
});

History.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret._id;
    delete ret.updatedAt;
    switch (ret.type) {
      case HISTORY_TYPE.TRAINING:
        if (parseFloat(ret.price)) {
          ret.type = HISTORY_TYPE_NAME.BOOTS;
        } else {
          ret.type = HISTORY_TYPE_NAME.TRAINING;
        }
        break;
      default:
        ret.type = HISTORY_TYPE_NAME[ret.type];
        break;
    }
  }
});
export default mongoose.model('history', History);
