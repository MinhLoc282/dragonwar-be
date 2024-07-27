import mongoose from 'mongoose';
import Boss from './boss.model';
import SkillBoss from './skillboss.model';
import {
EFFECT_KEYS, EFFECT_LETHAL_LEVEL_VALUES, EFFECT_LEVEL_VALUES, LEVEL_EFFECT
} from '../../constants';
import { canFightAdventure } from './adventure.service';
import Effect from '../dragon/effect.model';

const AdventureSchema = new mongoose.Schema({
  id: { type: Number, index: true },
  name: { type: String, required: true, index: true },
  point: { type: Number, default: 0 },
  boss: { type: Array, default: [] }
}, {
  timestamps: true,
});

AdventureSchema.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
  }
});

AdventureSchema.statics.getMetaData = async function (adventures, detail = true, teamId) {
  try {
    const isArray = Array.isArray(adventures);
    if (!isArray) {
      adventures = [adventures];
    }
    const promise = adventures.map(async (adventure) => {
      const promiseBoss = adventure.boss.map(async (bossData) => {
        let boss = await Boss.findOne({ id: bossData.id });
        boss = boss.toJSON();
        if (!boss) return null;
        if (detail) {
          const promiseSkills = boss.skills.map(async (idSkill) => {
            let skill = await SkillBoss.findOne({ id: idSkill });
            skill = skill.toJSON();
            if (skill.effect) {
              const effect = await Effect.findOne({ id: skill.effect }).lean();
              if (![15, 19].includes(skill.effect)) {
                if (!bossData.level || bossData.level <= 5) {
                  effect.level = LEVEL_EFFECT.A;
                } else if (bossData.level > 6 && bossData.level <= 10) {
                  effect.level = LEVEL_EFFECT.S;
                } else {
                  effect.level = LEVEL_EFFECT.SS;
                }
              }
              let description = '';
              if (effect?.description) {
                if (effect.description.indexOf('%value%') === -1) {
                  description = effect.description;
                } else {
                  const effectValues = effect.key === EFFECT_KEYS.LETHAL ? EFFECT_LETHAL_LEVEL_VALUES : EFFECT_LEVEL_VALUES;
                  description = effect.description.replace('%value%', `${effectValues[effect.level]}%`);
                }
              }
              effect.description = description;
              skill.effect = effect;
            }
            return skill;
          });
          boss.skills = await Promise.all(promiseSkills);
        }
        const potential = bossData.potential || 1;
        Object.keys(boss.stats).forEach((key) => {
          boss.stats[key] += (potential + 1) * ((bossData.level || 1) - 1);
          if (key === 'health') {
            boss.stats[key] *= 4;
          }
          if (key === 'defend') {
            boss.stats[key] *= 2;
          }
        });
        boss.potential = potential;
        boss.level = bossData.level;
        boss.position = bossData.position;
        boss.skills = boss.skills.map(skill => ({
          ...skill,
          attack: Math.ceil(boss.stats.attack * (skill.attack / 100))
        }));
        return boss;
      });
      adventure.boss = await Promise.all(promiseBoss);
      if (teamId) {
        adventure.canFight = await canFightAdventure(adventure, teamId);
      }
      return adventure;
    });
    const data = await Promise.all(promise);
    return isArray ? data : data[0];
  } catch (error) {
    logger.error('error getMetaDataUser : ', error);
    throw error;
  }
};

export default mongoose.model('Adventure', AdventureSchema);
