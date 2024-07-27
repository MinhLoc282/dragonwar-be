import * as DragonService from './auction.service';
import Redis from '../../util/Redis';
import APIError from '../../util/APIError';
import { ROOT_PATH } from '../../constants';
import { convertdecToHex, convertDragonAttribute } from '../../helpers/string.helper';
import { getDragonByBl } from './auction.service';

const fs = require('fs');

export async function getMyDragons(req, res, next) {
  try {
    const { wallet } = req;
    const { query } = req;
    const data = await DragonService.getMyDragons(wallet, query);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getDragons(req, res, next) {
  try {
    const { query } = req;
    const data = await DragonService.getDragons(query);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getDragonRandom(req, res, next) {
  try {
    return res.json({
      success: true,
      payload: await DragonService.getDragonRandom()
    });
  } catch (error) {
    return next(error);
  }
}

export async function getDragon(req, res, next) {
  try {
    const { id } = req.params;
    const data = await DragonService.getDragon(id);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function hatchDragon(req, res, next) {
  try {
    const { wallet } = req;
    const { id } = req.params;
    const data = await DragonService.hatchDragon(id, wallet);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function migrateData(req, res, next) {
  try {
    const data = await DragonService.migrateData();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateRedis(req, res, next) {
  try {
    const data = [];
    const start = parseInt(req.query.start);
    const end = parseInt(req.query.end);
    if (!end || end < start) {
      throw new APIError(500, 'Internal server error');
    }
    for (let i = start; i <= end; i++) {
      data.push(i.toString());
    }
    await Redis.set('EGGS', JSON.stringify(data));
    return res.json({
      success: true
    });
  } catch (error) {
    return next(error);
  }
}

export async function checkHash(req, res, next) {
  try {
    const dest = `${ROOT_PATH}/resource/gen-700-ver2.txt`;
    const fileContent = fs.readFile(dest, 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      }
      const arrayOfLines = data.match(/[^\r\n]+/g);
      arrayOfLines.map((line, index) => {
        const attributes = getDragonByBl(
          convertDragonAttribute(
            convertdecToHex(line)
          )
        );
        const totalStats = attributes.stats.mana + attributes.stats.health + attributes.stats.attack + attributes.stats.defend + attributes.stats.speed + attributes.stats.morale;
      });
    });
  } catch (error) {
    return next(error);
  }
}
