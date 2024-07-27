import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SkillDragon = new Schema({
  dragon: { type: mongoose.Schema.Types.ObjectId, ref: 'Dragon' },
  skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
  level: { type: String },
  useDefault: { type: Boolean, default: false }
}, {
  timestamps: true
});

SkillDragon.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
  }
});
export default mongoose.model('skillDragon', SkillDragon);
