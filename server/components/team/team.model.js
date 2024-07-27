import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import Dragons from '../dragon/dragon.model';
import Users from '../user/user.model';
import { getDragonSkills } from '../dragon/dragon.service';
// eslint-disable-next-line import/no-cycle
import {
  checkCharactersExistsClass, clearDragonsInOtherTeams, getTeamRankingPvE, getTeamRankingPvP, handleInitStats
} from './team.service';
import {
  BATTLE_TYPES,
  DRAGON_CLASS,
  INITIAL_PVE_TIMES,
  TEAM_STATUS
} from '../../constants';
import logger from '../../api/logger';
import { MONGO_URI } from '../../config';
import { getEquipmentsByDragonId } from '../item/item.service';

const Schema = mongoose.Schema;
const connection = mongoose.createConnection(MONGO_URI);

const Team = new Schema({
  uid: { type: Number },
  name: { type: String, required: true, index: true },
  dragons: { type: Array, required: true },
  owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  point: {
    pvp: { type: Number, default: 0 },
    pve: { type: Number, default: 0 }
  },
  status: { type: String, enum: Object.values(TEAM_STATUS), default: TEAM_STATUS.ACTIVE },
  changeablePoint: { type: Number, default: 0 },
  pveTimes: { type: Number, default: INITIAL_PVE_TIMES },
  battleTimes: {
    pve: { type: Number, default: INITIAL_PVE_TIMES },
    pvp: { type: Number, default: INITIAL_PVE_TIMES },
  },
  battleTime: {
    pve: { type: Number, default: 0 },
    pvp: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

autoIncrement.initialize(connection);

Team.plugin(autoIncrement.plugin, { model: 'Team', field: 'uid', startAt: 1 });

Team.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
  }
});

Team.post('save', async (doc) => {
  await clearDragonsInOtherTeams(doc._id, doc.dragons.map(item => item.id));
});


Team.statics.getMetaData = async function (team, isCore = true, getRank = true, battleType) {
  try {
    const isArray = Array.isArray(team);
    if (!isArray) {
      team = [team];
    }
    const promise = team.map(async (e) => {
      e = e.toJSON();
      const owner = await Users.findById(e.owner);
      if (owner) {
        e.owner = owner.toJSON();
      }
      if (getRank) {
        const teamRankingData = await Promise.all([
          getTeamRankingPvP(e),
          getTeamRankingPvE(e)
        ]);
        e.ranking = {
          pvp: teamRankingData[0],
          pve: teamRankingData[1]
        };
      }
      const promiseDragons = e.dragons.map(async (dragon) => {
        let dragonData = await Dragons.findOne({ id: dragon.id });
        dragonData = dragonData.toJSON();
        delete dragonData.birth;
        delete dragonData.cooldownIndex;
        delete dragonData.createdAt;
        delete dragonData.genes;
        delete dragonData.hatched;
        delete dragonData.isGestating;
        delete dragonData.isReady;
        delete dragonData.nextActionAt;
        delete dragonData.unicornation;
        delete dragonData.upgradeIndex;
        delete dragonData?.__v;
        delete dragonData?.updatedAt;
        if (!isCore) {
          return {
            ...dragon,
            ...dragonData
          };
        }
        const skills = await getDragonSkills(dragon.id);
        const equipments = await getEquipmentsByDragonId(dragon.id);
        return {
          ...dragon,
          ...dragonData,
          skills,
          equipments
        };
      });
      let dataDragons = await Promise.all(promiseDragons);
      // handle stats
      if (!isCore) {
        return {
          ...e,
          dragons: dataDragons
        };
      }
      const hasYinyangClass = checkCharactersExistsClass(dataDragons, DRAGON_CLASS.YINYANG);
      const hasLegendClass = checkCharactersExistsClass(dataDragons, DRAGON_CLASS.LEGEND);
      dataDragons = dataDragons.map((dragon) => {
        if (battleType === BATTLE_TYPES.ARENA) {
          dragon.level = 1;
          dragon.potential = 0;
        }
        dragon = handleInitStats(dragon, hasYinyangClass, hasLegendClass, battleType);
        dragon.skills = dragon.skills.map((skill) => {
          if (battleType === BATTLE_TYPES.ARENA) {
            skill.defend = Math.ceil(dragon.stats.defend * (skill.defend / 100));
          }
          if (battleType === BATTLE_TYPES.ADVENTURE) {
            skill.defend = Math.ceil(dragon.stats.baseDefend * (skill.defend / 100));
          }
          return {
            ...skill,
            attack: Math.ceil(dragon.stats.attack * (skill.attack / 100)),
          };
        });
        return dragon;
      });
      return {
        ...e,
        dragons: dataDragons
      };
    });
    const data = await Promise.all(promise);
    return isArray ? data : data[0];
  } catch (error) {
    logger.error('error getMetaDataUser : ', error);
    throw error;
  }
};
export default mongoose.model('Team', Team);
