import * as ReportService from './report.service';
import { getQueryListData } from '../../helpers';

export async function getReports(req, res, next) {
  try {
    const { query } = req;
    const data = await ReportService.getReports(query);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}
export async function getReportChart(req, res, next) {
  try {
    const data = await ReportService.getReportChart();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getReportMarketplace(req, res, next) {
  try {
    const data = await ReportService.getReportMarketplace();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCountMarketplaceItems(req, res, next) {
  try {
    const data = await ReportService.getCountMarketplaceItems();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getReportMarketplaceListed(req, res, next) {
  try {
    const { query } = req;
    const data = await ReportService.getReportMarketplaceListed(query);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}


export async function getReportMarketplaceItems(req, res, next) {
  try {
    const { query } = req;
    const data = await ReportService.getReportMarketplaceItems(query);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getReportMarketplaceSold(req, res, next) {
  try {
    const { query } = req;
    const data = await ReportService.getReportMarketplaceSold(query);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getReportEvent(req, res, next) {
  try {
    const data = await ReportService.getReportEvent();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}
export async function syncData(req, res, next) {
  try {
    const data = await ReportService.syncData();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}


export async function adminGetDashboard(req, res, next) {
  try{
    const data = await ReportService.adminGetDashboard();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}


export async function getReportBattles(req, res, next) {
  try {
    const data = await ReportService.getReportBattles();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}


export async function syncReportDuplicateDocs(req, res, next) {
  try {
    const { query } = req;
    const data = await ReportService.syncReportDuplicateDocs(query);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}


export async function adminGetBattleReport(req, res, next) {
  try {
    const options = getQueryListData(req);
    const data = await ReportService.adminGetBattleReport(options);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}
