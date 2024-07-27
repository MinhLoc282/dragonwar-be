import logger from '../../server/util/logger';
import Report from '../../server/components/report/report.model';
import Dragons from '../../server/components/dragon/dragon.model';
import History from '../../server/components/dragon/history.model';
import BalanceFluctuation from '../../server/components/user/balanceFLuctuation.model';
import Users from '../../server/components/user/user.model';
import Config from '../../server/components/config/config.model';
import {
  BALANCE_FLUCTUATION_STATUS,
  HISTORY_TYPE,
  INITIAL_PVE_TIMES, INITIAL_PVP_TIMES,
  TEAM_STATUS
} from '../../server/constants';
import { getRedisInfo, setRedisInfo } from '../../server/helpers/redis';
import { getRandomString } from '../../server/helpers';
import Team from "../../server/components/team/team.model";
import {balanceOf} from "../../server/web3/kai/readContract/token";
import { DRAGON_TICKET, DRAGON_TICKET_PVP, DRAGON_TOKEN_ADDRESS } from '../../server/config';
import { exportRankingRewardPvE, exportRankingRewardPvP } from '../../server/components/exports/export.service';

export async function createDataStart() {
  try {
    const data = await Report.find({}).sort({ _id: -1 }).limit(1);
    const report = data.length ? data[0] : {};
    if (JSON.stringify(report) !== '{}') {
     await Report.create({
       dragons: report.dragons,
       breeding: report.breeding,
       adventure: report.adventure,
       boots: report.boots,
       dragonsSale: report.dragonsSale,
       kaiSale: report.kaiSale,
       dragonsSire: report.dragonsSire,
       kaiSire: report.kaiSire,
       totalItems: report.totalItems,
       burnedItems: report.burnedItems,
       itemsSale: report.itemsSale,
       kaiSaleItems: report.kaiSaleItems,
       feeSaleItems: report.feeSaleItems,
       date: new Date(new Date().setHours(0, 0, 0, 0))
     });
    }
  } catch (error) {
    logger.error('createDataStart error:');
    logger.error(error);
    throw error;
  }
}

export async function syncDataReport() {
  try {
    const total = await Report.countDocuments();
    if (!total) {
      const totalDragon = await Dragons.countDocuments();
      const breeding = await History.countDocuments({
        type: HISTORY_TYPE.PREGNANTMATRON
      });
      const adventure = await History.countDocuments({
        type: HISTORY_TYPE.TRAINING,
        price: 0
      });
      const boots = await History.countDocuments({
        type: HISTORY_TYPE.TRAINING,
        price: { $ne: 0 }
      });
      await Report.create({
        dragons: totalDragon,
        breeding: breeding,
        adventure: adventure,
        boots: boots
      });
      const dragons = await Dragons.find();
      await Promise.all(
        dragons.map(async (dragon) => {
          const stats = dragon.stats;
          const potential = dragon.potential + 1;
          const level = dragon?.level ?? 1;
          const totalStats = {
            mana: stats.mana + ((level - 1) * potential),
            health: stats.health + ((level - 1) * potential),
            attack: stats.attack + ((level - 1) * potential),
            defend: stats.defend + ((level - 1) * potential),
            speed: stats.speed + ((level - 1) * potential),
            morale: stats.morale + ((level - 1) * potential),
          };
          totalStats.total = totalStats.mana + totalStats.health + totalStats.attack + totalStats.defend + totalStats.speed + totalStats.morale;
          await Dragons.updateOne({ id: dragon.id }, { $set: { totalStats: totalStats } });
        })
      );
    }
  } catch (error) {
    logger.error('syncDataReport error:');
    logger.error(error);
    throw error;
  }
}

export async function createSession() {
  try {
    let sessions = await getRedisInfo('sessionIds');
    if (!sessions) {
      sessions = [];
    }
    const newSession = getRandomString(5);
    sessions.unshift(newSession);
    if (sessions.length >= 3) {
      sessions = sessions.slice(0, 3);
    }
    await setRedisInfo('sessionIds', sessions);
  } catch (error) {
    logger.error('createSession error:');
    logger.error(error);
    throw error;
  }
}


export async function unlockRewards() {
  try {
    const userIds = await BalanceFluctuation.find({
      status: BALANCE_FLUCTUATION_STATUS.LOCKED,
      lockedTime: {
        $lte: Date.now()
      }
    }).distinct('user');
    if (!userIds?.length) return;
    const promise = userIds.map(async (userId) => {
      const pendingRewards = await BalanceFluctuation.find({
        user: userId,
        status: BALANCE_FLUCTUATION_STATUS.LOCKED,
        lockedTime: {
          $lte: Date.now()
        }
      });
      const user = await Users.findById(userId);
      if (!pendingRewards?.length || !user) return null;
      const amountReward = pendingRewards.reduce((acc, cur) => acc + cur.amount, 0);
      await Users.updateOne(
        {
          _id: userId,
        },
        {
          $set: {
            'balance.base.unlock': (user?.balance?.base?.unlock || 0) + amountReward
          }
        }
      );
      const promiseUpdate = pendingRewards.map(async (balanceFluctuation) => {
        balanceFluctuation.status = BALANCE_FLUCTUATION_STATUS.UNLOCKED;
        await balanceFluctuation.save();
      });
      await Promise.all(promiseUpdate);
    });
    await Promise.all(promise);
  } catch (error) {
    logger.error('unlockRewards error:');
    logger.error(error);
    throw error;
  }
}


export async function resetTimesBattle() {
  try {
    await Team.updateMany({
      status: TEAM_STATUS.ACTIVE
    }, {
      $set: {
        'battleTimes.pve': INITIAL_PVE_TIMES,
        'battleTimes.pvp': INITIAL_PVP_TIMES
      }
    });
  } catch (error) {
    logger.error('resetTimesBattle error:');
    logger.error(error);
    throw error;
  }
}


export async function updatePoolRewardPvE() {
  try {
    const balance = await balanceOf(DRAGON_TOKEN_ADDRESS, DRAGON_TICKET);
    await Config.updateOne({}, { $set: { 'poolReward.pve': Math.floor(balance / 10 ** 18) } });
    return Math.floor(balance / 10 ** 18);
  } catch (error) {
    logger.error('updatePoolRewardPvE error:');
    logger.error(error);
    throw error;
  }
}

export async function updatePoolRewardPvP() {
  try {
    const balance = await balanceOf(DRAGON_TOKEN_ADDRESS, DRAGON_TICKET_PVP);
    await Config.updateOne({}, { $set: { 'poolReward.pvp': Math.floor(balance / 10 ** 18) } });
    return Math.floor(balance / 10 ** 18);
  } catch (error) {
    logger.error('updatePoolRewardPvE error:');
    logger.error(error);
    throw error;
  }
}

export async function updatePoolReward() {
  try {
    await updatePoolRewardPvE();
    await updatePoolRewardPvP();
  } catch (error) {
    logger.error('updatePoolReward error:');
    logger.error(error);
    throw error;
  }
}

export async function logRankingReward() {
  try {
    await exportRankingRewardPvE();
    await exportRankingRewardPvP();
  } catch (error) {
    logger.error('updatePoolRewardPvE error:');
    logger.error(error);
    throw error;
  }
}
