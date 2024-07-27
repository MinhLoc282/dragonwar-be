import logger from '../../api/logger';
import APIError from '../../util/APIError';
import Team from './team.model';
import Config from '../config/config.model';
import Dragons from '../dragon/dragon.model';
import BattleHistory from "../battleHistory/battleHistory.model";
import TeamLog from "./teamlog.model";
import RoomCache from '../battleHistory/roomCache.model';
import { Promise } from 'mongoose';
import {
  BATTLE_TYPES,
  CHANGE_TEAM_LOCK_DURATION_DAYS,
  DEFAULT_PAGE_LIMIT,
  DRAGON_CLASS,
  DRAGON_CLASSIC_CLASS,
  INITIAL_PVE_TIMES,
  MAX_PAGE_LIMIT,
  TEAM_STATUS
} from '../../constants';
import { validSearchString } from '../../helpers/string.helper';
import Web3 from "web3";
import {getPoolReward, getRatioRewardViaRanking} from "../reward/reward.service";
import DefaultTeam from './defaultTeam.model';

export async function createTeam(auth, data) {
  try {
    const checkTeam = await validateTeam(auth, data);
    if (checkTeam?.length) {
      return Promise.reject(new APIError(403, checkTeam));
    }
    const team = await Team.create({
      ...data,
      owner: auth._id
    })
    return team
  } catch (error) {
    logger.error('TeamService createTeam error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function updateTeam(id, auth, data) {
  try {
    const team = await Team.findOne({
      _id: id,
      owner: auth._id,
      status: TEAM_STATUS.ACTIVE
    });
    if (!team) {
      return Promise.reject(new APIError(404, [
        {
          msg: 'Team not found.',
          param: 'teamNotFound',
        },
      ]));
    }
    const battleNotDone = await BattleHistory.find({
      teams: { $in: [id] },
      endAt: { $exists: false }
    }).distinct('roomId')
    const roomCache = await RoomCache.findOne({
      roomId: battleNotDone,
    })
    if (roomCache) {
      return Promise.reject(new APIError(400, [
        {
          msg: 'Team is in a battle',
          param: 'TEAM_IS_IN_A_BATTLE'
        }
      ]))
    }
    const checkTeam = await validateTeam(auth, data, id);
    if (checkTeam?.length) {
      return Promise.reject(new APIError(403, checkTeam));
    }
    const currentDragons = team.dragons.map((dragon) => dragon.id);
    let hasChangeDragons = false;
    data.dragons.forEach((dragon) => {
      if (!currentDragons.includes(dragon.id)) {
        hasChangeDragons = true;
      }
    })
    if (hasChangeDragons) {
      const dragonsOut = [];
      const newDragons = data.dragons.map(dragon => Number(dragon.id));
      currentDragons.forEach(dragonId => {
        if (!newDragons.includes(dragonId)) {
          dragonsOut.push(dragonId)
        }
      });
      await lockBattleRewardDragons(dragonsOut);
      await TeamLog.create({
        team: id,
        oldDragons: currentDragons,
        newDragons: data.dragons.map((item) => item.id)
      })
    }
    delete data.owner;
    await Team.updateOne({ _id: id }, { $set: data });
    return true;
  } catch (error) {
    logger.error('TeamService createTeam error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function updateLockRewardViaUpdateDragon(dragonId, newOwner) {
  try {
    const dragon = await Dragons.findOne({ id: dragonId });
    if (!dragon || !dragon.owner || dragon.owner?.toLowerCase() === newOwner.toLowerCase()) return;
    const teamExistDragon = await Team.find({
      dragons: {
        $elemMatch: {
          id: dragon.id
        }
      },
      status: TEAM_STATUS.ACTIVE
    }).lean();
    if (!teamExistDragon?.length) return;
    const promise = teamExistDragon.map(async (team) => {
      const dragons = team.dragons.filter(dragon => dragon.id !== dragonId);
      await Team.updateOne(
        {
          _id: team._id
        },
        {
          $set: {
            dragons
          }
        }
      )
    })
    await Promise.all(promise);
    await lockBattleRewardDragons([dragonId]);
  } catch (error) {
    console.log('Error in updateLockBattleRewardDragon', error);
  }
}

/**
 *
 * @param {array} dragons
 * @returns {Promise<void>}
 */
export async function lockBattleRewardDragons(dragons) {
  try {
    await Dragons.updateMany(
      {
        id: { $in: dragons }
      },
      {
        $set: {
          lockReward: Date.now() + CHANGE_TEAM_LOCK_DURATION_DAYS * 24 * 60 * 60 * 1000
        }
      }
    )
  } catch (error) {
    console.log('Error in lockBattleRewardDragons => ', error);
  }
}

export async function deleteTeam(id, owner) {
  try {
    const team = await Team.findOne({ _id: id, owner });
    if (!team || team.status !== TEAM_STATUS.ACTIVE) {
      return Promise.reject(new APIError(404, [
        {
          msg: 'Team not found.',
          param: 'teamNotFound',
        },
      ]));
    }
    team.status = TEAM_STATUS.DELETED;
    await Promise.all([
      team.save(),
      lockBattleRewardDragons(team.dragons.map(dragon  => dragon.id))
    ])
    return true
  } catch (error) {
    logger.error('TeamService deleteTeam error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function getTeam(id, options) {
  try {
    const team = await Team.findOne({
      _id: id,
      status: TEAM_STATUS.ACTIVE
    });
    if (!team) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Team not found',
          params: 'TEAM_NOT_FOUND'
        }
      ]))
    }
    if (options.isSelect) {
      return team;
    }
    return await Team.getMetaData(team)
  } catch (error) {
    logger.error('TeamService deleteTeam error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

/**
 *
 * @param {string} id
 * @param options
 * @param {boolean} options.isBattle
 * @param {string} options.battleType
 * @param {string} options.defaultTeam
 * @param {string} owner
 * @returns {Promise<unknown>}
 */
export async function getDetailTeam(id, options, owner) {
  try {
    const team = await Team.findOne({
      _id: id,
      status: TEAM_STATUS.ACTIVE
    });
    if (!team) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Team not found',
          params: 'TEAM_NOT_FOUND'
        }
      ]))
    }
    if (options?.isBattle) {
      const config = await Config.findOne({}).lean();
      if (config?.maintenanceGame?.preventBattle) {
        return {
          error: 'The server is under maintenance. Please try again in a few minutes!'
        }
      }
      const battleNotDone = await BattleHistory.find({
        players: { $in: [owner] },
        endAt: { $exists: false }
      }).distinct('roomId')
      const roomCache = await RoomCache.findOne({
        roomId: battleNotDone,
      })
      if (roomCache && !options.defaultTeam) {
        return {
          error: 'You are in another battle.'
        }
      }
    }
    return await Team.getMetaData(team, true, true, options.battleType)
  } catch (error) {
    logger.error('TeamService deleteTeam error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export const checkCharactersExistsClass = (characters, className) => {
  try {
    return !!characters?.find((character) => character.class === className)
  } catch (error) {
    console.log('Error in checkCharactersExistsClass => ', error);
  }
}

export const increaseStatsWithSpecialClass = (character, className) => {
  try {
    if (className === DRAGON_CLASS.YINYANG && Object.values(DRAGON_CLASSIC_CLASS).includes(character.class)) {
      return {
        ...character.stats,
        attack: Math.ceil(character.stats.attack + character.stats.attack * 5 / 100),
        defend: Math.ceil(character.stats.defend + character.stats.defend * 5 / 100),
      }
    }

    if (className === DRAGON_CLASS.LEGEND) {
      if (Object.values(DRAGON_CLASSIC_CLASS).includes(character.class)) {
        return {
          ...character.stats,
          attack: Math.ceil(character.stats.attack + character.stats.attack * 10 / 100),
          defend: Math.ceil(character.stats.defend + character.stats.defend * 10 / 100),
        }
      }
      if (character.class === DRAGON_CLASS.YINYANG) {
        return {
          ...character.stats,
          attack: Math.ceil(character.stats.attack + character.stats.attack * 5 / 100),
          defend: Math.ceil(character.stats.defend + character.stats.defend * 5 / 100),
        }
      }
    }

    return character.stats
  } catch (error) {
    console.log('Error in increaseStatsWithSpecialClass => ', error);
  }
}

export const handleInitStats = (dragon, hasYinyangClass = false, hasLegendClass = false, battleType) => {
  try {
    const { equipments } = dragon;
    Object.keys(dragon.stats).map((key) => {
      const equipmentBuff = equipments?.filter(equipment => equipment.stat === key) || [];
      const numberIncreaseByEquipments = equipmentBuff.reduce((pre, cur) => pre + cur.point, 0);
      dragon.stats[key] = dragon.stats[key] + (dragon?.potential + 1) * ((dragon.level || 1) - 1)
      if (key === 'health') {
        if (battleType === BATTLE_TYPES.ARENA) {
          dragon.stats[key] += 10;
        } else {
          dragon.stats[key] *= 4;
        }
      }
      if (key === 'defend') {
        const baseDefend = dragon.stats[key];
        dragon.stats[key] = dragon.stats[key] * 2;
        if (battleType !== BATTLE_TYPES.ARENA) {
          // const skillDefend = dragon.skills.reduce((previousValue, currentValue) => previousValue + (currentValue.defend || 0), 0);
          const skillDefend = dragon.skills.reduce((previousValue, currentValue) => previousValue + Math.ceil( baseDefend * (currentValue.defend || 0) / 100), 0);
          dragon.stats[key] += skillDefend;
          dragon.stats.baseDefend = baseDefend;
        } else {
          dragon.stats.preDefend = dragon.stats.defend;
        }
      }
      dragon.stats[key] += numberIncreaseByEquipments;
      if (key === 'defend' && battleType === BATTLE_TYPES.ARENA) {
        dragon.stats.preDefend = dragon.stats.defend;
      }
    })

    if (hasYinyangClass) {
      dragon.stats = increaseStatsWithSpecialClass(dragon, DRAGON_CLASS.YINYANG);
    }

    if (hasLegendClass) {
      dragon.stats = increaseStatsWithSpecialClass(dragon, DRAGON_CLASS.LEGEND);
    }

    dragon.currentStats = Object.assign({}, dragon.stats);

    return dragon
  } catch (error) {
    console.log('Error in handleInitStats => ', error);
  }
}



/**
 *
 * @param query
 * @param {number} query.rowPerPage
 * @param {string} query.textSearch
 * @param {string} query.owner
 * @returns {Promise<{totalItems: *, data: *, totalPage: number, currentPage: number}>}
 */
export async function getTeams(query) {
  try {
    const {
      textSearch,
      rowPerPage,
      owner
    } = query;
    let page = Number(query.page || 1).valueOf();
    if (page < 1) {
      page = 1;
    }
    let pageLimit = Number(rowPerPage || DEFAULT_PAGE_LIMIT).valueOf();
    if (pageLimit > MAX_PAGE_LIMIT || pageLimit < 1) {
      pageLimit = MAX_PAGE_LIMIT;
    }
    const skip = (page - 1) * pageLimit;
    const conditions = {
      status: TEAM_STATUS.ACTIVE
    };
    if (owner) {
      conditions.owner = owner;
    }
    if (textSearch) {
      conditions.name = { $regex: validSearchString(textSearch) };
    }
    const promises = await Promise.all([
      Team.find(conditions).sort({ _id: 1 }).skip(skip).limit(pageLimit),
      Team.countDocuments(conditions)
    ]);
    const data = await Team.getMetaData(promises[0], false)
    return {
      data,
      currentPage: page,
      totalPage: Math.ceil(promises[1] / pageLimit),
      totalItems: promises[1]
    };
  } catch (error) {
    logger.error('TeamService getTeams error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function validateTeam(auth, data, teamId = null) {
  try {
    const wallet = auth.address;
    const error = [];
    if (!data?.name) {
      error.push({
        param: 'name',
        msg: 'Dragon team is not empty.'
      });
    }
    if (!data?.dragons || data?.dragons?.length < 3) {
      error.push({
        param: 'dragons',
        msg: 'The number of dragons must be 3.'
      });
    } else {
      const checked = [];
      const checkedDragon = [];
      const checkedPosition = [];
      await Promise.all(data?.dragons?.map( async dragon => {
        if(checkedDragon.indexOf(dragon.id) === -1) {
          checkedDragon.push(dragon.id)
        }
        if(checkedPosition.indexOf(dragon.position) === -1) {
          checkedPosition.push(dragon.position)
        }
        const info = await Dragons.findOne({ id: dragon.id });
        const conditionCheckExist = {
          dragons: {
            $elemMatch: {
              id: dragon.id
            }
          },
          owner: auth._id,
          status: TEAM_STATUS.ACTIVE
        };
        if (teamId) {
          conditionCheckExist._id = { $ne: teamId }
        }
        const checkExist = await Team.countDocuments(conditionCheckExist);
        if (!info) {
          checked.push({
            param: 'dragons',
            error: `Dragon ${dragon.id} not found`
          });
        } else if (Web3.utils.toChecksumAddress(info.owner) !== Web3.utils.toChecksumAddress(wallet)) {
          checked.push({
            param: 'dragons',
            error: `You are not the owner #${dragon.id}`
          });
        }
        if (checkExist) {
          checked.push({
            param: 'dragons',
            error: `Dragon #${dragon.id} is exist on other team.`
          });
        }
      }));
      if (checkedDragon?.length !== 3) {
        checked.push({
          param: 'dragons',
          error: `Dragon is duplicated!`
        });
      }
      if (checkedPosition?.length !== 3) {
        checked.push({
          param: 'dragons',
          error: `Position is duplicated!`
        });
      }
      if (checked?.length) {
        error.push({ dragons: checked });
      }
    }

    return error;
  } catch (error) {
    logger.error('TeamService validateTeam error:', error);
    throw new APIError(500, 'Internal server error');
  }
}


/**
 *
 * @param options
 * @param {number} options.limit
 * @param {number} options.page
 * @param {number} options.skip
 * @param {boolean} options.isOwner
 * @param {string} options.textSearch
 * @param {string} auth.address
 * @param {string} options.type
 * @returns {Promise<void>}
 */
export async function getRanks(options, auth) {
  try {
    const conditions = {
      status: TEAM_STATUS.ACTIVE
    };
    const type = options.type || 'pvp';
    let sort = {
      'point.pvp': -1,
      'battleTime.pvp': 1,
    }
    if (options.type === 'pve') {
      sort = {
        'point.pve': -1,
        'battleTime.pve': 1,
      }
    }
    if (options.textSearch) {
      conditions.name = { $regex: validSearchString(options.textSearch) };
    }
    if (options.isOwner) {
      conditions.owner = auth._id
    }
    const promises = await Promise.all([
      Team.find(conditions).sort(sort).skip(options.skip).limit(options.limit),
      Team.countDocuments(conditions)
    ]);
    const data = await Promise.all([
      Team.getMetaData(promises[0], false),
      getPoolReward(),
      getRatioRewardViaRanking(type)
    ])
    const poolReward = data[1];
    const ratioReward = data[2];
    return {
      data: data[0].map((team) => ({
        ...team,
        reward: {
          [type]: team?.point?.[type] ? poolReward?.[type] * ((ratioReward[team?.ranking?.[type]] || 0) / 100) : 0
        }
      })),
      currentPage: options.page,
      totalPage: Math.ceil(promises[1] / options.limit),
      totalItems: promises[1]
    };
  } catch (error) {
    logger.error('TeamService validateTeam error:', error);
    throw new APIError(500, 'Internal server error');
  }
}


export async function getTeamRankingPvP(team) {
  try {
    const promise = [
      Team.countDocuments({
        'point.pvp': { $gt: team?.point?.pvp || 0 },
        status: TEAM_STATUS.ACTIVE
      }),
      Team.find({
        'point.pvp': team?.point?.pvp || 0,
        status: TEAM_STATUS.ACTIVE
      }).sort({ 'battleTime.pvp': 1 }).lean()
    ];
    const ranking = await Promise.all(promise);
    const idTeamSamePoint = ranking[1].map(item => item._id.toString())
    const indexTeam = idTeamSamePoint.indexOf(team._id.toString());
    return ranking[0] + (indexTeam !== -1 ? indexTeam + 1 : 0);
  } catch (error) {
    logger.error('TeamService validateTeam error:', error);
  }
}


export async function getTeamRankingPvE(team) {
  try {
    const promise = [
      Team.countDocuments({
        'point.pve': { $gt: team?.point?.pve || 0 },
        status: TEAM_STATUS.ACTIVE
      }),
      Team.find({
        'point.pve': team?.point?.pve || 0,
        status: TEAM_STATUS.ACTIVE
      }).sort({ 'battleTime.pve': 1 }).lean()
    ];
    const ranking = await Promise.all(promise);
    const idTeamSamePoint = ranking[1].map(item => item._id.toString())
    const indexTeam = idTeamSamePoint.indexOf(team._id.toString());
    return ranking[0] + (indexTeam !== -1 ? indexTeam + 1 : 0);
  } catch (error) {
    logger.error('TeamService getTeamRankingPvE error:', error);
  }
}

export async function getTeamRankingPvEV2(teams, team) {
  try {
    const idTeamSamePoint = teams
      .filter(item => item?.point?.pve === (team?.point?.pve || 0))
      .sort((a, b) => a < b ? -1 : 1).map(item => item._id.toString())
    const indexTeam = idTeamSamePoint.indexOf(team._id.toString());
    const teamHigherPoint = teams
      .filter(item => item?.point?.pve > (team?.point?.pve || 0))?.length;
    return teamHigherPoint + (indexTeam !== -1 ? indexTeam + 1 : 0);
  } catch (error) {
    logger.error('TeamService getTeamRankingPvEV2 error:', error);
  }
}

export async function getTeamRankingPvPV2(teams, team) {
  try {
    const idTeamSamePoint = teams
      .filter(item => item?.point?.pvp === (team?.point?.pvp || 0))
      .sort((a, b) => a < b ? -1 : 1).map(item => item._id.toString())
    const indexTeam = idTeamSamePoint.indexOf(team._id.toString());
    const teamHigherPoint = teams
      .filter(item => item?.point?.pvp > (team?.point?.pvp || 0))?.length;
    return teamHigherPoint + (indexTeam !== -1 ? indexTeam + 1 : 0);
  } catch (error) {
    logger.error('TeamService getTeamRankingPvPV2 error:', error);
  }
}


export async function clearDragonsInOtherTeams(teamId, dragonIds) {
  try {
    const teams = await Team.find({
      _id: { $ne: teamId },
      dragons: {
        $elemMatch: {
          id: { $in: dragonIds }
        }
      }
    }).lean();
    const promise = teams.map(async (team) => {
      const dragons = team.dragons.filter(dragon => !dragonIds.includes(dragon.id));
      const dragonsExist = team.dragons.filter(dragon => dragonIds.includes(dragon.id)).map(item => item.id);
      await Team.updateOne(
        {
          _id: team._id,
        },
        {
          $set: {
            dragons
          }
        }
      )
      if (dragonsExist?.length) {
        await lockBattleRewardDragons(dragonsExist);
      }
    })
    await Promise.all(promise);
  } catch (error) {
    logger.error('TeamService clearDragonsInOtherTeams error:', error);
  }
}

/**
 * @param options
 * @returns {Promise<{totalItems: *, data, totalPages: number, currentPage: *}>}
 */
export async function adminGetListTeams(options) {
  try {
    const conditions = {
      status: TEAM_STATUS.ACTIVE
    };
    if (options.textSearch) {
      conditions.$or = [
        {
          name: { $regex: options.textSearch, $options: 'i' }
        },
        {
          dragons:  { $elemMatch: { id: Number(options.textSearch) }}
        }
      ]
    }
    if (options.owner) {
      conditions.owner = options.owner
    }
    const promise = [
      Team.countDocuments(conditions),
      Team.find(conditions).limit(options.limit).skip(options.skip).populate('owner')
    ];
    const data = await Promise.all(promise);
    const teams = await Promise.all(data[1].map(async team => {
      team = team.toJSON();
      const teamRankingData = await Promise.all([
        getTeamRankingPvP(team),
        getTeamRankingPvE(team)
      ]);
      team.ranking = {
        pvp: teamRankingData[0],
        pve: teamRankingData[1]
      };
      return team;
    }))
    return {
      data: teams,
      totalItems: data[0],
      currentPage: options.page,
      totalPages: Math.ceil(data[0] / options.limit)
    };
  } catch (error) {
    logger.error('TeamService adminGetListTeams error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function increaseTurnPvePerTeam(id) {
  try {
    const team = await Team.findById(id).lean();
    if (!team) {
      return Promise.reject(new APIError(403, [{
        msg: 'Team not found',
        param: 'TEAM_NOT_FOUND'
      }]))
    }
    await Team.updateOne({
      _id: team._id
    }, {
      $set: {
        'battleTimes.pve': (team.battleTimes?.pve || 0) + INITIAL_PVE_TIMES
      }
    })
    return true;
  } catch (error) {
    logger.error('TeamService increaseTurnPvePerTeam error:', error);
    throw new APIError(500, 'Internal server error');
  }
}


export async function resetRankingPvE(teamId) {
  try {
    if (!teamId) return;
    await Team.updateOne(
      {
        _id: teamId
      }, {
        $set: {
          'battleTime.pve': 0,
          'point.pve': 0
        }
      }
    )
  } catch (error) {
    logger.error('TeamService resetRankingPvE error:', error);
  }
}

export async function resetRankingPvP(teamId) {
  try {
    if (!teamId) return;
    await Team.updateOne(
      {
        _id: teamId
      }, {
        $set: {
          'battleTime.pvp': 0,
          'point.pvp': 0
        }
      }
    )
  } catch (error) {
    logger.error('TeamService resetRankingPvP error:', error);
  }
}

export async function addDefaultTeam(data) {
  try {
    const defaultTeam = await DefaultTeam.findOne({
      team: data.team
    })
    if (defaultTeam) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Team is exists',
          param: 'teamExists'
        }
      ]))
    }
    return await DefaultTeam.create(data);
  } catch (error) {
    logger.error('TeamService addDefaultTeam error:', error);
    throw error;
  }
}


export async function editDefaultTeam(id, data) {
  try {
    const defaultTeam = await DefaultTeam.findOneAndUpdate({ _id: id }, { $set: data });
    return !!defaultTeam
  } catch (error) {
    logger.error('TeamService editDefaultTeam error:', error);
    throw error;
  }
}

export async function deleteDefaultTeam(id) {
  try {
    return await DefaultTeam.deleteOne({ _id: id });
  } catch (error) {
    logger.error('TeamService deleteDefaultTeam error:', error);
    throw error;
  }
}

/**
 * Get list default team
 * @param {number} options.page
 * @param {number} options.limit
 * @param {number} options.skip
 * @param {number} options.rowPerPage
 * @returns {Promise<void>}
 */
export async function getDefaultTeams(options) {
  try {
    const data = await Promise.all([
      DefaultTeam.countDocuments({}),
      DefaultTeam
        .find({})
        .sort({ _id: -1 })
        .limit(options.limit)
        .skip(options.skip)
        .populate({ path: 'team', select: '_id name dragons point status'})
    ]);
    return {
      data: data[1],
      totalItems: data[0],
      currentPage: options.page,
      totalPages: Math.ceil(data[0] / options.limit)
    }
  } catch (error) {
    logger.error('TeamService getDefaultTeams error:', error);
    throw error;
  }
}


export async function getAvailableDefaultTeam() {
  try {
    const defaultTeams = await DefaultTeam.find({}).populate({
      path: 'team',
      select: 'dragons _id name point battleTime',
      populate: {
        path: 'owner',
        select: '_id address'
      }
    }).lean();
    const promise = defaultTeams.map(async (defaultTeam) => {
      const { team } = defaultTeam;
      if (team.dragons?.length !== 3) {
        return null;
      }
      const battleNotDone = await BattleHistory.find({
        teams: { $in: [team._id] },
        endAt: { $exists: false }
      }).distinct('roomId')
      const roomCache = await RoomCache.findOne({
        roomId: battleNotDone,
      })
      if (roomCache) {
        return null;
      }
      team.ranking = await getTeamRankingPvP(team);
      return team;
    })
    const data = await Promise.all(promise);
    return data.filter(team => team).sort((a, b) => a.ranking < b.ranking ? -1 : 1).map(team => ({
      userId: team.owner._id,
      address: team.owner.address,
      teamId: team._id,
      rank: team.ranking,
      point: team.point.pvp,
      battleTime: team.battleTime.pvp,
      defaultTeam: true
    }));
  } catch (error) {
    logger.error('TeamService getAvailableDefaultTeam error:', error);
    throw error;
  }
}
