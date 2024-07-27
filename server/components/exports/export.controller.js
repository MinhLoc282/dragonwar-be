import * as ExportService from './export.service';
import { DEFAULT_LIMIT_QUERY, MAX_PAGE_LIMIT } from '../../constants';

export async function getExports(req, res, next) {
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
    const data = await ExportService.getExports(options);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}


export async function exportRankingRewardPvE(req, res, next) {
  try {
    const data = await ExportService.exportRankingRewardPvE();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}


export async function exportPvpRanking(req, res, next) {
  try {
    const data = await ExportService.exportRankingRewardPvP();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}
