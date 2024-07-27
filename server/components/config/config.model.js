import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ConfigSchema = new Schema({
  timeLockReward: { type: Number, required: true, index: true },
  maintenanceGame: {
    preventBattle: { type: Boolean },
    time: { type: Number }
  },
  rewardMissionPvE: { type: Number, required: true, index: true },
  checkinReward: { type: Number, required: true, index: 1 },
  poolReward: {
    pve: { type: Number, default: 0 },
    pvp: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

ConfigSchema.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
  }
});

export default mongoose.model('Config', ConfigSchema);
