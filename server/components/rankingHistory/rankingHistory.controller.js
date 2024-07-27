import {DEFAULT_LIMIT_QUERY, MAX_PAGE_LIMIT} from "../../constants";
import * as RankingHistoryService from './rankingHistory.service';

export async function getRankingHistory(req, res, next) {
  try {
    let page = Number(req.query.page) || 1;
    if (page < 1 || page > MAX_PAGE_LIMIT) {
      page = MAX_PAGE_LIMIT;
    }
    const limit = Number(req.query.rowPerPage) || DEFAULT_LIMIT_QUERY;
    const skip = (page - 1) * limit;
    const options = {
      ...req.query,
      page,
      limit,
      skip
    };
    const data = await RankingHistoryService.getRankingHistory(options, req.auth._id);
    return res.json({
      success: true,
      payload: data
    })
  } catch (error) {
    return next(error);
  }
}

export async function getOverviewHistory(req, res, next) {
  try {
    const { query } = req;
    const data = await RankingHistoryService.getOverviewHistory(query);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function syncReportRanking(req, res, next) {
  try {
    const { query } = req;
    const data = await RankingHistoryService.syncReportRanking(query);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}