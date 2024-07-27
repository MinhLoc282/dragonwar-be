import * as AdventureService from './adventure.service';

export async function syncBoss(req, res, next) {
  try {
    await AdventureService.syncBoss();
    return res.json({
      success: true
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdventures(req, res, next) {
  try {
    const { query } = req;
    const data = await AdventureService.getAdventures(query);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function adminGetAdventures(req, res, next) {
  try {
    const data = await AdventureService.adminGetAdventures();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdventure(req, res, next) {
  try {
    const { id } = req.params;
    const { query } = req;
    const data = await AdventureService.getAdventure(id, query);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}


export async function editAdventure(req, res, next) {
  try {
    const { body, params: { id } } = req;
    await AdventureService.editAdventure(id, body);
    return res.json({
      success: true
    });
  } catch (error) {
    return next(error);
  }
}


export async function getBoss(req, res, next) {
  try {
    const data = await AdventureService.getBoss();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function editBoss(req, res, next) {
  try {
    const { body, params: { id } } = req;
    await AdventureService.editBoss(id, body);
    return res.json({
      success: true
    });
  } catch (error) {
    return next(error);
  }
}
