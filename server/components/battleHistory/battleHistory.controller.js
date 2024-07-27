import {DEFAULT_LIMIT_QUERY, MAX_PAGE_LIMIT} from '../../constants';
import * as BattleHistoryService from './battleHistory.service';

export async function getBattleHistories(req, res, next) {
  try {
    let page = Number(req.query.page) || 1;
    if (page < 1 || page > MAX_PAGE_LIMIT) {
      page = MAX_PAGE_LIMIT;
    }
    const { _id } = req.auth;
    const limit = Number(req.query.rowPerPage) || DEFAULT_LIMIT_QUERY;
    const skip = (page - 1) * limit;
    const sort = Number(req.query.sort) === 1 ? 1 : -1;
    const options = {
      ...req.query,
      page,
      limit,
      skip,
      sort,
    };
    const data = await BattleHistoryService.getBattleHistories(options, _id);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function adminGetBattleHistories(req, res, next) {
  try {
    let page = Number(req.query.page) || 1;
    if (page < 1 || page > MAX_PAGE_LIMIT) {
      page = MAX_PAGE_LIMIT;
    }
    const limit = Number(req.query.rowPerPage) || DEFAULT_LIMIT_QUERY;
    const skip = (page - 1) * limit;
    const sort = Number(req.query.sort) === 1 ? 1 : -1;
    const options = {
      ...req.query,
      page,
      limit,
      skip,
      sort,
    };
    const data = await BattleHistoryService.adminGetBattleHistories(options);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}


export async function getBattleHistory(req, res, next) {
  try {
    const { id } = req.params;
    const data = await BattleHistoryService.getBattleHistory(id);
    return res.json({
      success: true,
      payload: data
    })
  } catch (error) {
    return next(error);
  }
}


export async function getAmountRewardByBattle(req, res, next) {
  try {
     const { id } = req.params;
     const data = await BattleHistoryService.getAmountRewardByBattle(id);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}



export async function getCurrentArena(req, res, next) {
  try {
    const { auth: { _id } } = req;
    const currentArena = await BattleHistoryService.getCurrentArena(_id);
    return res.json({
      success: true,
      payload: currentArena
    });
  } catch (error) {
    return next(error);
  }
}
