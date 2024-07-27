import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Favorites = new Schema({
  id: { type: Number },
  owner: { type: String, required: true, index: true }
}, {
  timestamps: true
});
export default mongoose.model('favorites', Favorites);
