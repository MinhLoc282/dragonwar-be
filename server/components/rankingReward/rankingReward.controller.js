import * as RankingRewardService from './rankingReward.service';

export async function getRankingReward(req, res, next) {
  try {
    const data = await RankingRewardService.getRankingReward();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}
export async function getRankingUser(req, res, next) {
  try {
    const data = await RankingRewardService.getRankingUser();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function createRankingReward(req, res, next) {
  try {
    const { body } = req;
    await RankingRewardService.createRankingReward(body);
    return res.json({
      success: true,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateRankingReward(req, res, next) {
  try {
    const { body, params: { id } } = req;
    await RankingRewardService.updateRankingReward(id, body);
    return res.json({
      success: true
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateRankingUser(req, res, next) {
  try {
    const { body, params: { id } } = req;
    await RankingRewardService.updateRankingUser(id, body);
    return res.json({
      success: true
    });
  } catch (error) {
    return next(error);
  }
}

export async function initialRankingReward(req, res, next) {
  try {
    await RankingRewardService.initialRankingReward();
    return res.json({
      success: true
    });
  } catch (error) {
    return next(error);
  }
}

export async function initialRankingUser(req, res, next) {
  try {
    await RankingRewardService.initialRankingUser();
    return res.json({
      success: true
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteRankingReward(req, res, next) {
  try {
    const { id } = req.params;
    await RankingRewardService.deleteRankingReward(id);
    return res.json({
      success: true
    });
  } catch (error) {
    return next(error);
  }
}


export async function getRankingRewardById(req, res, next) {
  try {
    const { id } = req.params;
    const data = await RankingRewardService.getRankingRewardById(id);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}
