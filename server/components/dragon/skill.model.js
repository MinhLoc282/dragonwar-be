import mongoose from 'mongoose';
import {getImageLink} from "../../helpers/images";
import {
  REPLACE_SKILL_SAME_ANIMATE,
  SKILL_RESOURCE_CLASS,
  SKILLS_RESOURCE_PART,
} from '../../constants';

const fs = require('fs');

const Schema = mongoose.Schema;

const Skill = new Schema({
  name: { type: String, index: true },
  type: { type: String },
  class: { type: String },
  part: { type: String },
  attack: { type: Number },
  defend: { type: Number },
  mana: { type: Number },
  id: { type: Number },
  effect: { type: mongoose.Schema.Types.ObjectId, ref: 'effect' },
  audioSkill: { type: String },
  audioAttacked: { type: String },
  rarity: { type: String }
}, {
  timestamps: true
});

Skill.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
    ret.figure = {};
    let resourceName = `${SKILLS_RESOURCE_PART[ret.part.toUpperCase()]}_${SKILL_RESOURCE_CLASS[ret.class]}_${ret.id % 2 ? 1 : 2}`;
    ret.image = getImageLink(`resource/skillcards/${resourceName}.jpg`);
    if (ret.id > 98) {
      resourceName = REPLACE_SKILL_SAME_ANIMATE[ret.id] || resourceName;
      ret.image = getImageLink(`resource/skillcards/${ret.id}.jpg`);
    }
    if (fs.existsSync(`resource/skills/${resourceName}`)) {
      ret.figure.skill = {
        atlas: getImageLink(`resource/skills/${resourceName}/${resourceName}.atlas`),
        image: getImageLink(`resource/skills/${resourceName}/${resourceName}.png`),
        skeleton: getImageLink(`resource/skills/${resourceName}/${resourceName}.json`)
      };
    }
    if (fs.existsSync(`resource/skills/${resourceName}_2`)) {
      ret.figure.skill = {
        atlas: getImageLink(`resource/skills/${resourceName}_2/${resourceName}_2.atlas`),
        image: getImageLink(`resource/skills/${resourceName}_2/${resourceName}_2.png`),
        skeleton: getImageLink(`resource/skills/${resourceName}_2/${resourceName}_2.json`)
      };
    }
    if (fs.existsSync(`resource/skills/${resourceName}_attacked`)) {
      ret.figure.attacked = {
        atlas: getImageLink(`resource/skills/${resourceName}_attacked/${resourceName}_attacked.atlas`),
        image: getImageLink(`resource/skills/${resourceName}_attacked/${resourceName}_attacked.png`),
        skeleton: getImageLink(`resource/skills/${resourceName}_attacked/${resourceName}_attacked.json`)
      };
    } else {
      ret.figure.attacked = {
        atlas: getImageLink('resource/skills/default_attacked/default_attacked.atlas'),
        image: getImageLink('resource/skills/default_attacked/default_attacked.png'),
        skeleton: getImageLink('resource/skills/default_attacked/default_attacked.json')
      };
    }
    if (fs.existsSync(`resource/skills/${resourceName}_attacked2`)) {
      ret.figure.attacked2 = {
        atlas: getImageLink(`resource/skills/${resourceName}_attacked/${resourceName}_attacked2.atlas`),
        image: getImageLink(`resource/skills/${resourceName}_attacked/${resourceName}_attacked2.png`),
        skeleton: getImageLink(`resource/skills/${resourceName}_attacked/${resourceName}_attacked2.json`)
      };
    }
  }
});
export default mongoose.model('skill', Skill);
