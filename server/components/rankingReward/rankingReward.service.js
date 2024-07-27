import { DEFAULT_REWARD_PVP, DEFAULT_USER } from './rankingReward.initial';
import logger from '../../api/logger';
import RankingReward from './rankingReward.model';
import APIError from '../../util/APIError';
import RankingUser from './rankingUser.model';


export async function initialRankingReward() {
  try {
    const rankingRewards = await RankingReward.countDocuments({});
    if (!rankingRewards) {
      const promise = DEFAULT_REWARD_PVP.map(async (data) => {
        await RankingReward.create(data);
      });
      await Promise.all(promise);
    }
  } catch (error) {
    logger.error('Error in initialRankingReward => ');
    logger.error(error);
  }
}


export async function initialRankingUser() {
  try {
    const rankingRewards = await RankingUser.countDocuments({});
    if (!rankingRewards) {
      const promise = DEFAULT_USER.map(async (data) => {
        await RankingUser.create(data);
      });
      await Promise.all(promise);
    }
  } catch (error) {
    logger.error('Error in initialRankingReward => ');
    logger.error(error);
  }
}


/**
 * @param data
 * @returns {Promise<boolean>}
 */
export async function createRankingReward(data) {
  try {
    await RankingReward.create(data);
    return true;
  } catch (error) {
    logger.error('error createRankingReward: ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}

export async function getRankingReward() {
  try {
    const rankingReward = await RankingReward.find({}).sort({ from: 1 });
    return rankingReward.map(item => item.toJSON());
  } catch (error) {
    logger.error('error getRankingReward : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}

export async function getRankingUser() {
  try {
    const rankingReward = await RankingUser.find({}).sort({ from: 1 });
    return rankingReward.map(item => item.toJSON());
  } catch (error) {
    logger.error('error getRankingUser : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}


export async function updateRankingReward(id, data) {
  try {
    const rankingReward = await RankingReward.findById(id);
    if (!rankingReward) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Ranking reward not found',
          param: 'RANKING_REWARD_NOT_FOUND'
        }
      ]));
    }
    await RankingReward.updateOne(
      {
        _id: id,
      }, {
        $set: data,
      }
    );
    return true;
  } catch (error) {
    logger.error('error updateRankingReward : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}
export async function updateRankingUser(id, data) {
  try {
    const rankingReward = await RankingUser.findById(id);
    if (!rankingReward) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Ranking user not found',
          param: 'RANKING_REWARD_NOT_FOUND'
        }
      ]));
    }
    await RankingUser.updateOne(
      {
        _id: id,
      }, {
        $set: data,
      }
    );
    return true;
  } catch (error) {
    logger.error('error updateRankingUser : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}

/**
 * @param {string} id
 * @returns {Promise<*>}
 */
export async function deleteRankingReward(id) {
  try {
    return await RankingReward.deleteOne({ _id: id });
  } catch (error) {
    logger.error('error deleteRankingReward : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}


export async function getRankingRewardById(id) {
  try {
    return await RankingReward.findById(id).lean();
  } catch (error) {
    logger.error('error getRankingRewardById : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}
