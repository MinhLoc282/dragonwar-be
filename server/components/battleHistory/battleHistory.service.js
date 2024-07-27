import logger from '../../api/logger';
import APIError from '../../util/APIError';
import {BATTLE_TYPES} from "../../constants";
import BattleHistory from './battleHistory.model';
import BalanceFluctuation from "../user/balanceFLuctuation.model";
import RoomCache from './roomCache.model';


/**
 *
 * @param options
 * @param {number} options.page
 * @param {number} options.skip
 * @param {number} options.limit
 * @param {boolean} options.isWin
 * @param {string} options.dragon
 * @param {string} options.teamId
 * @param {number} options.sort
 * @param {string} address
 * @returns {Promise<never>}
 */
export async function getBattleHistories(options, userId) {
  try {
    const conditions = {
      result: { $exists: true }
    };
    conditions.players = userId.toString();
    if (options.teamId) {
      conditions.teams = options.teamId;
    }
    if (options.dragon) {
      conditions[`dragons.${options.dragon}`] = { $exists: true };
    }
    const promise = [
      BattleHistory.countDocuments(conditions),
      BattleHistory
        .find(conditions)
        .sort({ createdAt: options.sort })
        .skip(options.skip)
        .limit(options.limit)
        .populate('players')
        .populate('teams')
    ];
    const data = await Promise.all(promise);
    const battle = await BattleHistory.getMetaData(data[1]);
    return {
      data: battle,
      currentPage: options.page,
      totalPage: Math.ceil(data[0] / options.limit),
      totalItems: data[0]
    };
  } catch (error) {
    logger.error('error getBattleHistories : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}


export async function adminGetBattleHistories(options) {
  try {
    const conditions = {
      result: { $exists: true }
    };
    if (options.player) {
      conditions.players = { $in: [options.player] };
    }
    if (options.team) {
      conditions.teams = { $in: [options.team] };
    }
    if (options.dragon) {
      conditions[`dragons.${options.dragon}`] = { $exists: true };
    }
    if (options.type) {
      conditions.type = options.type;
    }
    const promise = [
      BattleHistory.countDocuments(conditions),
      BattleHistory
        .find(conditions)
        .sort({ createdAt: options.sort })
        .skip(options.skip)
        .limit(options.limit)
        .populate('players')
        .populate('teams')
    ];
    const data = await Promise.all(promise);
    const battle = await BattleHistory.getMetaData(data[1]);
    return {
      data: battle,
      currentPage: options.page,
      totalPage: Math.ceil(data[0] / options.limit),
      totalItems: data[0]
    };
  } catch (error) {
    logger.error('error getBattleHistories : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}

/**
 *
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function getBattleHistory(id) {
  try {
    const battleHistory = await BattleHistory.findById(id);
    if (!battleHistory) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Battle history not found',
          param: 'BATTLE_HISTORY_NOT_FOUND'
        }
      ]));
    }
    return battleHistory.toJSON();
  } catch (error) {
    logger.error('error getBattleHistories : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}

/**
 * @param {string} id
 * @returns {Promise<*>}
 */
export async function getAmountRewardByBattle(id) {
  try {
    return await BalanceFluctuation.findOne({
      battleHistory: id
    }).lean();
  } catch (error) {
    logger.error('error getAmountRewardByBattle : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}

export async function getCurrentArena(userId) {
  try {
    const battleNotDone = await BattleHistory.find({
      players: { $in: [userId] },
      endAt: { $exists: false }
    }).sort({ _id: -1 }).limit(1).lean();
    const battle = battleNotDone?.[0];
    if (!battle?.roomId || !battle?.sessions?.[userId]?.id || battle?.sessions?.[userId]?.connected) return null;
    const roomCache = await RoomCache.findOne({
      roomId: battle?.roomId,
    });
    if (!roomCache) return null;
    return {
      roomId: battle.roomId,
      sessionId: battle?.sessions?.[userId]?.id
    };
  } catch (error) {
    logger.error('TeamService getCurrentArena error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
