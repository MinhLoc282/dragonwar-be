import { Promise } from 'mongoose';
import BalanceFluctuation from '../user/balanceFLuctuation.model';
import APIError from '../../util/APIError';
import logger from '../../api/logger';
import {BALANCE_FLUCTUATION_STATUS, BALANCE_FLUCTUATION_TYPES, ROOT_PATH} from '../../constants';
import Users from '../user/user.model';
import Config from "../config/config.model";
import {getRedisInfo, setRedisInfo} from "../../helpers/redis";

const XLSX = require('xlsx');


export async function getRewardBattle(user, battleHistory) {
  try {
    const balanceFluctuation = await BalanceFluctuation.findOne({ user, battleHistory }).lean();
    if (!balanceFluctuation) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Reward not found',
          param: 'REWARD_NOT_FOUND'
        }
      ]));
    }
    return balanceFluctuation.amount;
  } catch (error) {
    logger.error('error getRewardBattle : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}


export async function claimToken(userId, amount) {
  try {
    if (!amount || amount <= 0) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Amount is invalid',
          param: 'AMOUNT_IS_INVALID'
        }
      ]));
    }
    // condition 1 request/24h
    const conditions = {
      user: userId,
      type: BALANCE_FLUCTUATION_TYPES.CLAIM,
      createdAt: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    };
    const checkExists = await BalanceFluctuation.countDocuments(conditions);
    if (checkExists) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Request per day is over',
          param: 'REQUEST_PER_DAY_IS_OVER'
        }
      ]));
    }
    const user = await Users.findById(userId).lean();
    if (!user?.balance?.base?.unlock || user?.balance?.base?.unlock < amount) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Balance is not enough',
          param: 'BALANCE_IS_NOT_ENOUGH'
        }
      ]));
    }
    const promise = [
      BalanceFluctuation.create({
        user: userId,
        oldBalance: {
          base: user.balance.base.unlock
        },
        newBalance: {
          base: user.balance.base.unlock - amount
        },
        amount,
        type: BALANCE_FLUCTUATION_TYPES.CLAIM,
        status: BALANCE_FLUCTUATION_STATUS.PENDING_WITHDRAWAL
      }),
      Users.updateOne(
        {
          _id: user._id
        },
        {
          $set: {
            'balance.base.unlock': user.balance.base.unlock - amount
          }
        }
      )
    ];
    const data = await Promise.all(promise);
    const balanceFluctuation = data[0];


    // handle contract here => txHash
    const txHash = '0xff2342e1096db87b3417f2663134693440c8b3b6c5fe94481f7b7fb64d8eb49a';


    if (true) { // transaction success
      await BalanceFluctuation.updateOne(
        {
          _id: balanceFluctuation._id
        },
        {
          $set: {
            status: BALANCE_FLUCTUATION_STATUS.SUCCESS_WITHDRAWAL,
            txHash
          }
        }
      );
    }
    return {
      txHash
    };
  } catch (error) {
    logger.error('error claimToken : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}

/**
 * @param options
 * @param {string} options.user
 * @param {number} options.limit
 * @param {number} options.skip
 * @param {number} options.page
 * @param {string} options.type
 * @param {string} options.status
 * @param {string} options.txHash
 * @returns {Promise<unknown>}
 */
export async function adminGetRewards(options) {
  try {
    const conditions = {};
    if (options.user) {
      conditions.user = options.user;
    }
    if (options.type) {
      conditions.type = options.type.split(',');
    }
    if (options.status) {
      conditions.status = options.status;
    }
    if (options.txHash) {
      conditions.txHash = { $regex: options.txHash, $options: 'i' };
    }
    const promise = [
      BalanceFluctuation.countDocuments(conditions),
      BalanceFluctuation
        .find(conditions)
        .sort({ createdAt: -1 })
        .limit(options.limit)
        .skip(options.skip)
        .populate('user')
        .populate('battleHistory')
    ];
    const data = await Promise.all(promise);
    return {
      data: data[1].map(item => item.toJSON()),
      totalItems: data[0],
      currentPage: options.page,
      totalPages: Math.ceil(data[0] / options.limit)
    };
  } catch (error) {
    logger.error('error adminGetRewards : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}


export async function getPoolReward() {
  try {
    const config = await Config.findOne({}).lean();
    return config?.poolReward;
  } catch (error) {
    logger.error('error getPoolRewardPvE : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}


export async function getRatioRewardPvE() {
  try {
    const workbook = XLSX.readFile(`${ROOT_PATH}/resource/PVE-Reward.xlsx`);
    const sheet_name_list = workbook.SheetNames;
    const xlDataRatioReward = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    const data = {};
    xlDataRatioReward.forEach(item => {
      data[item.rank] = item.reward;
    });
    await setRedisInfo('ratioRewardPVE', data);
    return data;
  } catch (error) {
    logger.error('error getRatioRewardPvE : ', error);
  }
}

export async function getRatioRewardPvP() {
  try {
    const workbook = XLSX.readFile(`${ROOT_PATH}/resource/PVP-Reward.xlsx`);
    const sheet_name_list = workbook.SheetNames;
    const xlDataRatioReward = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    const data = {};
    xlDataRatioReward.forEach(item => {
      data[item.rank] = item.reward;
    });
    await setRedisInfo('ratioRewardPVP', data);
    return data;
  } catch (error) {
    logger.error('error getRatioRewardPvP : ', error);
  }
}

export async function getRatioRewardViaRanking(type) {
  try {
    let ratioReward = await getRedisInfo(`ratioReward${type.toUpperCase()}`);
    if (!ratioReward) {
      if (type === 'pve') {
        ratioReward = await getRatioRewardPvE();
      }
      if (type === 'pvp') {
        ratioReward = await getRatioRewardPvP();
      }
    }
    return ratioReward;
  } catch (error) {
    logger.error('error getRatioRewardViaRanking : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}
