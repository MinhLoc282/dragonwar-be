import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RoomCacheSchema = new Schema({
  clients: { type: Number },
  name: { type: String },
  roomId: { type: String },
}, {
  timestamps: true
});

RoomCacheSchema.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
  }
});
export default mongoose.model('RoomCache', RoomCacheSchema);
