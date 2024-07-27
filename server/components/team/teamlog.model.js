import mongoose from 'mongoose';


const TeamLogSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Team' },
  oldDragons: { type: Array, required: true },
  newDragons: { type: Array, required: true }
}, {
  timestamps: true,
});

TeamLogSchema.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
  }
});


export default mongoose.model('TeamLog', TeamLogSchema);
