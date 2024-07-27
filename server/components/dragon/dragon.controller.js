import fs from 'fs';
import * as DragonService from './dragon.service';
import APIError from '../../util/APIError';
import { convertdecToHex, convertDragonAttribute } from '../../helpers/string.helper';
import {
 ROOT_PATH, COOLDOWNS, BIRTHCOST, PARTS_NAME_FILTER
} from '../../constants';
import { getDragonByBl } from './dragon.service';
import { getQueryListData } from '../../helpers';

export async function getMyDragons(req, res, next) {
  try {
    const { wallet } = req;
    const { query } = req;
    if (query.sale === 'FAVORITES') {
      const data = await DragonService.getDragonsFavorites(query, wallet);
      return res.json({
        success: true,
        payload: data
      });
    }
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
    const { query, wallet } = req;
    if (query.sale === 'FAVORITES') {
      const data = await DragonService.getDragonsFavorites(query, wallet);
      return res.json({
        success: true,
        payload: data
      });
    }
    const data = await DragonService.getDragons(query, wallet);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getNotifications(req, res, next) {
  try {
    const { query, wallet } = req;
    const data = await DragonService.getNotifications(query, wallet);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getTotalNotifications(req, res, next) {
  try {
    const { wallet } = req;
    const data = await DragonService.getTotalNotifications(wallet);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function resetNotifications(req, res, next) {
  try {
    const { wallet } = req;
    await DragonService.resetNotifications(wallet);
    return res.json({
      success: true
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
    const { wallet } = req;
    const data = await DragonService.getDragon(id, wallet);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}
export async function getDragonHistories(req, res, next) {
  try {
    const { id } = req.params;
    const data = await DragonService.getDragonHistories(id);
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
export async function getDragonSkills(req, res, next) {
  try {
    const { id } = req.params;
    const data = await DragonService.getDragonSkills(id);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}
export async function uploadIPFS(req, res, next) {
  try {
    const data = await DragonService.uploadIPFS();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}
export async function getCooldowns(req, res, next) {
  try {
    return res.json({
      success: true,
      payload: COOLDOWNS
    });
  } catch (error) {
    return next(error);
  }
}
export async function getBirthCost(req, res, next) {
  try {
    return res.json({
      success: true,
      payload: BIRTHCOST
    });
  } catch (error) {
    return next(error);
  }
}
export async function getParts(req, res, next) {
  try {
    return res.json({
      success: true,
      payload: PARTS_NAME_FILTER
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

export async function syncDragon(req, res, next) {
  try {
    const data = await DragonService.syncDragon();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getDragonAdventure(req, res, next) {
  try {
    const { wallet } = req;
    const data = await DragonService.getDragonAdventure(wallet);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}
export async function syncTotalStats(req, res, next) {
  try {
    const data = await DragonService.syncTotalStats();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function syncSkills(req, res, next) {
  try {
    const data = await DragonService.syncSkills();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function syncSkillsDragon(req, res, next) {
  try {
    const data = await DragonService.syncSkillsDragon();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}
export async function syncImagesDragon(req, res, next) {
  try {
    const data = await DragonService.syncImagesDragon();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function migrateDataDB(req, res, next) {
  try {
    const data = await DragonService.migrateDataDB();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function migrateDataDragon(req, res, next) {
  try {
    const { id } = req.params;
    const data = await DragonService.migrateDataDragon(id);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function favoritesDragon(req, res, next) {
  try {
    const { wallet } = req;
    const { id } = req.params;
    const data = await DragonService.favoritesDragon(id, wallet);
    return res.json({
      success: true
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
      arrayOfLines.forEach((line, index) => {
        const attributes = getDragonByBl(
          convertDragonAttribute(
            convertdecToHex(line)
          )
        );
      });
    });
  } catch (error) {
    return next(error);
  }
}

export async function getEffectIcons(req, res, next) {
  try {
    const data = await DragonService.getEffectIcons();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}


export async function getListDragons(req, res, next) {
  try {
    let { ids } = req.query;
    ids = ids?.split(',');
    const dragons = await DragonService.getListDragon(ids);
    return res.json({
      success: true,
      payload: dragons,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getFullSkills(req, res, next) {
  try {
    const data = await DragonService.getFulSkills();
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function generateResourceDragons(req, res, next) {
  try {
    const { query } = req;
    await DragonService.generateResourceDragons(query);
    return res.json({
      success: true
    });
  } catch (error) {
    return next(error);
  }
}


export async function updateUseDefaultSkill(req, res, next) {
  try {
    const { wallet, body } = req;
    await DragonService.updateUseDefaultSkill(body, wallet);
    return res.json({
      success: true
    });
  } catch (error) {
    return next(error);
  }
}

export async function getListDragonSkills(req, res, next) {
  try {
    const options = getQueryListData(req);
    const data = await DragonService.getListDragonSkills(options);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getListEffect(req, res, next) {
  try {
    const data = await DragonService.getListEffect();
    return res.json({
      success: true,
      payload: data,
    });
  } catch (error) {
    return next(error);
  }
}
