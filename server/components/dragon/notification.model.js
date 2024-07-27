import mongoose from 'mongoose';
import { HISTORY_TYPE, HISTORY_TYPE_NAME, NFT_TYPES } from '../../constants';

const Schema = mongoose.Schema;

const Notification = new Schema({
  trxHash: { type: String },
  id: { type: Number, index: true },
  owner: { type: String },
  price: { type: String },
  type: { type: String, enum: Object.values(HISTORY_TYPE) },
  data: { type: Object },
  nftType: { type: String, enum: Object.values(NFT_TYPES), default: NFT_TYPES.DRAGON }
}, {
  timestamps: true
});

Notification.set('toJSON', {
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
export default mongoose.model('notification', Notification);
