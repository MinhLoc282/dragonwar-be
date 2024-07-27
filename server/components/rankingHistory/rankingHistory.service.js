import logger from '../../api/logger';
import APIError from '../../util/APIError';
import RankingHistory from './rankingHistory.model';
import { conditionTimeInDay, conditionTimeInMonth, daysInMonth } from '../../helpers';
import ReportRanking from './reportRanking.model';
import BattleHistory from '../battleHistory/battleHistory.model';
import { BATTLE_TYPES } from '../../constants';

/**
 *
 * @param options
 * @param {string} options.type
 * @param {string} options.isOwner
 * @param {number} options.limit
 * @param {number} options.skip
 * @param {number} options.page
 * @param {number} options.month
 * @param {number} options.year
 * @param {string} ownerId
 * @returns {Promise<{totalItems: (number|module:mongoose), data: *[], totalPages: number, currentPage}>}
 */
export async function getRankingHistory(options, ownerId) {
  try {
    const conditions = {};
    if (options.type) {
      conditions.type = options.type;
    }
    if (options.isOwner === 'true') {
      conditions.owner = ownerId;
    }
    if (options.month && options.year) {
      let month = Number(options.month) + 1;
      let year = Number(options.year);
      if (Number(options.month) === 12) {
        month = 1;
        year = Number(options.year) + 1;
      }
      conditions.createdAt = conditionTimeInMonth(month, year);
    }
    const promise = [
      RankingHistory.countDocuments(conditions),
      RankingHistory
        .find(conditions)
        .sort({ rank: 1 })
        .limit(options.limit)
        .skip(options.skip)
        .populate('team')
    ];
    const data = await Promise.all(promise);
    return {
      data: data[1].map(item => item.toJSON()),
      totalItems: data[0],
      currentPage: options.page,
      totalPages: Math.ceil(data[0] / options.limit)
    };
  } catch (error) {
    logger.error('TicketService getRankingHistory error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

/**
 *
 * @param {string} options.type
 * @returns {Promise<Query<unknown[], Document<any, any, unknown>, {}, unknown>>}
 */
export async function getOverviewHistory(options) {
  try {
    const conditions = {};
    if (options.type) {
      conditions.type = options.type;
    }
    return await ReportRanking.find(conditions).sort({ year: 1, month: 1 }).lean();
  } catch (error) {
    logger.error('TicketService getRankingHistory error:', error);
    throw new APIError(500, 'Internal server error');
  }
}


/**
 * @param {number} options.month
 * @param {number} options.year
 * @param {string} options.type
 * @returns {Promise<void>}
 */
export async function syncReportRanking(options) {
  try {
    const { month, year, type } = options;
    const reportRanking = await ReportRanking.findOne({
      month,
      year,
      type
    });
    if (reportRanking) {
      return false;
    }
    const lastDay = daysInMonth(month, year);
    const lastDayString = `${year}-${month < 10 ? `0${month}` : month}-${lastDay < 10 ? `0${lastDay}` : lastDay}T23:59:59.999Z`;
    const timeTracking = new Date(new Date(lastDayString).getTime() + 2 * 60 * 60 * 1000);
    // on flow cron will track at 1st
    const rankingHistories = await RankingHistory.find({
      createdAt: conditionTimeInDay(timeTracking),
      type: type
    });
    if (!rankingHistories.length) return false;
    let poolReward = 0;
    let totalBattleTime = 0;
    rankingHistories.forEach((rankingHistory) => {
      poolReward += rankingHistory?.reward || 0;
      totalBattleTime += rankingHistory?.battleTime || 0;
    });
    const battleTimes = await BattleHistory.countDocuments({
      type: BATTLE_TYPES.ADVENTURE,
      createdAt: conditionTimeInMonth(month, year)
    });
    return await ReportRanking.create({
      month: month,
      year: year,
      reward: poolReward,
      battleTimes,
      battleTime: totalBattleTime,
      team: rankingHistories.length,
      type: BATTLE_TYPES.ADVENTURE
    });
  } catch (error) {
    logger.error('TicketService syncReportRanking error:', error);
    throw new APIError(500, 'Internal server error');
  }
}