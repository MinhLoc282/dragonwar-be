import mongoose from 'mongoose';
import { getImageLink } from '../../helpers/images';

const SkillBossSchema = new mongoose.Schema({
  id: { type: Number, required: true, index: true },
  boss: { type: Number, required: true },
  skillBoss: { type: Number, required: true },
  name: { type: String, required: true, index: true },
  attack: { type: Number, required: true },
  effect: { type: Number },
  type: { type: String }
}, {
  timestamps: true,
});

SkillBossSchema.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
    ret.image = getImageLink(`resource/monsters/skillcards/${ret.id}.png`);
    ret.figure = {};
    ret.stats = {
      attack: {
        defaultValue: ret.attack,
        increase: 0
      }
    };
    if (ret.skillBoss === 1) {
      ret.figure.skill = {
        atlas: getImageLink(`resource/monsters/${ret.boss}/skills/${ret.skillBoss}/${ret.boss}.atlas`),
        image: getImageLink(`resource/monsters/${ret.boss}/skills/${ret.skillBoss}/${ret.boss}.png`),
        skeleton: getImageLink(`resource/monsters/${ret.boss}/skills/${ret.skillBoss}/${ret.boss}.json`)
      };
    }
    if (ret.skillBoss === 2 || ret.skillBoss === 3) {
      ret.figure.skill = {
        atlas: getImageLink(`resource/monsters/${ret.boss}/skills/${ret.skillBoss}/s${ret.skillBoss + 2}.atlas`),
        image: getImageLink(`resource/monsters/${ret.boss}/skills/${ret.skillBoss}/s${ret.skillBoss + 2}.png`),
        skeleton: getImageLink(`resource/monsters/${ret.boss}/skills/${ret.skillBoss}/s${ret.skillBoss + 2}.json`)
      };
      ret.figure.attacked = {
        atlas: getImageLink(`resource/monsters/${ret.boss}/skills/${ret.skillBoss}_attacked/s${ret.skillBoss + 2}_attacked.atlas`),
        image: getImageLink(`resource/monsters/${ret.boss}/skills/${ret.skillBoss}_attacked/s${ret.skillBoss + 2}_attacked.png`),
        skeleton: getImageLink(`resource/monsters/${ret.boss}/skills/${ret.skillBoss}_attacked/s${ret.skillBoss + 2}_attacked.json`)
      };
    }
    if (ret.skillBoss === 4) {
      ret.figure.skill = {
        atlas: getImageLink(`resource/monsters/${ret.boss}/skills/${ret.skillBoss}/s${ret.skillBoss + 2}-1.atlas`),
        image: getImageLink(`resource/monsters/${ret.boss}/skills/${ret.skillBoss}/s${ret.skillBoss + 2}-1.png`),
        skeleton: getImageLink(`resource/monsters/${ret.boss}/skills/${ret.skillBoss}/s${ret.skillBoss + 2}-1.json`)
      };
      ret.figure.skill2 = {
        atlas: getImageLink(`resource/monsters/${ret.boss}/skills/${ret.skillBoss}/s${ret.skillBoss + 2}-2.atlas`),
        image: getImageLink(`resource/monsters/${ret.boss}/skills/${ret.skillBoss}/s${ret.skillBoss + 2}-2.png`),
        skeleton: getImageLink(`resource/monsters/${ret.boss}/skills/${ret.skillBoss}/s${ret.skillBoss + 2}-2.json`)
      };
      ret.figure.attacked = {
        atlas: getImageLink(`resource/monsters/${ret.boss}/skills/${ret.skillBoss}_attacked/s${ret.skillBoss + 2}-attacked.atlas`),
        image: getImageLink(`resource/monsters/${ret.boss}/skills/${ret.skillBoss}_attacked/s${ret.skillBoss + 2}-attacked.png`),
        skeleton: getImageLink(`resource/monsters/${ret.boss}/skills/${ret.skillBoss}_attacked/s${ret.skillBoss + 2}-attacked.json`)
      };
    }
  }
});


export default mongoose.model('skillBoss', SkillBossSchema);
