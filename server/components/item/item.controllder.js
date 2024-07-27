import { getQueryListData } from '../../helpers';
import * as ItemService from './item.service';

export async function getItems(req, res, next) {
  try {
    const options = getQueryListData(req);
    const data = await ItemService.getItems(options);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getMintingItem(req, res, next) {
  try {
    const { auth: { _id } } = req;
  } catch (error) {
    return next(error);
  }
}

export async function getItemHistories(req, res, next) {
  try {
    const { params: { id, type } } = req;
    const options = getQueryListData(req);
    const data = await ItemService.getItemHistories(id, type, options);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function syncEquipments(req, res, next) {
  try {
    await ItemService.syncEquipments();
    return res.json({
      success: true
    });
  } catch (error) {
    return next(error);
  }
}

export async function getItem(req, res, next) {
  try {
    const { params: { type, id } } = req;
    const data = await ItemService.getItem(type, id);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
};


export async function migrateItem(req, res, next) {
  try {
    const { params: { type, id } } = req;
    await ItemService.migrateItem(type, id);
    return res.json({
      success: true
    });
  } catch (error) {
    return next(error);
  }
}

export async function upgradeSuccessRate(req, res, next) {
  try {
    const data = await ItemService.upgradeSuccessRate();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function mintItemTest(req, res, next) {
  try {
    const { query } = req;
    const data = await ItemService.mintItemTest(query);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function syncPendingItems(req, res, next) {
  try {
    await ItemService.syncPendingItems();
    return true;
  } catch (error) {
    return next(error);
  }
}

export async function getEquipments(req, res, next) {
  try {
    const options = getQueryListData(req);
    const data = await ItemService.getEquipments(options);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}
