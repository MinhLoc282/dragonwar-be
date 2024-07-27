import mongoose from 'mongoose';
import { TICKET_TYPES } from '../../constants';

const TicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User'
  },
  team: {
    type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'Team'
  },
  type: { type: String, enum: Object.values(TICKET_TYPES), required: true },
  price: { type: String, required: true },
  priceNumber: { type: Number },
  count: { type: Number, required: true },
  time: { type: Number, required: true },
  txHash: { type: String, required: true }
}, {
  timestamps: true,
});


TicketSchema.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
  }
});


export default mongoose.model('Ticket', TicketSchema);
