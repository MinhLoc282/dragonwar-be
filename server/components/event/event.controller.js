import * as EventService from './event.service';

export async function getEvents(req, res, next) {
  try {
    const { wallet } = req;
    const { query } = req;
    const data = await EventService.getEvents(wallet, query);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getEventsUser(req, res, next) {
  try {
    const { wallet } = req;
    const { query } = req;
    const data = await EventService.getEventsUser(wallet, query);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function syncDataRewardYY(req, res, next) {
  try {
    const data = await EventService.syncDataRewardYY();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getDragonByMonster(req, res, next) {
  try {
    const { wallet } = req;
    const { query } = req;
    const { id } = req.params;
    const data = await EventService.getDragonByMonster(id, wallet, query);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}
export async function getDragonOwner(req, res, next) {
  try {
    const { wallet } = req;
    const data = await EventService.getDragonOwner(wallet);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getEvent(req, res, next) {
  try {
    const { trxHash } = req.params;
    const data = await EventService.getEvent(trxHash);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}
