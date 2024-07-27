import mongoose from 'mongoose';
import { AUCTION_TYPE } from '../../constants';

const Schema = mongoose.Schema;
const Auctions = new Schema({
  id: { type: Number, required: true, index: true },
  idString: { type: String, required: true, index: true },
  price: { type: Number, required: true, index: true },
  type: { type: String, enum: Object.values(AUCTION_TYPE), index: true },
}, {
  timestamps: true
});

export default mongoose.model('auctions', Auctions);
