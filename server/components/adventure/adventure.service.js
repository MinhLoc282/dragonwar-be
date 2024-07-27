import logger from '../../api/logger';
import APIError from '../../util/APIError';
import {BATTLE_TYPES, MIN_BATTLE_COMPLETE_MISSION_PVE, ROOT_PATH} from '../../constants';
import SkillBoss from './skillboss.model';
import Boss from './boss.model';
import Adventure from './adventure.model';
import BattleHistory from '../battleHistory/battleHistory.model';
import { conditionTimeInDay } from '../../helpers';
import { isObjectId } from '../../helpers/string.helper';

const XLSX = require('xlsx');


export async function syncBoss() {
  try {
    const workbook = XLSX.readFile(`${ROOT_PATH}/resource/boss.xlsx`);
    const sheet_name_list = workbook.SheetNames;
    const xlDataSkills = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[2]]);
    const promiseSkills = xlDataSkills.map(async (data) => {
      const skill = await SkillBoss.findOne({ id: data.id });
      if (!skill) {
        await SkillBoss.create(data);
      } else {
        await SkillBoss.updateOne(
          {
            id: data.id
          },
          {
            $set: data
          }
         );
      }
    });
    await Promise.all(promiseSkills);
    const xlDataBoss = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
    const promiseBoss = xlDataBoss.map(async (data) => {
      const stats = {
        health: data.health,
        mana: data.mana,
        attack: data.attack,
        defend: data.defend,
        speed: data.speed,
        morale: data.morale,
      };
      const boss = await Boss.findOne({ id: data.id });
      const dataCreate = {
        ...data,
        stats,
        skills: data.skills?.split(',').map(item => Number(item))
      };
      if (!boss) {
        await Boss.create(dataCreate);
      } else {
        await Boss.updateOne(
          {
            id: data.id
          },
          {
            $set: dataCreate
          }
        );
      }
    });
    await Promise.all(promiseBoss);
    const xlDataAdventure = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    const promiseAdventure = xlDataAdventure.map(async (data) => {
      const adventure = await Adventure.findOne({ id: data.id });
      const dataImport = {
        ...data,
        boss: data.boss?.split(',').map(item => Number(item)),
        position: data.position?.split(',').map(item => Number(item)),
        level: data.level?.split(',').map(item => Number(item)),
        potential: data.potential?.split(',').map(item => Number(item)),
      };
      const dataFormat = {
        id: dataImport.id,
        name: dataImport.name,
        reward: dataImport.reward,
        boss: [],
        point: data.point
      };
      dataImport.boss.forEach((boss, index) => {
        dataFormat.boss.push({
          id: boss,
          position: dataImport.position[index],
          level: dataImport.level[index],
          potential: dataImport.potential[index],
        });
      });
      if (!adventure) {
        await Adventure.create(dataFormat);
      } else {
        await Adventure.updateOne(
          {
            id: dataFormat.id
          },
          {
            $set: dataFormat
          }
        );
      }
    });
    await Promise.all(promiseAdventure);
    return true;
  } catch (error) {
    logger.error('Error in boss.service syncBoss => ', error);
    throw new APIError(500, 'Internal server error');
  }
}

/**
 *
 * @param {string} query.teamId
 * @returns {Promise<*>}
 */
export async function getAdventures(query) {
  try {
    const adventures = await Adventure.find({}).lean();
    return await Adventure.getMetaData(adventures, false, query.teamId);
  } catch (error) {
    logger.error('Error in boss.service getAdventures => ', error);
    throw new APIError(500, 'Internal server error');
  }
}

/**
 *
 * @param {string} id
 * @param {string} query.teamId
 * @returns {Promise<void>}
 */
export async function getAdventure(id, query) {
  try {
    const adventure = await Adventure.findOne({ id }).lean();
    if (!adventure) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Adventure not found',
          param: 'ADVENTURE_NOT_FOUND'
        }
      ]));
    }
    return await Adventure.getMetaData(adventure, true, query.teamId);
  } catch (error) {
    logger.error('Error in boss.service getAdventure => ', error);
    throw new APIError(500, 'Internal server error');
  }
}


// eslint-disable-next-line consistent-return
export async function canFightAdventure(adventure, teamId) {
  try {
    if (!isObjectId(teamId)) return false;
    if (adventure.id === 1) return true;
    const countBattleHistory = await BattleHistory.countDocuments({
      'adventure.id': adventure.id - 1,
      createdAt: conditionTimeInDay(new Date()),
      teams: { $in: [teamId] },
      'result.isWin': true
    });
    if (countBattleHistory) return true;
    return false;
  } catch (error) {
    logger.error('Error in canFindAdventure => ', error);
  }
}

export async function adminGetAdventures() {
  try {
    const promise = [
      Adventure.find({}).sort({ id: 1 }).lean(),
      Boss.find({}).lean()
    ];
    const data = await Promise.all(promise);
    const adventures = data[0];
    const bosses = data[1];
    return adventures.map((adventure) => {
      adventure.boss = adventure.boss.map((boss) => {
        const dataBoss = bosses.find(item => item.id === boss.id);
        const potential = boss.potential || 1;
        return {
          ...dataBoss,
          ...boss,
          potential
        };
      });
      return adventure;
    });
  } catch (error) {
    logger.error('Error in adminGetAdventures => ', error);
    throw new APIError(500, 'Internal server error');
  }
}

/**
 * @param {string} id
 * @param data
 * @returns {Promise<boolean>}
 */
export async function editAdventure(id, data) {
  try {
    const adventure = await Adventure.findOne({ id }).lean();
    if (!adventure) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Adventure not found',
          param: 'ADVENTURE_NOT_FOUND'
        }
      ]));
    }
    const boss = data.boss.map((item) => ({
     id: item.id,
     position: item.position,
     level: item.level,
     potential: item.potential
    }));
    const dataUpdate = {
      name: data.name || adventure.name,
      boss,
      reward: data.reward || adventure.reward,
      point: data.point || adventure.point
    };
    await Adventure.updateOne(
      {
        _id: adventure._id
      },
      {
        $set: dataUpdate
      }
    );
    return true;
  } catch (error) {
    logger.error('Error in editAdventure => ', error);
    throw new APIError(500, 'Internal server error');
  }
}


export async function getBoss() {
  try {
    return await Boss.find({}).lean().sort({ id: 1 });
  } catch (error) {
    logger.error('Error in getBoss => ', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function editBoss(id, data) {
  try {
    const boss = await Boss.findOne({ id });
    if (!boss) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Boss not found',
          param: 'BOSS_NOT_FOUND'
        }
      ]));
    }
    return await Boss.updateOne(
      {
        id
      },
      {
        $set: {
          name: data.name,
          stats: data.stats,
          potential: data.potential
        }
      }
    );
  } catch (error) {
    logger.error('Error in editBoss => ', error);
    throw new APIError(500, 'Internal server error');
  }
}


export async function getProgressMissionPvE(userId) {
  try {
    const adventures = await Adventure.find({}).sort({ id: -1 });
    const promise = adventures.map(async (adventure) => {
      const winBattle = await BattleHistory.countDocuments({
        'adventure.id': adventure.id,
        type: BATTLE_TYPES.ADVENTURE,
        createdAt: conditionTimeInDay(new Date()),
        players: userId,
        'result.isWin': true
      });
      return {
        winBattle,
        id: adventure.id
      };
    });
    const winAdventures = await Promise.all(promise);
    let completed = 0;
    winAdventures.forEach((adventure) => {
      if (!completed && adventure.winBattle) {
        completed = adventure.id;
      }
    });
    return {
      percent: Math.ceil(completed * 100 / MIN_BATTLE_COMPLETE_MISSION_PVE) > 100 ? 100 : Math.ceil(completed * 100 / MIN_BATTLE_COMPLETE_MISSION_PVE),
      total: MIN_BATTLE_COMPLETE_MISSION_PVE,
      completed: completed > MIN_BATTLE_COMPLETE_MISSION_PVE ? MIN_BATTLE_COMPLETE_MISSION_PVE : completed
    };
  } catch (error) {
    console.log('Error in getProgressMissionPvE', error);
  }
}
