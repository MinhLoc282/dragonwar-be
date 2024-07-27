import mongoose from 'mongoose';
import { ITEM_LOG_STATUS, ITEM_LOG_TYPES, ITEM_TYPES } from '../../constants';
import { createNotificationItem, updateReportItemsViaItemLog } from './item.service';


const ItemLog = new mongoose.Schema({
  type: { type: String, required: true, enum: Object.values(ITEM_LOG_TYPES) },
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  itemType: { type: String, enum: Object.values(ITEM_TYPES)},
  burnedItem: { type: Number },
  status: { type: String, enum: Object.values(ITEM_LOG_STATUS), default: ITEM_LOG_STATUS.SUCCESS },
  gift: { type: mongoose.Schema.Types.ObjectId, ref: 'Gift' },
  listingId: { type: Number },
  dragon: { type: Number },
  txHash: { type: String },
  from: { type: String },
  to: { type: String },
  price: { type: Number },
  fee: { type: Number },
  replaceBy: { type: Number },
  preOwner: { type: String }
}, {
  timestamps: true,
});


ItemLog.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
  }
});

ItemLog.post('save', async (doc) => {
  await createNotificationItem(doc);
  await updateReportItemsViaItemLog(doc);
});


export default mongoose.model('ItemLog', ItemLog);
