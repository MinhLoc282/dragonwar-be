import * as TeamService from './team.service';
import {DEFAULT_LIMIT_QUERY, MAX_PAGE_LIMIT} from "../../constants";
import { getQueryListData } from '../../helpers';

export async function createTeam(req, res, next) {
  try {
    const { body, auth } = req;
    const data = await TeamService.createTeam(auth, body);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateTeam(req, res, next) {
  try {
    const { params } = req;
    const { body, auth } = req;
    const data = await TeamService.updateTeam(params.id, auth, body);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getTeam(req, res, next) {
  try {
    const { params, query } = req;
    const data = await TeamService.getTeam(params.id, query);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getDetailTeam(req, res, next) {
  try {
    const { params, query, auth } = req;
    const data = await TeamService.getDetailTeam(params.id, query, auth._id);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteTeam(req, res, next) {
  try {
    const { params, auth } = req;
    const data = await TeamService.deleteTeam(params.id, auth._id);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getTeams(req, res, next) {
  try {
    const { query } = req;
    const data = await TeamService.getTeams(query);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getRanks(req, res, next) {
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
    const data = await TeamService.getRanks(options, req.auth);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function adminGetListTeams(req, res, next) {
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
    const data = await TeamService.adminGetListTeams(options);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function increaseTurnPve(req, res, next) {
  try {
    const { params: { id } } = req;
    await TeamService.increaseTurnPvePerTeam(id);
    return res.json({
      success: true
    });
  } catch (error) {
    return next(error);
  }
}

export async function addDefaultTeam(req, res, next) {
  try {
    const { body } = req;
    const data = await TeamService.addDefaultTeam(body);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function editDefaultTeam(req, res, next) {
  try {
    const { params: { id }, body } = req;
    const data = await TeamService.editDefaultTeam(id, body);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteDefaultTeam(req, res, next) {
  try {
    const { params: { id } } = req;
    const data = await TeamService.deleteDefaultTeam(id);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getDefaultTeams(req, res, next) {
  try {
    const options = getQueryListData(req);
    const data = await TeamService.getDefaultTeams(options);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAvailableDefaultTeam(req, res, next) {
  try {
    const data = await TeamService.getAvailableDefaultTeam();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}
