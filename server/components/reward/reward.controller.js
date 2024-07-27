import * as RewardService from './reward.service';
import { DEFAULT_LIMIT_QUERY } from '../../constants';


export async function getRewardBattle(req, res, next) {
  try {
    const { params: { id }, auth: { _id } } = req;
    const data = await RewardService.getRewardBattle(_id, id);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function claimToken(req, res, next) {
  try {
    const { body: { amount }, auth: { _id } } = req;
    const data = await RewardService.claimToken(_id, Number(amount));
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}


export async function adminGetRewards(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.rowPerPage) || DEFAULT_LIMIT_QUERY;
    const skip = (page - 1) * limit;
    const options = {
      ...req.query,
      page,
      limit,
      skip
    };
    const data = await RewardService.adminGetRewards(options);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}


export async function getPoolReward(req, res, next) {
  try {
    const data = await RewardService.getPoolReward();
    return res.json({
      success: true,
      payload: data
    })
  } catch (error) {
    return next(error);
  }
}


export async function getRankingRewardPvE(req, res, next) {
  try {
    return res.json({
      success: true,
    });
  } catch (error) {
    return next(error);
  }
}
