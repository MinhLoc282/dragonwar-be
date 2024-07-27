import mongoose from 'mongoose';
import { TEAM_STATUS } from '../../constants';

const Schema = mongoose.Schema;

const DefaultTeam = new Schema({
  team: { type: mongoose.Schema.Types.ObjectId, index: true, ref: 'Team' },
  status: { type: String, default: TEAM_STATUS.ACTIVE },
}, {
  timestamps: true
});


DefaultTeam.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
  }
});


export default mongoose.model('DefaultTeam', DefaultTeam);
