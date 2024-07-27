import * as UserService from './user.service';
import {DEFAULT_LIMIT_QUERY, MAX_PAGE_LIMIT, USER_ROLE} from '../../constants';


export async function createUser(req, res, next) {
  try {
    const options = req.body;
    if (req.file?.filename) {
      options.file = req.file.filename;
    }
    const data = await UserService.createUser(options);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}


export async function getUsers(req, res, next) {
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
    const data = await UserService.getUsers(options);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const {
      body,
    } = req;
    const user = await UserService.login(body);
    return res.json({
      success: true,
      payload: user,
    });
  } catch (error) {
    return next(error);
  }
}

export async function loginAdmin(req, res, next) {
  try {
    const {
      body,
    } = req;
    const user = await UserService.login(body, USER_ROLE.ADMIN);
    return res.json({
      success: true,
      payload: user,
    });
  } catch (error) {
    return next(error);
  }
}



export async function getUserById(req, res, next) {
  try {
    const id = req.params.id;
    const user = await UserService.getUserById(id);
    return res.json({
      success: true,
      payload: user
    });
  } catch (error) {
    return next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const { auth } = req;
    const data = await UserService.getUserById(auth._id, true);
    return res.json({
      success: true,
      payload: data
    })
  } catch (error) {
    return next(error);
  }
}

export async function editUser(req, res, next) {
  try {
    const options = req.body;
    if (req.file?.filename) {
      options.file = req.file?.filename;
    }
    const user = await UserService.editUser(options, req.auth);
    return res.json({
      success: true,
      payload: user
    });
  } catch (error) {
    return next(error);
  }
}

export async function getSession(req, res, next) {
  try {
    const session = await UserService.getSession();
    return res.json({
      success: true,
      payload: session
    });
  } catch (error) {
    return next(error);
  }
}


export async function getBalanceFluctuation(req, res, next) {
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
    const data = await UserService.getBalanceFluctuation(options, req.auth._id);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function dailyCheckin(req, res, next) {
  try {
    const { auth: { _id } } = req;
    await UserService.dailyCheckin(_id);
    return res.json({
      success: true
    });
  } catch (error) {
    return next(error);
  }
}


export async function generateWhitelist(req, res, next) {
  try {
    await UserService.generateWhitelist();
    return res.json({
      success: true
    });
  } catch (error) {
    return next(error);
  }
}

export async function addWhitelist(req, res, next) {
  try {
    const { body } = req;
    await UserService.addWhitelist(body);
    return res.json({
      success: true
    });
  } catch (error) {
    return next(error);
  }
}

export async function gameGetUserById(req, res, next) {
  try {
    const { params: { id } } = req;
    const data = await UserService.gameGetUserById(id);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}
