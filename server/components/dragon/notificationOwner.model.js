import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const NotificationOwner = new Schema({
  owner: { type: String },
  total: { type: Number }
}, {
  timestamps: false
});
export default mongoose.model('notificationOwner', NotificationOwner);
