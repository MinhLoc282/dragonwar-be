import web3 from 'web3';
var XLSX = require('xlsx')
import { Promise } from 'mongoose';
import Web3 from 'web3';
import logger from '../../api/logger';
import APIError from '../../util/APIError';
import Dragons from './dragon.model';
import User from '../user/user.model';
import Teams from '../team/team.model';
import {
  MAX_PAGE_LIMIT,
  DEFAULT_PAGE_LIMIT,
  DRAGON_TYPE,
  DRAGON_CLASS_NUMBER,
  DRAGON_ORDER_FIELDS,
  ORDER_BY,
  AUCTION_TYPE,
  WORKER_NAME,
  PARTS_NAME,
  COLOR,
  HISTORY_TYPE,
  DRAGON_CLASS,
  ROOT_PATH,
  EFFECT_LEVEL_VALUES,
  TEAM_STATUS,
  EFFECT_KEYS,
  EFFECT_LETHAL_LEVEL_VALUES, DRAGON_LEVELS, NFT_TYPE_NAMES, NFT_TYPES, PART_REPLACE_QUERY_ITEMS, LEVEL_EFFECT
} from '../../constants';
import {
  convertdecToHex,
  convertDragonAttribute,
  validSearchString
} from '../../helpers/string.helper';
import {
  getBlockNumber,
  getDragonOwner,
  getSalePriceById,
  getSirePriceById,
  getTokenById,
  getTotal
} from '../../web3/kai/readContract/kai';
import {generateSpineDragon, packageImageDragon, packageImageDragonSpine} from '../../helpers/imageAtlas';
import { getImageSize } from '../../helpers/resize';
import Redis from '../../util/Redis';
import AMPQ from '../../../rabbitmq/ampq';
import Favorites from './favorites.model';
import History from './history.model';
import Notification from './notification.model';
import NotificationOwner from './notificationOwner.model';
import { KAI_TIME_BLOCK } from '../../config';
import Report from '../report/report.model';
import Effect from './effect.model';
import Skill from './skill.model';
import SkillDragon from './skillDragon.model';
import {getImageLink} from "../../helpers/images";
import {updateLockRewardViaUpdateDragon} from "../team/team.service";
import { getEquipmentsByDragonId, getSkillsDragonWithNFT } from '../item/item.service';

export async function createDragon(data) {
  try {
    return await Dragons.create(data);
  } catch (error) {
    logger.error('DragonService createDragon error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function createDragonHistory(data) {
  try {
    await History.create(data);
    const notification = data;
    switch (data.type) {
      case HISTORY_TYPE.SUCCESSAUCTION:
        notification.owner = data.from;
        await Promise.all([
          Notification.create(notification),
          NotificationOwner.updateOne({
            owner: web3.utils.toChecksumAddress(data.from)
          }, {
            $inc: { total: 1 }
          }, { upsert: true, new: true, setDefaultsOnInsert: true }),
          Report.updateOne({
            date: new Date(new Date().setHours(0, 0, 0, 0))
          }, {
            $inc: { dragonsSale: 1, kaiSale: data.price }
          })
        ]);
        break;
      case HISTORY_TYPE.SUCCESSSIRING:
        notification.owner = data.from;
        await Promise.all([
          Notification.create(notification),
          NotificationOwner.updateOne({
            owner: web3.utils.toChecksumAddress(data.from)
          }, {
            $inc: { total: 1 }
          }, { upsert: true, new: true, setDefaultsOnInsert: true }),
          Report.updateOne({
            date: new Date(new Date().setHours(0, 0, 0, 0))
          }, {
            $inc: { dragonsSire: 1, kaiSire: data.price }
          })
        ]);
        break;
      case HISTORY_TYPE.BIRTHDAY:
        notification.owner = data.to;
        await Notification.create(notification);
        await NotificationOwner.updateOne({
          owner: web3.utils.toChecksumAddress(data.to)
        }, {
           $inc: { total: 1 }
          }, { upsert: true, new: true, setDefaultsOnInsert: true });
        break;
      default:
        break;
    }
    return;
  } catch (error) {
    logger.error('DragonService createDragonHistory error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function updateDragon(id, data) {
  try {
    if (data?.owner) {
      await updateLockRewardViaUpdateDragon(id, data.owner)
    }
    return await Dragons.updateOne({ id }, { $set: data });
  } catch (error) {
    logger.error('DragonService updateDragon error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function trainingDragon(id, xp, level, startLock, price) {
  try {
    const dragon = await Dragons.findOne({ id });
    if (!dragon) return;
    const promise = [];
    if (dragon?.level && dragon.level === level) {
      const dataUpdate = {
        xp, level
      }
      if (startLock) {
        dataUpdate.startLock = startLock;
      }
      promise.push(Dragons.updateOne({ id }, { $set: dataUpdate }));
    } else {
      const stats = dragon.stats;
      const potential = dragon.potential + 1;
      const total = {
        mana: stats.mana + ((level - 1) * potential),
        health: stats.health + ((level - 1) * potential),
        attack: stats.attack + ((level - 1) * potential),
        defend: stats.defend + ((level - 1) * potential),
        speed: stats.speed + ((level - 1) * potential),
        morale: stats.morale + ((level - 1) * potential),
      };
      total.total = total.mana + total.health + total.attack + total.defend + total.speed + total.morale;
      const dataUpdate = {
        xp, level, totalStats: total
      }
      if (startLock) {
        dataUpdate.startLock = startLock;
      }
      promise.push(Dragons.updateOne({ id }, { $set: dataUpdate }));
    }
    if (price) {
      promise.push(Report.updateOne({
        date: new Date(new Date().setHours(0, 0, 0, 0))
      }, {
 $inc: { boots: 1 }
}));
    } else {
      await Report.updateOne({
        date: new Date(new Date().setHours(0, 0, 0, 0))
      }, {
 $inc: { adventure: 1 }});
    }
    return await Promise.all(promise);
  } catch (error) {
    logger.error('DragonService updateDragon error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function birthDragon(id, matronId, owner) {
  try {
    const promises = [
      getDragonDetailFromBl(id, owner)
    ];
    if (matronId) {
      promises.push(updateDragonDetailFromBl(matronId));
    }
    promises.push(Report.updateOne({
        date: new Date(new Date().setHours(0, 0, 0, 0))
      }, {
 $inc: { dragons: 1 }
}));
    await Promise.all(promises);
    return;
  } catch (error) {
    logger.error('DragonService birthDragon error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function pregnantDragon(matronId, sireId) {
  try {
    const promises = [];
    if (matronId) {
      promises.push(updateDragonDetailFromBl(matronId));
    }
    if (sireId) {
      promises.push(updateDragonDetailFromBl(sireId));
    }
    promises.push(Report.updateOne({
      date: new Date(new Date().setHours(0, 0, 0, 0))
    }, {
 $inc: { breeding: 1 }
}));
    if (promises?.length) {
      await Promise.all(promises);
    }
    return;
  } catch (error) {
    logger.error('DragonService birthDragon error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function getDragonDetailFromBl(id, owner = '') {
  try {
    const dragonDetail = await Dragons.findOne({ id });
    let ownerAddress;
    if (!dragonDetail) {
      const dragon = await getTokenById(id);
      const attributes = getDragonByBl(
          convertDragonAttribute(
              convertdecToHex(dragon.genes)
          )
      );
      ownerAddress = owner.length ? owner : await getDragonOwner(id);
      let hatched;
      if (parseInt(dragon.sireId, 0)) {
        // For dragons with a sire, set hatching time to 1 hour (3600 seconds)
        hatched = parseInt(dragon.birthTime, 0) * 1000 + ((Math.floor(Math.random() * (3600 - 3300)) + 3300) * 1000);
      } else {
        // For dragons without a sire, also set hatching time to 1 hour (3600 seconds)
        hatched = parseInt(dragon.birthTime, 0) * 1000 + ((Math.floor(Math.random() * (3600 - 3300)) + 3300) * 1000);
      }
      const stats = attributes.stats;
      const potential = attributes.potential + 1;
      const level = 1;
      const totalStats = {
        mana: stats.mana + ((level - 1) * potential),
        health: stats.health + ((level - 1) * potential),
        attack: stats.attack + ((level - 1) * potential),
        defend: stats.defend + ((level - 1) * potential),
        speed: stats.speed + ((level - 1) * potential),
        morale: stats.morale + ((level - 1) * potential),
      };
      totalStats.total = totalStats.mana + totalStats.health + totalStats.attack + totalStats.defend + totalStats.speed + totalStats.morale;
      const data = {
        ...attributes,
        id: id,
        idString: id.toString(),
        name: `Dragon #${id}`,
        owner: ownerAddress,
        birth: parseInt(dragon.birthTime, 0) * 1000,
        hatched,
        genes: dragon.genes,
        generation: parseInt(dragon.generation, 0),
        type: DRAGON_TYPE.EGG,
        isGestating: dragon.isGestating,
        isReady: dragon.isReady,
        cooldownIndex: parseInt(dragon.cooldownIndex, 0),
        nextActionAt: parseInt(dragon.nextActionAt, 0),
        siringWithId: parseInt(dragon.siringWithId, 0),
        matronId: parseInt(dragon.matronId, 0),
        sireId: parseInt(dragon.sireId, 0),
        upgradeIndex: parseInt(dragon.upgradeIndex, 0),
        unicornation: parseInt(dragon.unicornation, 0),
        totalStats
      };
      const checked = await Dragons.findOne({ id });
      if (!checked) {
        return await createDragon(data);
      }
    }
    ownerAddress = owner.length ? owner : await getDragonOwner(id);
    return await updateDragon(id, { owner: ownerAddress });
  } catch (error) {
    logger.error('DragonService getDragonDetailFromBl error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function getDragonDetailFromBlToSync(id, owner = '') {
  try {
    const dragonDetail = await Dragons.findOne({ id });
    let ownerAddress;
    const promises = await Promise.all([
      getTokenById(id),
      getSalePriceById(id),
      getSirePriceById(id),
      syncSkillByDragon(id)
    ]);
    const dragon = promises[0];
    const salePrice = promises[1];
    const sirePrice = promises[2];
    const attributes = getDragonByBl(
      convertDragonAttribute(
        convertdecToHex(dragon.genes)
      )
    );
    ownerAddress = owner.length ? owner : await getDragonOwner(id);
    if (parseInt(salePrice.price, 0)) {
      attributes.price = web3.utils.fromWei(salePrice.price, 'ether');
      attributes.sale = AUCTION_TYPE.AUCTION;
      ownerAddress = salePrice.seller;
    } else if (parseInt(sirePrice.price, 0)) {
      attributes.price = web3.utils.fromWei(sirePrice.price, 'ether');
      attributes.sale = AUCTION_TYPE.SIRING;
      ownerAddress = sirePrice.seller;
    } else {
      attributes.price = 0;
      attributes.sale = null;
    }
    if (!dragonDetail) {
      let hatched;
      if (parseInt(dragon.sireId, 0)) {
        hatched = parseInt(dragon.birthTime, 0) * 1000 + ((Math.floor(Math.random() * (864000 - 604800)) + 1814400) * 1000);
      } else {
        hatched = parseInt(dragon.birthTime, 0) * 1000 + ((Math.floor(Math.random() * (3024000 - 1814400)) + 1814400) * 1000);
      }
      const data = {
        ...attributes,
        id: id,
        idString: id.toString(),
        name: `Dragon #${id}`,
        owner: ownerAddress,
        birth: parseInt(dragon.birthTime, 0) * 1000,
        hatched,
        genes: dragon.genes,
        generation: parseInt(dragon.generation, 0),
        type: DRAGON_TYPE.EGG,
        isGestating: dragon.isGestating,
        isReady: dragon.isReady,
        cooldownIndex: parseInt(dragon.cooldownIndex, 0),
        nextActionAt: parseInt(dragon.nextActionAt, 0),
        siringWithId: parseInt(dragon.siringWithId, 0),
        matronId: parseInt(dragon.matronId, 0),
        sireId: parseInt(dragon.sireId, 0),
        upgradeIndex: parseInt(dragon.upgradeIndex, 0),
        unicornation: parseInt(dragon.unicornation, 0)
      };
      return await createDragon(data);
    }
    const data = {
      ...attributes,
      owner: ownerAddress,
      isGestating: dragon.isGestating,
      isReady: dragon.isReady,
      cooldownIndex: parseInt(dragon.cooldownIndex, 0),
      nextActionAt: parseInt(dragon.nextActionAt, 0),
      siringWithId: parseInt(dragon.siringWithId, 0),
      matronId: parseInt(dragon.matronId, 0),
      sireId: parseInt(dragon.sireId, 0),
      upgradeIndex: parseInt(dragon.upgradeIndex, 0),
      unicornation: parseInt(dragon.unicornation, 0)
    };
    return await updateDragon(id, data);
  } catch (error) {
    logger.error('DragonService getDragonDetailFromBl error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function updateDragonDetailFromBl(id) {
  try {
    const dragon = await getTokenById(id);
    const data = {
      isGestating: dragon.isGestating,
      isReady: dragon.isReady,
      cooldownIndex: parseInt(dragon.cooldownIndex, 0),
      nextActionAt: parseInt(dragon.nextActionAt, 0),
      siringWithId: parseInt(dragon.siringWithId, 0),
      upgradeIndex: parseInt(dragon.upgradeIndex, 0),
      unicornation: parseInt(dragon.unicornation, 0)
    };
    return await updateDragon(id, data);
  } catch (error) {
    logger.error('DragonService updateDragonDetailFromBl error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function updateOwnerDragon(id, from = '', to = '') {
  try {
    const dragonDetail = await Dragons.findOne({ id });
    if (!dragonDetail) {
      const dragon = await getTokenById(id);
      const attributes = getDragonByBl(
          convertDragonAttribute(
              convertdecToHex(dragon.genes)
          )
      );
      const ownerAddress = await getDragonOwner(id);
      const data = {
        ...attributes,
        id: id,
        name: `Dragon #${id}`,
        owner: ownerAddress,
        birth: parseInt(dragon.birthTime) * 1000,
        hatched: parseInt(dragon.birthTime) * 1000 + ((Math.floor(Math.random() * (3024000 - 1814400)) + 1814400) * 1000),
        genes: dragon.genes,
        generation: parseInt(dragon.generation),
        type: DRAGON_TYPE.EGG,
      };
      return await createDragon(data);
    }
    return await updateDragon(id, { owner: to });
  } catch (error) {
    logger.error('DragonService getDragonDetailFromBl error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function getDragonRandom() {
  try {
    let tokens = await Redis.get('EGGS');
    tokens = JSON.parse(tokens);
    if (tokens?.length) {
      const index = Math.floor(Math.random() * tokens.length);
      const id = parseInt(tokens[index], 0);
      tokens.splice(index, 1);
      await Redis.set('EGGS', JSON.stringify(tokens));
      return {
        id: id,
        price: 5 * 10 ** 18
      };
    }
    let start = await Redis.get('start');
    let end = await Redis.get('end');
    if (start === null || end === null) {
      start = 1;
      end = 500;

      await Redis.set('start', start);
      await Redis.set('end', end);
    } else {
      start = parseInt(start, 10);
      end = parseInt(end, 10);
    }

    const data = [];
    for (let i = start; i <= end; i++) {
      data.push(i.toString());
    }
    const index = Math.floor(Math.random() * data.length);
    const id = parseInt(data[index], 0);
    data.splice(index, 1);
    await Redis.set('EGGS', JSON.stringify(data));
    return {
      id: id,
      price: 5 * 10 ** 18
    };
  } catch (error) {
    console.log('error getDragonList: ', error);
  }
}
export function getDragonByBl(attribute) {
  try {
    let mutant = false;
    const dragon = {
      parts: {}
    };
    if (attribute.CLASS) {
      dragon.class = DRAGON_CLASS_NUMBER[attribute.CLASS.slice(0, 1)];
      if (!mutant && [DRAGON_CLASS.YINYANG, DRAGON_CLASS.LEGEND].indexOf(dragon.class) !== -1) {
        mutant = true;
      }
    }
    if (attribute.POTENTIAL) {
      const potential = attribute.POTENTIAL.slice(0, 1);
      switch (potential) {
        case '5':
          dragon.potential = 0;
          break;
        case '6':
          dragon.potential = 1;
          break;
        case '7':
          dragon.potential = 2;
          break;
        case '8':
          dragon.potential = 3;
          break;
        case '9':
          dragon.potential = 4;
          break;
        case 'a':
          dragon.potential = 5;
          mutant = true;
          break;
        case 'b':
          dragon.potential = 6;
          mutant = true;
          break;
        case 'c':
          dragon.potential = 7;
          mutant = true;
          break;
        case 'd':
          dragon.potential = 8;
          mutant = true;
          break;
        case 'e':
          dragon.potential = 9;
          mutant = true;
          break;
        case 'f':
          dragon.potential = 10;
          dragon.class = DRAGON_CLASS.LEGEND;
          mutant = true;
          break;
        default:
          dragon.potential = parseInt(potential);
      }
    }
    if (attribute.STATS) {
      const stats = {
        mana: attribute.STATS.slice(0, 1),
        health: attribute.STATS.slice(1, 2),
        attack: attribute.STATS.slice(2, 3),
        defend: attribute.STATS.slice(3, 4),
        speed: attribute.STATS.slice(4, 5),
        morale: attribute.STATS.slice(5, 6)
      };
      switch (stats.mana) {
        case '6':
          stats.mana = 0;
          break;
        case 'a':
          stats.mana = 9;
          mutant = true;
          break;
        case 'b':
          stats.mana = 10;
          mutant = true;
          break;
        case 'c':
          stats.mana = 11;
          mutant = true;
          break;
        case 'd':
          stats.mana = 12;
          mutant = true;
          break;
        case 'e':
          stats.mana = 13;
          mutant = true;
          break;
        case 'f':
          stats.mana = 14;
          dragon.class = DRAGON_CLASS.LEGEND;
          mutant = true;
          break;
        default:
          stats.mana = parseInt(stats.mana, 0);
          break;
      }
      switch (stats.health) {
        case '6':
          stats.health = 0;
          break;
        case 'a':
          stats.health = 9;
          mutant = true;
          break;
        case 'b':
          stats.health = 10;
          mutant = true;
          break;
        case 'c':
          stats.health = 11;
          mutant = true;
          break;
        case 'd':
          stats.health = 12;
          mutant = true;
          break;
        case 'e':
          stats.health = 13;
          mutant = true;
          break;
        case 'f':
          stats.health = 14;
          dragon.class = DRAGON_CLASS.LEGEND;
          mutant = true;
          break;
        default:
          stats.health = parseInt(stats.health, 0);
          break;
      }
      switch (stats.attack) {
        case '6':
          stats.attack = 0;
          break;
        case 'a':
          stats.attack = 9;
          mutant = true;
          break;
        case 'b':
          stats.attack = 10;
          mutant = true;
          break;
        case 'c':
          stats.attack = 11;
          mutant = true;
          break;
        case 'd':
          stats.attack = 12;
          mutant = true;
          break;
        case 'e':
          stats.attack = 13;
          mutant = true;
          break;
        case 'f':
          stats.attack = 14;
          dragon.class = DRAGON_CLASS.LEGEND;
          mutant = true;
          break;
        default:
          stats.attack = parseInt(stats.attack, 0);
          break;
      }
      switch (stats.defend) {
        case '6':
          stats.defend = 0;
          break;
        case 'a':
          stats.defend = 9;
          mutant = true;
          break;
        case 'b':
          stats.defend = 10;
          mutant = true;
          break;
        case 'c':
          stats.defend = 11;
          mutant = true;
          break;
        case 'd':
          stats.defend = 12;
          mutant = true;
          break;
        case 'e':
          stats.defend = 13;
          mutant = true;
          break;
        case 'f':
          stats.defend = 14;
          dragon.class = DRAGON_CLASS.LEGEND;
          mutant = true;
          break;
        default:
          stats.defend = parseInt(stats.defend, 0);
          break;
      }
      switch (stats.speed) {
        case '6':
          stats.speed = 0;
          break;
        case 'a':
          stats.speed = 9;
          mutant = true;
          break;
        case 'b':
          stats.speed = 10;
          mutant = true;
          break;
        case 'c':
          stats.speed = 11;
          mutant = true;
          break;
        case 'd':
          stats.speed = 12;
          mutant = true;
          break;
        case 'e':
          stats.speed = 13;
          mutant = true;
          break;
        case 'f':
          stats.speed = 14;
          dragon.class = DRAGON_CLASS.LEGEND;
          mutant = true;
          break;
        default:
          stats.speed = parseInt(stats.speed, 0);
          break;
      }
      switch (stats.morale) {
        case '6':
          stats.morale = 0;
          break;
        case 'a':
          stats.morale = 9;
          mutant = true;
          break;
        case 'b':
          stats.morale = 10;
          mutant = true;
          break;
        case 'c':
          stats.morale = 11;
          mutant = true;
          break;
        case 'd':
          stats.morale = 12;
          mutant = true;
          break;
        case 'e':
          stats.morale = 13;
          break;
        case 'f':
          stats.morale = 14;
          dragon.class = DRAGON_CLASS.LEGEND;
          mutant = true;
          break;
        default:
          stats.morale = parseInt(stats.morale, 0);
          break;
      }
      dragon.stats = stats;
    }
    if (attribute.HORNS) {
      dragon.parts.horns = attribute.HORNS.slice(0, 1);
      if (!mutant && ['a', 'b', 'c', 'd', 'e', 'f'].indexOf(dragon.parts.horns) !== -1) {
        mutant = true;
      }

      if (dragon.parts.horns === 'f') {
        dragon.class = DRAGON_CLASS.LEGEND;
      }
    }
    if (attribute.MIDDLEHORNS) {
      dragon.parts.middlehorns = attribute.MIDDLEHORNS.slice(0, 1);
      if (!mutant && ['a', 'b', 'c', 'd', 'e', 'f'].indexOf(dragon.parts.middlehorns) !== -1) {
        mutant = true;
      }
      if (dragon.parts.middlehorns === 'f') {
        dragon.class = DRAGON_CLASS.LEGEND;
      }
    }
    if (attribute.BACKCALES) {
      dragon.parts.backcales = attribute.BACKCALES.slice(0, 1);
      if (!mutant && ['a', 'b', 'c', 'd', 'e', 'f'].indexOf(dragon.parts.backcales) !== -1) {
        mutant = true;
      }
      if (dragon.parts.backcales === 'f') {
        dragon.class = DRAGON_CLASS.LEGEND;
      }
    }
    if (attribute.TAIL) {
      dragon.parts.tail = attribute.TAIL.slice(0, 1);
      if (!mutant && ['a', 'b', 'c', 'd', 'e', 'f'].indexOf(dragon.parts.tail) !== -1) {
        mutant = true;
      }
      if (dragon.parts.tail === 'f') {
        dragon.class = DRAGON_CLASS.LEGEND;
      }
    }
    if (attribute.HEAD) {
      dragon.parts.head = attribute.HEAD.slice(0, 1);
      if (!mutant && ['a', 'b', 'c', 'd', 'e', 'f'].indexOf(dragon.parts.head) !== -1) {
        mutant = true;
      }
      if (dragon.parts.head === 'f') {
        dragon.class = DRAGON_CLASS.LEGEND;
      }
    }
    if (attribute.EYES) {
      dragon.parts.eyes = attribute.EYES.slice(0, 1);
      if (!mutant && ['a', 'b', 'c', 'd', 'e', 'f'].indexOf(dragon.parts.eyes) !== -1) {
        mutant = true;
      }
      if (dragon.parts.eyes === 'f') {
        dragon.class = DRAGON_CLASS.LEGEND;
      }
    }
    if (attribute.WINGS) {
      dragon.parts.wings = attribute.WINGS.slice(0, 1);
      if (!mutant && ['a', 'b', 'c', 'd', 'e', 'f'].indexOf(dragon.parts.wings) !== -1) {
        mutant = true;
      }
      if (dragon.parts.wings === 'f') {
        dragon.class = DRAGON_CLASS.LEGEND;
      }
    }
    if (attribute.CHEST) {
      dragon.parts.chest = attribute.CHEST.slice(0, 1);
      if (!mutant && ['a', 'b', 'c', 'd', 'e', 'f'].indexOf(dragon.parts.chest) !== -1) {
        mutant = true;
      }
      if (dragon.parts.chest === 'f') {
        dragon.class = DRAGON_CLASS.LEGEND;
      }
    }
    if (attribute.BODYCOLOR) {
      dragon.parts.bodyColor = attribute.BODYCOLOR.slice(0, 1);
    }
    if (attribute.WINGSCOLOR) {
      dragon.parts.wingsColor = attribute.WINGSCOLOR.slice(0, 1);
    }
    if (attribute.TAILCOLOR) {
      dragon.parts.tailColor = attribute.TAILCOLOR.slice(0, 1);
    }
    dragon.mutant = mutant;
    if (dragon.class === DRAGON_CLASS.LEGEND) {
      dragon.parts = {
        horns: 'f',
        middlehorns: 'f',
        backcales: 'f',
        tail: 'f',
        head: 'f',
        eyes: 'f',
        wings: 'f',
        chest: 'f',
        bodyColor: attribute.BODYCOLOR.slice(0, 1),
        wingsColor: attribute.WINGSCOLOR.slice(0, 1),
        tailColor: attribute.TAILCOLOR.slice(0, 1),
      };
    }
    return dragon;
  } catch (error) {
    logger.error('DragonService getDragonByBl error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function getMyDragons(owner, query) {
  try {
    const {
      rowPerPage,
      textSearch,
      type,
      classDragon,
      generation,
      potential,
      isReady,
      cooldown,
      mutant,
      total,
      level,
      isGestating,
      mana,
      health,
      attack,
      defend,
      speed,
      morale,
      horns,
      middlehorns,
      backcales,
      tail,
      head,
      eyes,
      wings,
      chest,
      sale,
      price,
      order,
      orderBy,
      isFree,
    } = query;
    let page = Number(query.page || 1).valueOf();
    if (page < 1) {
      page = 1;
    }
    let pageLimit = Number(rowPerPage || DEFAULT_PAGE_LIMIT).valueOf();
    if (pageLimit > MAX_PAGE_LIMIT || pageLimit < 1) {
      pageLimit = MAX_PAGE_LIMIT;
    }
    const skip = (page - 1) * pageLimit;
    const orderByValue = ORDER_BY[orderBy] || ORDER_BY.asc;
    const sortCondition = {};
    if (order && DRAGON_ORDER_FIELDS[order]) {
      sortCondition[DRAGON_ORDER_FIELDS[order]] = orderByValue;
    } else {
      sortCondition.id = 1;
    }

    const queryConditions = {
      owner: new RegExp(['^', owner, '$'].join(''), 'i')
    };
    if (typeof textSearch === 'string' && textSearch) {
      queryConditions.$or = [
        { idString: { $regex: validSearchString(textSearch) } },
        { name: { $regex: validSearchString(textSearch) } },
        { description: { $regex: validSearchString(textSearch) } }
      ];
    }
    if (type) {
      queryConditions.type = { $in: type.split(',') };
    }
    if (classDragon) {
      queryConditions.class = { $in: classDragon.split(',') };
    }
    if (potential) {
      const dataPotential = potential.split(',');
      if (dataPotential?.length === 2) {
        queryConditions.potential = { $gte: parseInt(dataPotential[0], 0), $lte: parseInt(dataPotential[1], 0) };
      }
    }
    if (generation) {
      const dataGeneration = generation.split(',');
      if (dataGeneration?.length === 2) {
        queryConditions.generation = { $gte: parseInt(dataGeneration[0], 0), $lte: parseInt(dataGeneration[1], 0) };
      }
    }
    if (cooldown) {
      const dataCooldown = cooldown.split(',');
      if (dataCooldown?.length === 2) {
        queryConditions.cooldownIndex = { $gte: parseInt(dataCooldown[0], 0), $lte: parseInt(dataCooldown[1], 0) };
      }
    }
    if (isReady) {
      queryConditions.isReady = isReady;
    }
    if (mutant) {
      queryConditions.mutant = mutant;
    }
    if (isGestating) {
      queryConditions.isGestating = isGestating;
    }
    if (mana) {
      const dataMana = mana.split(',');
      if (dataMana?.length === 2) {
        queryConditions['totalStats.mana'] = { $gte: parseInt(dataMana[0], 0), $lte: parseInt(dataMana[1], 0) };
      }
    }
    if (health) {
      const dataHealth = health.split(',');
      if (dataHealth?.length === 2) {
        queryConditions['totalStats.health'] = { $gte: parseInt(dataHealth[0], 0), $lte: parseInt(dataHealth[1], 0) };
      }
    }
    if (attack) {
      const dataAttack = attack.split(',');
      if (dataAttack?.length === 2) {
        queryConditions['totalStats.attack'] = { $gte: parseInt(dataAttack[0], 0), $lte: parseInt(dataAttack[1], 0) };
      }
    }
    if (defend) {
      const dataDefend = defend.split(',');
      if (dataDefend?.length === 2) {
        queryConditions['totalStats.defend'] = { $gte: parseInt(dataDefend[0], 0), $lte: parseInt(dataDefend[1], 0) };
      }
    }
    if (speed) {
      const dataSpeed = speed.split(',');
      if (dataSpeed?.length === 2) {
        queryConditions['totalStats.speed'] = { $gte: parseInt(dataSpeed[0], 0), $lte: parseInt(dataSpeed[1], 0) };
      }
    }
    if (morale) {
      const dataMorale = morale.split(',');
      if (dataMorale?.length === 2) {
        queryConditions['totalStats.morale'] = { $gte: parseInt(dataMorale[0], 0), $lte: parseInt(dataMorale[1], 0) };
      }
    }
    if (total) {
      const dataTotal = total.split(',');
      if (dataTotal?.length === 2) {
        queryConditions['totalStats.total'] = { $gte: parseInt(dataTotal[0], 0), $lte: parseInt(dataTotal[1], 0) };
      }
    }
    if (level) {
      const dataLevel = level.split(',');
      if (dataLevel?.length === 2) {
        queryConditions.level = { $gte: parseInt(dataLevel[0], 0), $lte: parseInt(dataLevel[1], 0) };
      }
    }
    if (horns) {
      queryConditions['parts.horns'] = { $in: horns.split(',') };
    }
    if (middlehorns) {
      queryConditions['parts.middlehorns'] = { $in: middlehorns.split(',') };
    }
    if (backcales) {
      queryConditions['parts.backcales'] = { $in: backcales.split(',') };
    }
    if (tail) {
      queryConditions['parts.tail'] = { $in: tail.split(',') };
    }
    if (head) {
      queryConditions['parts.head'] = { $in: head.split(',') };
    }
    if (eyes) {
      queryConditions['parts.eyes'] = { $in: eyes.split(',') };
    }
    if (wings) {
      queryConditions['parts.wings'] = { $in: wings.split(',') };
    }
    if (chest) {
      queryConditions['parts.chest'] = { $in: chest.split(',') };
    }
    if (horns || middlehorns || backcales || tail || head || eyes || wings || chest) {
      queryConditions.type = DRAGON_TYPE.DRAGON;
    }
    if (sale) {
      switch (sale) {
        case AUCTION_TYPE[sale]:
          queryConditions.sale = AUCTION_TYPE[sale];
          if (price) {
            const dataPrice = price.split(',');
            if (dataPrice?.length === 2) {
              queryConditions.price = { $gte: parseFloat(dataPrice[0], 2), $lte: parseFloat(dataPrice[1], 2) };
            }
          }
          break;
        case 'NOT_FOR_SALE':
          queryConditions.sale = null;
          break;
        default:
          break;
      }
    }
    if (isFree && JSON.parse(isFree)) {
      const user = await User.findOne({ address: Web3.utils.toChecksumAddress(owner) }).lean();
      if (user) {
        const teams = await Teams.find({ owner: user._id, status: TEAM_STATUS.ACTIVE });
        const dragonInTeams = teams.reduce((acc, curr) => acc.concat(curr.dragons.map(item => item.id)), []);
        queryConditions.id = { $nin: dragonInTeams };
      }
    }
    const promises = await Promise.all([
      Dragons.find(queryConditions).sort(sortCondition).skip(skip).limit(pageLimit),
      Dragons.countDocuments(queryConditions)
    ]);
    let data = promises[0];
    const totalItems = promises[1];
    data = await Promise.all(data?.map(async (dragon) => {
      dragon = dragon?.toJSON();
      let timeLock = 0;
      if (!dragon.isReady) {
        const block = await getBlockNumber();
        if (block < dragon.nextActionAt) {
          timeLock = (dragon.nextActionAt - block) * KAI_TIME_BLOCK;
        } else {
          await Dragons.updateOne({ id: dragon.id }, { $set: { isReady: true } });
          dragon.isReady = true;
        }
      }
      const favorite = await Favorites.countDocuments({
        id: dragon.id,
        owner
      });
      if (dragon.type === DRAGON_TYPE.EGG) {
        return {
          id: dragon.id,
          name: dragon.name,
          stats: dragon.stats,
          parents: dragon.parents,
          potential: dragon.potential,
          generation: dragon.generation,
          birth: dragon.birth,
          hatched: dragon.hatched,
          class: dragon.class,
          type: dragon.type,
          owner: dragon.owner,
          isReady: dragon.isReady,
          price: dragon.price,
          sale: dragon.sale,
          isGestating: dragon.isGestating,
          timeLock: timeLock ? new Date().getTime() + timeLock : 0,
          cooldownIndex: dragon.cooldownIndex,
          nextActionAt: dragon.nextActionAt,
          level: dragon.type === DRAGON_TYPE.DRAGON ? dragon.level : 1,
          mutant: dragon.mutant,
          startLock: dragon.startLock ? (dragon.startLock * 1000) + 60 * 60 * 1000 : 0,
          favorite: !!favorite,
        };
      }
      const equipments = await getEquipmentsByDragonId(dragon.id);
      return {
        id: dragon.id,
        name: dragon.name,
        description: dragon.description,
        image: dragon.image,
        parts: dragon.parts,
        generation: dragon.generation,
        stats: dragon.stats,
        currentStats: getCurrentStats(dragon, equipments),
        equipments,
        skills: dragon.skills,
        potential: dragon.potential,
        birth: dragon.birth,
        class: dragon.class,
        type: dragon.type,
        owner: dragon.owner,
        isReady: dragon.isReady,
        isGestating: dragon.isGestating,
        timeLock: timeLock ? new Date().getTime() + timeLock : 0,
        price: dragon.price,
        sale: dragon.sale,
        cooldownIndex: dragon.cooldownIndex,
        nextActionAt: dragon.nextActionAt,
        xp: dragon.xp,
        level: dragon.type === DRAGON_TYPE.DRAGON ? dragon.level : 1,
        mutant: dragon.mutant,
        startLock: dragon.startLock ? (dragon.startLock * 1000) + 60 * 60 * 1000 : 0,
        favorite: !!favorite
      };
    }));
    return {
      data,
      currentPage: page,
      totalPage: Math.ceil(totalItems / pageLimit),
      totalItems: totalItems,
    };
  } catch (error) {
    logger.error('DragonService getMyDragons error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function getDragons(query, wallet) {
  try {
    const {
      rowPerPage,
      textSearch,
      owner,
      type,
      classDragon,
      generation,
      potential,
      isReady,
      cooldown,
      mutant,
      level,
      isGestating,
      mana,
      health,
      attack,
      defend,
      speed,
      morale,
      total,
      horns,
      middlehorns,
      backcales,
      tail,
      head,
      eyes,
      wings,
      chest,
      sale,
      price,
      order,
      orderBy
    } = query;
    let page = Number(query.page || 1).valueOf();
    if (page < 1) {
      page = 1;
    }
    let pageLimit = Number(rowPerPage || DEFAULT_PAGE_LIMIT).valueOf();
    if (pageLimit > MAX_PAGE_LIMIT || pageLimit < 1) {
      pageLimit = MAX_PAGE_LIMIT;
    }
    const skip = (page - 1) * pageLimit;
    const orderByValue = ORDER_BY[orderBy] || ORDER_BY.asc;
    const sortCondition = {};
    if (order && DRAGON_ORDER_FIELDS[order]) {
      sortCondition[DRAGON_ORDER_FIELDS[order]] = orderByValue;
    } else {
      sortCondition.id = 1;
    }
    const queryConditions = {};
    if (typeof textSearch === 'string' && textSearch) {
      queryConditions.$or = [
        { idString: { $regex: validSearchString(textSearch) } },
        { name: { $regex: validSearchString(textSearch) } },
        { description: { $regex: validSearchString(textSearch) } }
      ];
    }
    if (!sortCondition.id) {
      sortCondition.id = 1;
    }
    if (owner) {
      queryConditions.owner = new RegExp(['^', owner, '$'].join(''), 'i');
    }
    if (type) {
      queryConditions.type = { $in: type.split(',') };
    }
    if (classDragon) {
      queryConditions.class = { $in: classDragon.split(',') };
    }
    if (potential) {
      const dataPotential = potential.split(',');
      if (dataPotential?.length === 2) {
        queryConditions.potential = { $gte: parseInt(dataPotential[0], 0), $lte: parseInt(dataPotential[1], 0) };
      }
    }
    if (generation) {
      const dataGeneration = generation.split(',');
      if (dataGeneration?.length === 2) {
        queryConditions.generation = { $gte: parseInt(dataGeneration[0], 0), $lte: parseInt(dataGeneration[1], 0) };
      }
    }
    if (cooldown) {
      const dataCooldown = cooldown.split(',');
      if (dataCooldown?.length === 2) {
        queryConditions.cooldownIndex = { $gte: parseInt(dataCooldown[0], 0), $lte: parseInt(dataCooldown[1], 0) };
      }
    }
    if (isReady) {
      queryConditions.isReady = isReady;
    }
    if (mutant) {
      queryConditions.mutant = mutant;
    }
    if (isGestating) {
      queryConditions.isGestating = isGestating;
    }
    if (mana) {
      const dataMana = mana.split(',');
      if (dataMana?.length === 2) {
        queryConditions['totalStats.mana'] = { $gte: parseInt(dataMana[0], 0), $lte: parseInt(dataMana[1], 0) };
      }
    }
    if (health) {
      const dataHealth = health.split(',');
      if (dataHealth?.length === 2) {
        queryConditions['totalStats.health'] = { $gte: parseInt(dataHealth[0], 0), $lte: parseInt(dataHealth[1], 0) };
      }
    }
    if (attack) {
      const dataAttack = attack.split(',');
      if (dataAttack?.length === 2) {
        queryConditions['totalStats.attack'] = { $gte: parseInt(dataAttack[0], 0), $lte: parseInt(dataAttack[1], 0) };
      }
    }
    if (defend) {
      const dataDefend = defend.split(',');
      if (dataDefend?.length === 2) {
        queryConditions['totalStats.defend'] = { $gte: parseInt(dataDefend[0], 0), $lte: parseInt(dataDefend[1], 0) };
      }
    }
    if (speed) {
      const dataSpeed = speed.split(',');
      if (dataSpeed?.length === 2) {
        queryConditions['totalStats.speed'] = { $gte: parseInt(dataSpeed[0], 0), $lte: parseInt(dataSpeed[1], 0) };
      }
    }
    if (morale) {
      const dataMorale = morale.split(',');
      if (dataMorale?.length === 2) {
        queryConditions['totalStats.morale'] = { $gte: parseInt(dataMorale[0], 0), $lte: parseInt(dataMorale[1], 0) };
      }
    }
    if (total) {
      const dataTotal = morale.split(',');
      if (dataTotal?.length === 2) {
        queryConditions['totalStats.total'] = { $gte: parseInt(dataTotal[0], 0), $lte: parseInt(dataTotal[1], 0) };
      }
    }
    if (level) {
      const dataLevel = level.split(',');
      if (dataLevel?.length === 2) {
        queryConditions.level = { $gte: parseInt(dataLevel[0], 0), $lte: parseInt(dataLevel[1], 0) };
      }
    }
    if (horns) {
      queryConditions['parts.horns'] = { $in: horns.split(',') };
    }
    if (middlehorns) {
      queryConditions['parts.middlehorns'] = { $in: middlehorns.split(',') };
    }
    if (backcales) {
      queryConditions['parts.backcales'] = { $in: backcales.split(',') };
    }
    if (tail) {
      queryConditions['parts.tail'] = { $in: tail.split(',') };
    }
    if (head) {
      queryConditions['parts.head'] = { $in: head.split(',') };
    }
    if (eyes) {
      queryConditions['parts.eyes'] = { $in: eyes.split(',') };
    }
    if (wings) {
      queryConditions['parts.wings'] = { $in: wings.split(',') };
    }
    if (chest) {
      queryConditions['parts.chest'] = { $in: chest.split(',') };
    }
    if (horns || middlehorns || backcales || tail || head || eyes || wings || chest) {
      queryConditions.type = DRAGON_TYPE.DRAGON;
    }
    if (sale) {
      switch (sale) {
        case AUCTION_TYPE[sale]:
          queryConditions.sale = AUCTION_TYPE[sale];
          if (price) {
            const dataPrice = price.split(',');
            if (dataPrice?.length === 2) {
              queryConditions.price = { $gte: parseFloat(dataPrice[0], 2), $lte: parseFloat(dataPrice[1], 2) };
            }
          }
          break;
        case 'NOT_FOR_SALE':
          queryConditions.sale = null;
          break;
        default:
          break;
      }
    }
    const promises = await Promise.all([
      Dragons.find(queryConditions).sort(sortCondition).skip(skip).limit(pageLimit),
      Dragons.countDocuments(queryConditions)
    ]);
    let data = promises[0];
    const totalItems = promises[1];
    data = await Promise.all(data?.map(async (dragon) => {
      dragon = dragon?.toJSON();
      const favorite = await Favorites.countDocuments({
        id: dragon.id,
        owner: wallet
      });
      if (dragon.type === DRAGON_TYPE.EGG) {
        return {
          id: dragon.id,
          name: dragon.name,
          generation: dragon.generation,
          stats: dragon.stats,
          parents: dragon.parents,
          potential: dragon.potential,
          birth: dragon.birth,
          hatched: dragon.hatched,
          class: dragon.class,
          type: dragon.type,
          owner: dragon.owner,
          isReady: dragon.isReady,
          price: dragon.price,
          sale: dragon.sale,
          cooldownIndex: dragon.cooldownIndex,
          nextActionAt: dragon.nextActionAt,
          level: dragon.type === DRAGON_TYPE.DRAGON ? dragon.level : 1,
          mutant: dragon.mutant,
          startLock: dragon.startLock ? (dragon.startLock * 1000) + 60 * 60 * 1000 : 0,
          favorite: !!favorite
        };
      }
      const equipments = await getEquipmentsByDragonId(dragon.id);
      return {
        id: dragon.id,
        name: dragon.name,
        description: dragon.description,
        image: dragon.image,
        parts: dragon.parts,
        stats: dragon.stats,
        currentStats: getCurrentStats(dragon, equipments),
        equipments,
        skills: dragon.skills,
        potential: dragon.potential,
        birth: dragon.birth,
        generation: dragon.generation,
        class: dragon.class,
        type: dragon.type,
        owner: dragon.owner,
        isReady: dragon.isReady,
        price: dragon.price,
        sale: dragon.sale,
        cooldownIndex: dragon.cooldownIndex,
        nextActionAt: dragon.nextActionAt,
        xp: dragon.xp,
        level: dragon.type === DRAGON_TYPE.DRAGON ? dragon.level : 1,
        mutant: dragon.mutant,
        startLock: dragon.startLock ? (dragon.startLock * 1000) + 60 * 60 * 1000 : 0,
        favorite: !!favorite
      };
    }));
    return {
      data,
      currentPage: page,
      totalPage: Math.ceil(totalItems / pageLimit),
      totalItems: totalItems,
    };
  } catch (error) {
    logger.error('DragonService getMyDragons error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function getNotifications(query, wallet) {
  try {
    const {
      rowPerPage,
      firstId,
      lastId
    } = query;
    if (firstId && lastId) {
      return Promise.reject(new APIError(422, [{
        msg: 'Please provide only firstId or only lastId to get notification',
        param: 'firstIdConflictLastId'
      }]));
    }
    if (!web3.utils.toChecksumAddress(wallet)) {
      return Promise.reject(new APIError(401, [{
        msg: 'Wallet invalid'
      }]));
    }

    let pageLimit = Number(rowPerPage || DEFAULT_PAGE_LIMIT).valueOf();
    if (pageLimit > MAX_PAGE_LIMIT) {
      pageLimit = MAX_PAGE_LIMIT;
    }

    const queryConditions = {
      owner: web3.utils.toChecksumAddress(wallet)
    };
    const sortCondition = {
      _id: -1,
    };
    if (lastId) {
      queryConditions._id = { $lt: lastId };
    } else if (firstId) {
      queryConditions._id = { $gt: firstId };
      sortCondition._id = 1;
    }
    const notifications = await Notification.find(queryConditions).sort(sortCondition).limit(pageLimit);
    if (firstId) {
      return notifications.reverse();
    }
    return notifications.map((notification) => {
      switch (notification.type) {
        case HISTORY_TYPE.SUCCESSAUCTION:
          return {
            _id: notification._id,
            trxHash: notification.trxHash,
            id: notification.id,
            price: notification.price,
            message: `You received ${notification.price} USDT from selling ${NFT_TYPE_NAMES[notification.nftType || NFT_TYPES.DRAGON]} #${notification.id}!`,
            date: notification.createdAt,
            nftType:notification.nftType
          };
        case HISTORY_TYPE.SUCCESSSIRING:
          return {
            _id: notification._id,
            trxHash: notification.trxHash,
            id: notification.id,
            price: notification.price,
            message: `You received ${notification.price} USDT from siring dragon #${notification.id}!`,
            date: notification.createdAt
          };
          case HISTORY_TYPE.BIRTHDAY:
            return {
              _id: notification._id,
              trxHash: notification.trxHash,
              id: notification.id,
              message: `Welcome #${notification.id} to the world!`,
              date: notification.createdAt
            };
        default:
          return null;
      }
    });
  } catch (error) {
    logger.error('DragonService getMyDragons error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function getTotalNotifications(owner) {
  try {
    const total = await NotificationOwner.findOne({ owner });
    return total?.total ?? 0;
  } catch (error) {
    logger.error('DragonService getMyDragons error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function resetNotifications(owner) {
  try {
    return await NotificationOwner.updateOne({ owner }, { $set: { total: 0 } });
  } catch (error) {
    logger.error('DragonService getMyDragons error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function getDragonsFavorites(query, wallet) {
  try {
    const {
      rowPerPage,
      textSearch,
      type,
      classDragon,
      generation,
      potential,
      isReady,
      cooldown,
      mutant,
      level,
      total,
      mana,
      health,
      attack,
      defend,
      speed,
      morale,
      horns,
      middlehorns,
      backcales,
      tail,
      head,
      eyes,
      wings,
      chest,
      sale,
      price,
      order,
      orderBy,
      isFree
    } = query;
    let page = Number(query.page || 1).valueOf();
    if (page < 1) {
      page = 1;
    }
    let pageLimit = Number(rowPerPage || DEFAULT_PAGE_LIMIT).valueOf();
    if (pageLimit > MAX_PAGE_LIMIT || pageLimit < 1) {
      pageLimit = MAX_PAGE_LIMIT;
    }
    const skip = (page - 1) * pageLimit;
    const orderByValue = ORDER_BY[orderBy] || ORDER_BY.asc;
    const sortCondition = {};
    if (order && DRAGON_ORDER_FIELDS[order]) {
      sortCondition[DRAGON_ORDER_FIELDS[order]] = orderByValue;
    } else {
      sortCondition.id = 1;
    }
    const queryConditions = {};
    if (typeof textSearch === 'string' && textSearch) {
      queryConditions.$or = [
        { idString: { $regex: validSearchString(textSearch) } },
        { name: { $regex: validSearchString(textSearch) } },
        { description: { $regex: validSearchString(textSearch) } }
      ];
    }
    if (isFree && JSON.parse(isFree)) {
      const user = await User.findOne({ address: Web3.utils.toChecksumAddress(wallet) }).lean();
      if (user) {
        const teams = await Teams.find({ owner: user._id });
        const dragonInTeams = teams.reduce((acc, curr) => acc.concat(curr.dragons.map(item => item.id)), []);
        queryConditions.id = { $nin: dragonInTeams };
      }
    }
    if (type) {
      queryConditions.type = { $in: type.split(',') };
    }
    if (classDragon) {
      queryConditions.class = { $in: classDragon.split(',') };
    }
    if (potential) {
      const dataPotential = potential.split(',');
      if (dataPotential?.length === 2) {
        queryConditions.potential = { $gte: parseInt(dataPotential[0], 0), $lte: parseInt(dataPotential[1], 0) };
      }
    }
    if (generation) {
      const dataGeneration = generation.split(',');
      if (dataGeneration?.length === 2) {
        queryConditions.generation = { $gte: parseInt(dataGeneration[0], 0), $lte: parseInt(dataGeneration[1], 0) };
      }
    }
    if (cooldown) {
      const dataCooldown = cooldown.split(',');
      if (dataCooldown?.length === 2) {
        queryConditions.cooldownIndex = { $gte: parseInt(dataCooldown[0], 0), $lte: parseInt(dataCooldown[1], 0) };
      }
    }
    if (isReady) {
      queryConditions.isReady = isReady;
    }
    if (mutant) {
      queryConditions.mutant = mutant;
    }
    if (mana) {
      const dataMana = mana.split(',');
      if (dataMana?.length === 2) {
        queryConditions['totalStats.mana'] = { $gte: parseInt(dataMana[0], 0), $lte: parseInt(dataMana[1], 0) };
      }
    }
    if (health) {
      const dataHealth = health.split(',');
      if (dataHealth?.length === 2) {
        queryConditions['totalStats.health'] = { $gte: parseInt(dataHealth[0], 0), $lte: parseInt(dataHealth[1], 0) };
      }
    }
    if (attack) {
      const dataAttack = attack.split(',');
      if (dataAttack?.length === 2) {
        queryConditions['totalStats.attack'] = { $gte: parseInt(dataAttack[0], 0), $lte: parseInt(dataAttack[1], 0) };
      }
    }
    if (defend) {
      const dataDefend = defend.split(',');
      if (dataDefend?.length === 2) {
        queryConditions['totalStats.defend'] = { $gte: parseInt(dataDefend[0], 0), $lte: parseInt(dataDefend[1], 0) };
      }
    }
    if (speed) {
      const dataSpeed = speed.split(',');
      if (dataSpeed?.length === 2) {
        queryConditions['totalStats.speed'] = { $gte: parseInt(dataSpeed[0], 0), $lte: parseInt(dataSpeed[1], 0) };
      }
    }
    if (morale) {
      const dataMorale = morale.split(',');
      if (dataMorale?.length === 2) {
        queryConditions['totalStats.morale'] = { $gte: parseInt(dataMorale[0], 0), $lte: parseInt(dataMorale[1], 0) };
      }
    }
    if (total) {
      const dataTotal = total.split(',');
      if (dataTotal?.length === 2) {
        queryConditions['totalStats.total'] = { $gte: parseInt(dataTotal[0], 0), $lte: parseInt(dataTotal[1], 0) };
      }
    }
    if (level) {
      const dataLevel = level.split(',');
      if (dataLevel?.length === 2) {
        queryConditions.level = { $gte: parseInt(dataLevel[0], 0), $lte: parseInt(dataLevel[1], 0) };
      }
    }
    if (horns) {
      queryConditions['parts.horns'] = { $in: horns.split(',') };
    }
    if (middlehorns) {
      queryConditions['parts.middlehorns'] = { $in: middlehorns.split(',') };
    }
    if (backcales) {
      queryConditions['parts.backcales'] = { $in: backcales.split(',') };
    }
    if (tail) {
      queryConditions['parts.tail'] = { $in: tail.split(',') };
    }
    if (head) {
      queryConditions['parts.head'] = { $in: head.split(',') };
    }
    if (eyes) {
      queryConditions['parts.eyes'] = { $in: eyes.split(',') };
    }
    if (wings) {
      queryConditions['parts.wings'] = { $in: wings.split(',') };
    }
    if (chest) {
      queryConditions['parts.chest'] = { $in: chest.split(',') };
    }
    if (horns || middlehorns || backcales || tail || head || eyes || wings || chest) {
      queryConditions.type = DRAGON_TYPE.DRAGON;
    }
    if (sale) {
      switch (sale) {
        case AUCTION_TYPE[sale]:
          queryConditions.sale = AUCTION_TYPE[sale];
          if (price) {
          const dataPrice = price.split(',');
          if (dataPrice?.length === 2) {
            queryConditions.price = { $gte: parseFloat(dataPrice[0], 2), $lte: parseFloat(dataPrice[1], 2) };
          }
        }
          break;
        case 'NOT_FOR_SALE':
          queryConditions.sale = null;
          break;
        default:
          break;
      }
    }
    const queryDragons = [
      {
        $match: { owner: new RegExp(['^', wallet, '$'].join(''), 'i') }
      },
      {
        $lookup: {
          from: 'dragons',
          let: { id: '$id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$id', '$$id']
                }
              }
            }
          ],
          as: 'dragon',
        }
      },
      {
        $project: {
          dragon: { $arrayElemAt: ['$dragon', 0] },
        }
      },
      {
        $replaceRoot: {
          newRoot: { $ifNull: ['$dragon', { _id: '$_id', missingUser: true }] }
        }
      },
      {
        $match: queryConditions
      }
    ];
    const promises = await Promise.all([
      Favorites.aggregate(queryDragons.concat([
        {
          $skip: skip
        },
        {
          $limit: pageLimit
        },
        {
          $sort: sortCondition
        }
      ])),
      Favorites.aggregate(queryDragons.concat([
        { $group: { _id: null, total: { $sum: 1 } } },
      ]))
    ]);
    let data = promises[0];
    const totalItems = promises[1]?.[0]?.total ?? 0;
    data = await Promise.all(data?.map(async (dragon) => {
      if (dragon.type === DRAGON_TYPE.EGG) {
        return {
          id: dragon.id,
          name: dragon.name,
          generation: dragon.generation,
          stats: dragon.stats,
          parents: dragon.parents,
          potential: dragon.potential,
          birth: dragon.birth,
          hatched: dragon.hatched,
          class: dragon.class,
          type: dragon.type,
          owner: dragon.owner,
          isReady: dragon.isReady,
          price: dragon.price,
          sale: dragon.sale,
          cooldownIndex: dragon.cooldownIndex,
          nextActionAt: dragon.nextActionAt,
          level: dragon.type === DRAGON_TYPE.DRAGON ? dragon.level : 1,
          mutant: dragon.mutant,
          startLock: dragon.startLock ? (dragon.startLock * 1000) + 60 * 60 * 1000 : 0,
          favorite: true
        };
      }
      const equipments = await getEquipmentsByDragonId(dragon.id);
      return {
        id: dragon.id,
        name: dragon.name,
        description: dragon.description,
        image: getImageSize(dragon.image),
        parts: dragon.parts,
        stats: dragon.stats,
        currentStats: getCurrentStats(dragon, equipments),
        equipments,
        skills: dragon.skills,
        potential: dragon.potential,
        birth: dragon.birth,
        generation: dragon.generation,
        class: dragon.class,
        type: dragon.type,
        owner: dragon.owner,
        isReady: dragon.isReady,
        price: dragon.price,
        sale: dragon.sale,
        cooldownIndex: dragon.cooldownIndex,
        nextActionAt: dragon.nextActionAt,
        xp: dragon.xp,
        level: dragon.type === DRAGON_TYPE.DRAGON ? dragon.level : 1,
        mutant: dragon.mutant,
        startLock: dragon.startLock ? (dragon.startLock * 1000) + 60 * 60 * 1000 : 0,
        favorite: true
      };
    }));
    return {
      data,
      currentPage: page,
      totalPage: Math.ceil(totalItems / pageLimit),
      totalItems: totalItems,
    };
  } catch (error) {
    logger.error('DragonService getDragonsFavorites error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function getDragonParent(id, wallet = '') {
  try {
    let dragon = await Dragons.findOne({ id });
    if (!dragon) {
      const dragonBL = await getTokenById(id);
      if (!dragonBL) {
        return Promise.reject(new APIError(403, [
          {
            msg: 'Dragon not found.',
            param: 'dragonNotFound',
          },
        ]));
      }
      await getDragonDetailFromBl(id, '');
      dragon = await Dragons.findOne({ id });
    }
    let timeLock = 0;
    if (!dragon.isReady) {
      const block = await getBlockNumber();
      if (block < dragon.nextActionAt) {
        timeLock = (dragon.nextActionAt - block) * KAI_TIME_BLOCK;
      } else {
        await Dragons.updateOne({ id }, { $set: { isReady: true } });
        dragon.isReady = true;
      }
    }
    let favorite = false;
    if (wallet) {
      const count = await Favorites.countDocuments({
        id: dragon.id,
        owner: web3.utils.toChecksumAddress(wallet)
      });
      favorite = !!count;
    }
    return {
      id: dragon.id,
      name: dragon.name,
      generation: dragon.generation,
      image: getImageSize(dragon.image),
      class: dragon.class,
      type: dragon.type,
      matronId: dragon.matronId,
      sireId: dragon.sireId,
      cooldownIndex: dragon.cooldownIndex,
      isReady: dragon.isReady,
      isGestating: dragon.isGestating,
      xp: dragon.type === DRAGON_TYPE.DRAGON ? dragon.xp : 0,
      level: dragon.type === DRAGON_TYPE.DRAGON ? dragon.level : 1,
      mutant: dragon.mutant,
      startLock: dragon.startLock ? (dragon.startLock * 1000) + 60 * 60 * 1000 : 0,
      timeLock: timeLock ? new Date().getTime() + timeLock : 0,
      favorite
    };
  } catch (error) {
    logger.error('DragonService getDragonParent error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function getDragonChildren(id, wallet = true) {
  try {
    const dragons = await Dragons.find({
      $or: [
        { matronId: id },
        { sireId: id },
      ]
    });
    return await Promise.all(dragons?.map(async (dragon) => {
      let timeLock = 0;
      if (!dragon.isReady) {
        const block = await getBlockNumber();
        if (block < dragon.nextActionAt) {
          timeLock = (dragon.nextActionAt - block) * KAI_TIME_BLOCK;
        } else {
          await Dragons.updateOne({ id }, { $set: { isReady: true } });
          dragon.isReady = true;
        }
      }
      let favorite = false;
      if (wallet) {
        const count = await Favorites.countDocuments({
          id: dragon.id,
          owner: web3.utils.toChecksumAddress(wallet)
        });
        favorite = !!count;
      }
      return {
        id: dragon.id,
        name: dragon.name,
        generation: dragon.generation,
        image: getImageSize(dragon.image),
        class: dragon.class,
        matronId: dragon.matronId,
        sireId: dragon.sireId,
        type: dragon.type,
        cooldownIndex: dragon.cooldownIndex,
        isReady: dragon.isReady,
        isGestating: dragon.isGestating,
        xp: dragon.type === DRAGON_TYPE.DRAGON ? dragon.xp : 0,
        level: dragon.type === DRAGON_TYPE.DRAGON ? dragon.level : 1,
        mutant: dragon.mutant,
        startLock: dragon.startLock ? (dragon.startLock * 1000) + 60 * 60 * 1000 : 0,
        timeLock: timeLock ? new Date().getTime() + timeLock : 0,
        favorite
      };
    }));
  } catch (error) {
    logger.error('DragonService getDragonParent error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function getDragonHistories(id) {
  try {
    return await History.find({ id, type: { $ne: HISTORY_TYPE.TRAINING } }).sort({ _id: -1 });
  } catch (error) {
    logger.error('DragonService getDragonHistories error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function getDragon(id, wallet = '') {
  try {
    let dragon = await Dragons.findOne({ id });
    if (!dragon) {
      const dragonBL = await getTokenById(id);
      if (!dragonBL) {
        return Promise.reject(new APIError(403, [
          {
            msg: 'Dragon not found.',
            param: 'dragonNotFound',
          },
        ]));
      }
      await getDragonDetailFromBl(id, '');
      dragon = await Dragons.findOne({ id });
    }
    dragon = dragon.toJSON();
    let timeLock = 0;
    const block = await getBlockNumber();
    if (!dragon.isReady) {
      if (block < dragon.nextActionAt) {
        timeLock = (dragon.nextActionAt - block) * KAI_TIME_BLOCK;
      } else {
        await Dragons.updateOne({ id }, { $set: { isReady: true } });
        dragon.isReady = true;
      }
    }
    const favorite = await Favorites.countDocuments({
      id: dragon.id,
      owner: wallet
    });
    let matron = {}; let sire = {};
    const children = await getDragonChildren(dragon?.id, wallet);
    if (dragon?.matronId && dragon?.sireId) {
      const promieses = await Promise.all([
        getDragonParent(dragon?.matronId, wallet),
        getDragonParent(dragon?.sireId, wallet)
      ]);
      matron = promieses[0];
      sire = promieses[1];
    }
    let skills = await getDragonSkills(id);
    if (dragon.type === DRAGON_TYPE.EGG) {
      return {
        id: dragon.id,
        name: dragon.name,
        generation: dragon.generation,
        stats: dragon.stats,
        parents: dragon.parents,
        potential: dragon.potential,
        birth: dragon.birth,
        hatched: dragon.hatched,
        class: dragon.class,
        type: dragon.type,
        owner: dragon.owner,
        matron: matron,
        sire: sire,
        skills,
        siringWithId: dragon.siringWithId,
        children,
        isReady: dragon.isReady,
        isGestating: dragon.isGestating,
        price: dragon.price,
        sale: dragon.sale,
        cooldownIndex: dragon.cooldownIndex,
        timeLock: timeLock ? new Date().getTime() + timeLock : 0,
        level: dragon.type === DRAGON_TYPE.DRAGON ? dragon.level : 1,
        mutant: dragon.mutant,
        startLock: dragon.startLock ? (dragon.startLock * 1000) + 60 * 60 * 1000 : 0,
        favorite: !!favorite
      };
    }
    const equipments = await getEquipmentsByDragonId(id);
    dragon.currentStats = getCurrentStats(dragon, equipments);
    // const attack = dragon.currentStats?.attack;
    // skills = skills.map((skill) => ({
    //   ...skill,
    //   attack: Math.ceil(attack * (skill.attack / 100))
    // }))
    return {
      _id: dragon._id,
      id: dragon.id,
      name: dragon.name,
      description: dragon.description,
      image: dragon.image,
      figure: dragon.figure,
      parts: dragon.parts,
      generation: dragon.generation,
      stats: dragon.stats,
      currentStats: dragon.currentStats,
      potential: dragon.potential,
      birth: dragon.birth,
      parents: dragon.parents,
      class: dragon.class,
      type: dragon.type,
      owner: dragon.owner,
      matron: matron,
      sire: sire,
      skills,
      equipments,
      siringWithId: dragon.siringWithId,
      children,
      isReady: dragon.isReady,
      isGestating: dragon.isGestating,
      price: dragon.price,
      sale: dragon.sale,
      cooldownIndex: dragon.cooldownIndex,
      timeLock: timeLock ? new Date().getTime() + timeLock : 0,
      xp: dragon.xp,
      level: dragon.type === DRAGON_TYPE.DRAGON ? dragon.level : 1,
      mutant: dragon.mutant,
      startLock: dragon.startLock ? (dragon.startLock * 1000) + 60 * 60 * 1000 : 0,
      favorite: !!favorite
    };
  } catch (error) {
    logger.error('DragonService getDragon error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function getDragonForList(id) {
  try {
    let dragon = await Dragons.findOne({ id });
    if (!dragon) {
      const dragonBL = await getTokenById(id);
      if (!dragonBL) {
        return Promise.reject(new APIError(403, [
          {
            msg: 'Dragon not found.',
            param: 'dragonNotFound',
          },
        ]));
      }
      await getDragonDetailFromBl(id, '');
      dragon = await Dragons.findOne({ id });
    }
    dragon = dragon.toJSON();

    if (dragon.type === DRAGON_TYPE.EGG) {
      return {
        id: dragon.id,
        name: dragon.name,
        generation: dragon.generation,
        stats: dragon.stats,
        potential: dragon.potential,
        class: dragon.class,
        type: dragon.type,
        owner: dragon.owner,
        price: dragon.price,
        sale: dragon.sale,
        cooldownIndex: dragon.cooldownIndex,
        level: dragon.type === DRAGON_TYPE.DRAGON ? dragon.level : 1,
        mutant: dragon.mutant,
      };
    }
    const equipments = await getEquipmentsByDragonId(id);
    dragon.currentStats = getCurrentStats(dragon, equipments);
    return {
      id: dragon.id,
      name: dragon.name,
      generation: dragon.generation,
      image: dragon.image,
      stats: dragon.stats,
      currentStats: dragon.currentStats,
      equipments,
      potential: dragon.potential,
      class: dragon.class,
      type: dragon.type,
      owner: dragon.owner,
      price: dragon.price,
      sale: dragon.sale,
      cooldownIndex: dragon.cooldownIndex,
      xp: dragon.xp,
      level: dragon.type === DRAGON_TYPE.DRAGON ? dragon.level : 1,
      mutant: dragon.mutant
    };
  } catch (error) {
    logger.error('DragonService getDragon error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function hatchDragon(id, owner) {
  try {
    const dragon = await Dragons.findOne({ id });
    if (web3.utils.toChecksumAddress(dragon?.owner) !== web3.utils.toChecksumAddress(owner)) {
      return Promise.reject(new APIError(401, [
        {
          msg: 'Permission denied',
          param: 'PermissionDenied',
        },
      ]));
    }
    if (dragon?.type === DRAGON_TYPE.DRAGON) {
      return Promise.reject(new APIError(404, [
        {
          msg: 'Egg not found',
          param: 'eggNotFound',
        },
      ]));
    }
    if (dragon?.hatched > Date.now()) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Can\'t hatch egg at the moment',
          param: 'eggCantNotHatch',
        },
      ]));
    }
    const data = await packageImageDragon(dragon.id, dragon.class, dragon.parts);
    const image = data ?? dragon.image;
    await Dragons.updateOne({ id },
      {
      $set: {
        type: DRAGON_TYPE.DRAGON,
        image: image
      }
});
    await syncSkillByDragon(id);
    return await getDragon(id);
  } catch (error) {
    logger.error('DragonService hatchDragon error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
const BATCH_SIZE = 10;
const DELAY_MS = 1000;

export async function syncImagesDragon() {
  try {
    const dragons = await Dragons.find();
    for (let i = 0; i < dragons.length; i += BATCH_SIZE) {
      const batch = dragons.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async dragon => {
        const data = await packageImageDragon(dragon.id, dragon.class, dragon.parts);
        const image = data ?? dragon.image;
        AMPQ.sendDataToQueue(WORKER_NAME.RESIZE_IMAGE, image);
      }));
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  } catch (error) {
    logger.error('DragonService hatchDragon error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function getDragonSkills(id) {
  try {
    const dragon = await Dragons.findOne({ id });
    if (!dragon) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Dragon not found.',
          param: 'dragonNotFound',
        },
      ]));
    }
    const skillsDragon = await SkillDragon.find({ dragon: dragon._id });
    let skills = await Promise.all(skillsDragon.map(async skill => {
      let skillInfo = await Skill.findById(skill.skill);
      skillInfo = skillInfo.toJSON();
      skillInfo.stats = {
        attack: {
          defaultValue: skillInfo.attack,
          increase: 0
        },
        defend: {
          defaultValue: skillInfo.defend,
          increase: 0
        },
      }
      skillInfo.levelEffect = skill.level;
      skillInfo.useDefault = skill.useDefault || false;
      return skillInfo;
    }));
    skills = await getSkillsDragonWithNFT(dragon, skills);
    return await Promise.all(skills?.map(async skillInfo => {
      const effectInfo = await Effect.findById(skillInfo.effect);
      let description = '';
      if (effectInfo?.description) {
        if (effectInfo.description.indexOf('%value%') === -1) {
          description = effectInfo.description;
        } else {
          const effectValues = effectInfo.key === EFFECT_KEYS.LETHAL ? EFFECT_LETHAL_LEVEL_VALUES : EFFECT_LEVEL_VALUES;
          description = effectInfo.description.replace('%value%', `${effectValues[skillInfo?.levelEffect]}%`);
        }
      }
      return {
        _id: skillInfo?._id,
        nftId: skillInfo.nftId,
        id: skillInfo?.id,
        name: skillInfo.name,
        part: skillInfo.part,
        type: skillInfo.type,
        attack: skillInfo.attack,
        defend: skillInfo.defend,
        stats: skillInfo.stats,
        mana: skillInfo.mana,
        figure: skillInfo.figure,
        image: skillInfo.image,
        effect: {
          _id: effectInfo?._id,
          id: effectInfo?.id,
          name: effectInfo?.name,
          key: effectInfo?.key,
          type: effectInfo?.type,
          level: skillInfo?.levelEffect ?? '',
          description
        },
        level: skillInfo.level,
        rarity: skillInfo.rarity,
        skillDefault: skillInfo.skillDefault,
        skillNft: skillInfo.skillNft,
        audioSkill: skillInfo.audioSkill,
        audioAttacked: skillInfo.audioAttacked
      };
    }));
  } catch (error) {
    logger.error('DragonService hatchDragon error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function uploadIPFS() {
  try {
    // pinata.testAuthentication().then((result) => {
    //   //handle successful authentication here
    //   console.log(result);
    // }).catch((err) => {
    //   //handle error here
    //   console.log(err);
    // });
  } catch (error) {
    logger.error('DragonService hatchDragon error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function updateDragonOwner(id = '') {
  try {
    const owner = await getDragonOwner(id);
    return await updateDragon(id, { owner });
  } catch (error) {
    logger.error('DragonService updateDragonOwner error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function migrateData() {
  try {
    const total = await getTotal();
    for (let i = 5600; i <= total; i++) {
      getDragonDetailFromBlToSync(i);
    }
    return true;
  } catch (error) {
    logger.error('DragonService openDragon error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function syncDragon() {
  try {
    const total = await getTotal();
    for (let i = 1; i <= total; i++) {
      getDragonDetailFromBl(i);
    }
    return true;
  } catch (error) {
    logger.error('DragonService openDragon error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function migrateDataDB() {
  try {
    const dragons = await Dragons.find();
    await Promise.all(dragons.map(async (dragon) => {
      const level = dragon.level;
      await Dragons.updateOne({
        _id: dragon._id
      }, {
        $unset: {
          level: 1
        },
        $set: {
          potential: level
        }
      });
    }));
    return;
  } catch (error) {
    logger.error('DragonService openDragon error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function getDragonAdventure(owner) {
  try {
    return await Dragons.distinct('id', {
      owner: new RegExp(['^', owner, '$'].join(''), 'i'),
      type: DRAGON_TYPE.DRAGON,
      sale: null,
      $or: [
        { startLock: { $lt: (new Date().getTime() / 1000) - 3600 } },
        { startLock: null }
      ]
    });
  } catch (error) {
    logger.error('DragonService getDragonAdventure error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function syncSkills() {
  try {
    const workbook = XLSX.readFile(`${ROOT_PATH}/resource/skill.xlsx`);
    const sheet_name_list = workbook.SheetNames;
    const xlDataEffect = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
    await Promise.all(xlDataEffect?.map( async (data, index) => {
      const currentEffect = await Effect.findOne({ id: data.id })
      if (currentEffect) {
        await Effect.updateOne(
          {
            id: data.id
          },
          {
            $set: data
          }
        );
      } else {
        await Effect.create(data);
      }
    }));
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    xlData?.map( async (data, index) => {
      data.class = data.class?.toUpperCase();
      data.type = data.type.toUpperCase();
      data.attack = data.attack*100;
      data.mana = data.mana*100;
      const effect = await Effect.findOne({ name: data.effect });
      data.effect = effect._id;
      data.attack = Math.round(data.attack);
      const currentSkill = await Skill.findOne({ id: data.id });
      if (currentSkill) {
        await Skill.updateOne(
          {
            id: data.id
          },
          {
            $set: data
          }
        );
      } else {
        await Skill.create(data);
      }
    });
  } catch (error) {
    logger.error('DragonService syncNftsLpdi error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function syncSkillByDragon(id) {
  try {
    const dragon = await Dragons.findOne({ id: Number(id) })
    const skillDragons = await SkillDragon.find({ dragon: dragon._id });
    if (skillDragons?.length) {
      return;
    }
    const skillMetalHorn = await Skill.find({
      class: 'METAL',
      part: 'Horns'
    });
    const skillMetalMiddleHorns = await Skill.find({
      class: 'METAL',
      part: 'MiddleHorns'
    });
    const skillMetalArmor = await Skill.find({
      class: 'METAL',
      part: 'Armor'
    });
    const skillMetalHead = await Skill.find({
      class: 'METAL',
      part: 'Head'
    });
    const skillMetalWings = await Skill.find({
      class: 'METAL',
      part: 'Wings'
    });
    const skillMetalTail = await Skill.find({
      class: 'METAL',
      part: 'Tail'
    });
    const skillMetalFins = await Skill.find({
      class: 'METAL',
      part: 'Fins'
    });

    const skillFireHorn = await Skill.find({
      class: 'FIRE',
      part: 'Horns'
    });
    const skillFireMiddleHorns = await Skill.find({
      class: 'FIRE',
      part: 'MiddleHorns'
    });
    const skillFireArmor = await Skill.find({
      class: 'FIRE',
      part: 'Armor'
    });
    const skillFireHead = await Skill.find({
      class: 'FIRE',
      part: 'Head'
    });
    const skillFireWings = await Skill.find({
      class: 'FIRE',
      part: 'Wings'
    });
    const skillFireTail = await Skill.find({
      class: 'FIRE',
      part: 'Tail'
    });
    const skillFireFins = await Skill.find({
      class: 'FIRE',
      part: 'Fins'
    });
    const skillEarthHorn = await Skill.find({
      class: 'EARTH',
      part: 'Horns'
    });
    const skillEarthMiddleHorns = await Skill.find({
      class: 'EARTH',
      part: 'MiddleHorns'
    });
    const skillEarthArmor = await Skill.find({
      class: 'EARTH',
      part: 'Armor'
    });
    const skillEarthHead = await Skill.find({
      class: 'EARTH',
      part: 'Head'
    });
    const skillEarthWings = await Skill.find({
      class: 'EARTH',
      part: 'Wings'
    });
    const skillEarthTail = await Skill.find({
      class: 'EARTH',
      part: 'Tail'
    });
    const skillEarthFins = await Skill.find({
      class: 'EARTH',
      part: 'Fins'
    });

    const skillWaterHorn = await Skill.find({
      class: 'WATER',
      part: 'Horns'
    });
    const skillWaterMiddleHorns = await Skill.find({
      class: 'WATER',
      part: 'MiddleHorns'
    });
    const skillWaterArmor = await Skill.find({
      class: 'WATER',
      part: 'Armor'
    });
    const skillWaterHead = await Skill.find({
      class: 'WATER',
      part: 'Head'
    });
    const skillWaterWings = await Skill.find({
      class: 'WATER',
      part: 'Wings'
    });
    const skillWaterTail = await Skill.find({
      class: 'WATER',
      part: 'Tail'
    });
    const skillWaterFins = await Skill.find({
      class: 'WATER',
      part: 'Fins'
    });

    const skillWoodHorn = await Skill.find({
      class: 'WOOD',
      part: 'Horns'
    });
    const skillWoodMiddleHorns = await Skill.find({
      class: 'WOOD',
      part: 'MiddleHorns'
    });
    const skillWoodArmor = await Skill.find({
      class: 'WOOD',
      part: 'Armor'
    });
    const skillWoodHead = await Skill.find({
      class: 'WOOD',
      part: 'Head'
    });
    const skillWoodWings = await Skill.find({
      class: 'WOOD',
      part: 'Wings'
    });
    const skillWoodTail = await Skill.find({
      class: 'WOOD',
      part: 'Tail'
    });
    const skillWoodFins = await Skill.find({
      class: 'WOOD',
      part: 'Fins'
    });

    const skillYinyangHorn = await Skill.find({
      class: 'YINYANG',
      part: 'Horns'
    });
    const skillYinyangMiddleHorns = await Skill.find({
      class: 'YINYANG',
      part: 'MiddleHorns'
    });
    const skillYinyangArmor = await Skill.find({
      class: 'YINYANG',
      part: 'Armor'
    });
    const skillYinyangHead = await Skill.find({
      class: 'YINYANG',
      part: 'Head'
    });
    const skillYinyangWings = await Skill.find({
      class: 'YINYANG',
      part: 'Wings'
    });
    const skillYinyangTail = await Skill.find({
      class: 'YINYANG',
      part: 'Tail'
    });
    const skillYinyangFins = await Skill.find({
      class: 'YINYANG',
      part: 'Fins'
    });

    const skillLegendHorn = await Skill.find({
      class: 'LEGEND',
      part: 'Horns'
    });
    const skillLegendMiddleHorns = await Skill.find({
      class: 'LEGEND',
      part: 'MiddleHorns'
    });
    const skillLegendArmor = await Skill.find({
      class: 'LEGEND',
      part: 'Armor'
    });
    const skillLegendHead = await Skill.find({
      class: 'LEGEND',
      part: 'Head'
    });
    const skillLegendWings = await Skill.find({
      class: 'LEGEND',
      part: 'Wings'
    });
    const skillLegendTail = await Skill.find({
      class: 'LEGEND',
      part: 'Tail'
    });
    const skillLegendFins = await Skill.find({
      class: 'LEGEND',
      part: 'Fins'
    });

    const parts = dragon.parts;
    const classDragon = dragon.class;
    const morale = dragon.stats.morale;
    await Promise.all(Object.keys(parts).map(async function(key, index) {
      let skill;
      let data = {};
      let effect = {};
      switch (key) {
        case 'horns':
          if (parseInt(parts[key], 0) !== 0) {
            switch (classDragon) {
              case 'METAL':
                skill = skillMetalHorn[Math.floor(Math.random() * skillMetalHorn.length)];
                break;
              case 'WOOD':
                skill = skillWoodHorn[Math.floor(Math.random() * skillWoodHorn.length)];
                break;
              case 'EARTH':
                skill = skillEarthHorn[Math.floor(Math.random() * skillEarthHorn.length)];
                break;
              case 'WATER':
                skill = skillWaterHorn[Math.floor(Math.random() * skillWaterHorn.length)];
                break;
              case 'FIRE':
                skill = skillFireHorn[Math.floor(Math.random() * skillFireHorn.length)];
                break;
              case 'YINYANG':
                skill = skillYinyangHorn[Math.floor(Math.random() * skillYinyangHorn.length)];
                break;
              case 'LEGEND':
                skill = skillLegendHorn[Math.floor(Math.random() * skillLegendHorn.length)];
                break;
            }
            data.dragon = dragon._id;
            data.skill = skill._id;
            effect = await Effect.findById(skill.effect);
            if (effect?.level?.length) {
              data.level = getLevelEffect(morale);
            }
            await SkillDragon.create(data);
          }
          break;
        case 'middlehorns':
          if (parseInt(parts[key], 0) !== 0) {
            switch (classDragon) {
              case 'METAL':
                skill = skillMetalMiddleHorns[Math.floor(Math.random() * skillMetalMiddleHorns.length)];
                break;
              case 'WOOD':
                skill = skillWoodMiddleHorns[Math.floor(Math.random() * skillWoodMiddleHorns.length)];
                break;
              case 'EARTH':
                skill = skillEarthMiddleHorns[Math.floor(Math.random() * skillEarthMiddleHorns.length)];
                break;
              case 'WATER':
                skill = skillWaterMiddleHorns[Math.floor(Math.random() * skillWaterMiddleHorns.length)];
                break;
              case 'FIRE':
                skill = skillFireMiddleHorns[Math.floor(Math.random() * skillFireMiddleHorns.length)];
                break;
              case 'YINYANG':
                skill = skillYinyangMiddleHorns[Math.floor(Math.random() * skillYinyangMiddleHorns.length)];
                break;
              case 'LEGEND':
                skill = skillLegendMiddleHorns[Math.floor(Math.random() * skillLegendMiddleHorns.length)];
                break;
            }
            data.dragon = dragon._id;
            data.skill = skill._id;
            effect = await Effect.findById(skill.effect);
            if (effect?.level?.length) {
              data.level = getLevelEffect(morale);
            }
            await SkillDragon.create(data)
          }
          break;
        case 'backcales':
          switch (classDragon) {
            case 'METAL':
              skill = skillMetalFins[Math.floor(Math.random() * skillMetalFins.length)];
              break;
            case 'WOOD':
              skill = skillWoodFins[Math.floor(Math.random() * skillWoodFins.length)];
              break;
            case 'EARTH':
              skill = skillEarthFins[Math.floor(Math.random() * skillEarthFins.length)];
              break;
            case 'WATER':
              skill = skillWaterFins[Math.floor(Math.random() * skillWaterFins.length)];
              break;
            case 'FIRE':
              skill = skillFireFins[Math.floor(Math.random() * skillFireFins.length)];
              break;
            case 'YINYANG':
              skill = skillYinyangFins[Math.floor(Math.random() * skillYinyangFins.length)];
              break;
            case 'LEGEND':
              skill = skillLegendFins[Math.floor(Math.random() * skillLegendFins.length)];
              break;
          }
          data.dragon = dragon._id;
          data.skill = skill._id;
          effect = await Effect.findById(skill.effect);
          if (effect?.level?.length) {
            data.level = getLevelEffect(morale);
          }
          await SkillDragon.create(data)
          break;
        case 'tail':
          switch (classDragon) {
            case 'METAL':
              skill = skillMetalTail[Math.floor(Math.random() * skillMetalTail.length)];
              break;
            case 'WOOD':
              skill = skillWoodTail[Math.floor(Math.random() * skillWoodTail.length)];
              break;
            case 'EARTH':
              skill = skillEarthTail[Math.floor(Math.random() * skillEarthTail.length)];
              break;
            case 'WATER':
              skill = skillWaterTail[Math.floor(Math.random() * skillWaterTail.length)];
              break;
            case 'FIRE':
              skill = skillFireTail[Math.floor(Math.random() * skillFireTail.length)];
              break;
            case 'YINYANG':
              skill = skillYinyangTail[Math.floor(Math.random() * skillYinyangTail.length)];
              break;
            case 'LEGEND':
              skill = skillLegendTail[Math.floor(Math.random() * skillLegendTail.length)];
              break;
          }
          data.dragon = dragon._id;
          data.skill = skill._id;
          effect = await Effect.findById(skill.effect);
          if (effect?.level?.length) {
            data.level = getLevelEffect(morale);
          }
          await SkillDragon.create(data)
          break;
        case 'head':
          switch (classDragon) {
            case 'METAL':
              skill = skillMetalHead[Math.floor(Math.random() * skillMetalHead.length)];
              break;
            case 'WOOD':
              skill = skillWoodHead[Math.floor(Math.random() * skillWoodHead.length)];
              break;
            case 'EARTH':
              skill = skillEarthHead[Math.floor(Math.random() * skillEarthHead.length)];
              break;
            case 'WATER':
              skill = skillWaterHead[Math.floor(Math.random() * skillWaterHead.length)];
              break;
            case 'FIRE':
              skill = skillFireHead[Math.floor(Math.random() * skillFireHead.length)];
              break;
            case 'YINYANG':
              skill = skillYinyangHead[Math.floor(Math.random() * skillYinyangHead.length)];
              break;
            case 'LEGEND':
              skill = skillLegendHead[Math.floor(Math.random() * skillLegendHead.length)];
              break;
          }
          data.dragon = dragon._id;
          data.skill = skill._id;
          effect = await Effect.findById(skill.effect);
          if (effect?.level?.length) {
            data.level = getLevelEffect(morale);
          }
          await SkillDragon.create(data)
          break;
        case 'wings':
          switch (classDragon) {
            case 'METAL':
              skill = skillMetalWings[Math.floor(Math.random() * skillMetalWings.length)];
              break;
            case 'WOOD':
              skill = skillWoodWings[Math.floor(Math.random() * skillWoodWings.length)];
              break;
            case 'EARTH':
              skill = skillEarthWings[Math.floor(Math.random() * skillEarthWings.length)];
              break;
            case 'WATER':
              skill = skillWaterWings[Math.floor(Math.random() * skillWaterWings.length)];
              break;
            case 'FIRE':
              skill = skillFireWings[Math.floor(Math.random() * skillFireWings.length)];
              break;
            case 'YINYANG':
              skill = skillYinyangWings[Math.floor(Math.random() * skillYinyangWings.length)];
              break;
            case 'LEGEND':
              skill = skillLegendWings[Math.floor(Math.random() * skillLegendWings.length)];
              break;
          }
          data.dragon = dragon._id;
          data.skill = skill._id;
          effect = await Effect.findById(skill.effect);
          if (effect?.level?.length) {
            data.level = getLevelEffect(morale);
          }
          await SkillDragon.create(data)
          break;
        case 'chest':
          switch (classDragon) {
            case 'METAL':
              skill = skillMetalArmor[Math.floor(Math.random() * skillMetalArmor.length)];
              break;
            case 'WOOD':
              skill = skillWoodArmor[Math.floor(Math.random() * skillWoodArmor.length)];
              break;
            case 'EARTH':
              skill = skillEarthArmor[Math.floor(Math.random() * skillEarthArmor.length)];
              break;
            case 'WATER':
              skill = skillWaterArmor[Math.floor(Math.random() * skillWaterArmor.length)];
              break;
            case 'FIRE':
              skill = skillFireArmor[Math.floor(Math.random() * skillFireArmor.length)];
              break;
            case 'YINYANG':
              skill = skillYinyangArmor[Math.floor(Math.random() * skillYinyangArmor.length)];
              break;
            case 'LEGEND':
              skill = skillLegendArmor[Math.floor(Math.random() * skillLegendArmor.length)];
              break;
          }
          data.dragon = dragon._id;
          data.skill = skill._id;
          effect = await Effect.findById(skill.effect);
          if (effect?.level?.length) {
            data.level = getLevelEffect(morale);
          }
          await SkillDragon.create(data)
          break;
        default:
          break;
      }
    }));

  } catch (error) {
    logger.error('DragonService syncSkillByDragon error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function syncSkillsDragon() {
  try {
    const dragonIdSyncDone = await SkillDragon.find({}).distinct('dragon');
    const dragons = await Dragons.find({
      _id: { $nin: dragonIdSyncDone }
    });
    if (!dragons?.length) return true;
    const skillMetalHorn = await Skill.find({
      class: 'METAL',
      part: 'Horns'
    });
    const skillMetalMiddleHorns = await Skill.find({
      class: 'METAL',
      part: 'MiddleHorns'
    });
    const skillMetalArmor = await Skill.find({
      class: 'METAL',
      part: 'Armor'
    });
    const skillMetalHead = await Skill.find({
      class: 'METAL',
      part: 'Head'
    });
    const skillMetalWings = await Skill.find({
      class: 'METAL',
      part: 'Wings'
    });
    const skillMetalTail = await Skill.find({
      class: 'METAL',
      part: 'Tail'
    });
    const skillMetalFins = await Skill.find({
      class: 'METAL',
      part: 'Fins'
    });

    const skillFireHorn = await Skill.find({
      class: 'FIRE',
      part: 'Horns'
    });
    const skillFireMiddleHorns = await Skill.find({
      class: 'FIRE',
      part: 'MiddleHorns'
    });
    const skillFireArmor = await Skill.find({
      class: 'FIRE',
      part: 'Armor'
    });
    const skillFireHead = await Skill.find({
      class: 'FIRE',
      part: 'Head'
    });
    const skillFireWings = await Skill.find({
      class: 'FIRE',
      part: 'Wings'
    });
    const skillFireTail = await Skill.find({
      class: 'FIRE',
      part: 'Tail'
    });
    const skillFireFins = await Skill.find({
      class: 'FIRE',
      part: 'Fins'
    });
    const skillEarthHorn = await Skill.find({
      class: 'EARTH',
      part: 'Horns'
    });
    const skillEarthMiddleHorns = await Skill.find({
      class: 'EARTH',
      part: 'MiddleHorns'
    });
    const skillEarthArmor = await Skill.find({
      class: 'EARTH',
      part: 'Armor'
    });
    const skillEarthHead = await Skill.find({
      class: 'EARTH',
      part: 'Head'
    });
    const skillEarthWings = await Skill.find({
      class: 'EARTH',
      part: 'Wings'
    });
    const skillEarthTail = await Skill.find({
      class: 'EARTH',
      part: 'Tail'
    });
    const skillEarthFins = await Skill.find({
      class: 'EARTH',
      part: 'Fins'
    });

    const skillWaterHorn = await Skill.find({
      class: 'WATER',
      part: 'Horns'
    });
    const skillWaterMiddleHorns = await Skill.find({
      class: 'WATER',
      part: 'MiddleHorns'
    });
    const skillWaterArmor = await Skill.find({
      class: 'WATER',
      part: 'Armor'
    });
    const skillWaterHead = await Skill.find({
      class: 'WATER',
      part: 'Head'
    });
    const skillWaterWings = await Skill.find({
      class: 'WATER',
      part: 'Wings'
    });
    const skillWaterTail = await Skill.find({
      class: 'WATER',
      part: 'Tail'
    });
    const skillWaterFins = await Skill.find({
      class: 'WATER',
      part: 'Fins'
    });

    const skillWoodHorn = await Skill.find({
      class: 'WOOD',
      part: 'Horns'
    });
    const skillWoodMiddleHorns = await Skill.find({
      class: 'WOOD',
      part: 'MiddleHorns'
    });
    const skillWoodArmor = await Skill.find({
      class: 'WOOD',
      part: 'Armor'
    });
    const skillWoodHead = await Skill.find({
      class: 'WOOD',
      part: 'Head'
    });
    const skillWoodWings = await Skill.find({
      class: 'WOOD',
      part: 'Wings'
    });
    const skillWoodTail = await Skill.find({
      class: 'WOOD',
      part: 'Tail'
    });
    const skillWoodFins = await Skill.find({
      class: 'WOOD',
      part: 'Fins'
    });

    const skillYinyangHorn = await Skill.find({
      class: 'YINYANG',
      part: 'Horns'
    });
    const skillYinyangMiddleHorns = await Skill.find({
      class: 'YINYANG',
      part: 'MiddleHorns'
    });
    const skillYinyangArmor = await Skill.find({
      class: 'YINYANG',
      part: 'Armor'
    });
    const skillYinyangHead = await Skill.find({
      class: 'YINYANG',
      part: 'Head'
    });
    const skillYinyangWings = await Skill.find({
      class: 'YINYANG',
      part: 'Wings'
    });
    const skillYinyangTail = await Skill.find({
      class: 'YINYANG',
      part: 'Tail'
    });
    const skillYinyangFins = await Skill.find({
      class: 'YINYANG',
      part: 'Fins'
    });

    const skillLegendHorn = await Skill.find({
      class: 'LEGEND',
      part: 'Horns'
    });
    const skillLegendMiddleHorns = await Skill.find({
      class: 'LEGEND',
      part: 'MiddleHorns'
    });
    const skillLegendArmor = await Skill.find({
      class: 'LEGEND',
      part: 'Armor'
    });
    const skillLegendHead = await Skill.find({
      class: 'LEGEND',
      part: 'Head'
    });
    const skillLegendWings = await Skill.find({
      class: 'LEGEND',
      part: 'Wings'
    });
    const skillLegendTail = await Skill.find({
      class: 'LEGEND',
      part: 'Tail'
    });
    const skillLegendFins = await Skill.find({
      class: 'LEGEND',
      part: 'Fins'
    });
    await Promise.all(dragons.map(async dragon => {
      const parts = dragon.parts;
      const classDragon = dragon.class;
      const morale = dragon.stats.morale;
      await Promise.all(Object.keys(parts).map(async function(key, index) {
        let skill;
        let data = {};
        let effect = {};
        switch (key) {
          case 'horns':
            if (parseInt(parts[key], 0) !== 0) {
              switch (classDragon) {
                case 'METAL':
                  skill = skillMetalHorn[Math.floor(Math.random() * skillMetalHorn.length)];
                  break;
                case 'WOOD':
                  skill = skillWoodHorn[Math.floor(Math.random() * skillWoodHorn.length)];
                  break;
                case 'EARTH':
                  skill = skillEarthHorn[Math.floor(Math.random() * skillEarthHorn.length)];
                  break;
                case 'WATER':
                  skill = skillWaterHorn[Math.floor(Math.random() * skillWaterHorn.length)];
                  break;
                case 'FIRE':
                  skill = skillFireHorn[Math.floor(Math.random() * skillFireHorn.length)];
                  break;
                case 'YINYANG':
                  skill = skillYinyangHorn[Math.floor(Math.random() * skillYinyangHorn.length)];
                  break;
                case 'LEGEND':
                  skill = skillLegendHorn[Math.floor(Math.random() * skillLegendHorn.length)];
                  break;
              }
              data.dragon = dragon._id;
              data.skill = skill._id;
              effect = await Effect.findById(skill.effect);
              if (effect?.level?.length) {
                data.level = getLevelEffect(morale);
              }
              await SkillDragon.create(data);
            }
            break;
          case 'middlehorns':
            if (parseInt(parts[key], 0) !== 0) {
              switch (classDragon) {
                case 'METAL':
                  skill = skillMetalMiddleHorns[Math.floor(Math.random() * skillMetalMiddleHorns.length)];
                  break;
                case 'WOOD':
                  skill = skillWoodMiddleHorns[Math.floor(Math.random() * skillWoodMiddleHorns.length)];
                  break;
                case 'EARTH':
                  skill = skillEarthMiddleHorns[Math.floor(Math.random() * skillEarthMiddleHorns.length)];
                  break;
                case 'WATER':
                  skill = skillWaterMiddleHorns[Math.floor(Math.random() * skillWaterMiddleHorns.length)];
                  break;
                case 'FIRE':
                  skill = skillFireMiddleHorns[Math.floor(Math.random() * skillFireMiddleHorns.length)];
                  break;
                case 'YINYANG':
                  skill = skillYinyangMiddleHorns[Math.floor(Math.random() * skillYinyangMiddleHorns.length)];
                  break;
                case 'LEGEND':
                  skill = skillLegendMiddleHorns[Math.floor(Math.random() * skillLegendMiddleHorns.length)];
                  break;
              }
              data.dragon = dragon._id;
              data.skill = skill._id;
              effect = await Effect.findById(skill.effect);
              if (effect?.level?.length) {
                data.level = getLevelEffect(morale);
              }
              await SkillDragon.create(data)
            }
            break;
          case 'backcales':
            switch (classDragon) {
              case 'METAL':
                skill = skillMetalFins[Math.floor(Math.random() * skillMetalFins.length)];
                break;
              case 'WOOD':
                skill = skillWoodFins[Math.floor(Math.random() * skillWoodFins.length)];
                break;
              case 'EARTH':
                skill = skillEarthFins[Math.floor(Math.random() * skillEarthFins.length)];
                break;
              case 'WATER':
                skill = skillWaterFins[Math.floor(Math.random() * skillWaterFins.length)];
                break;
              case 'FIRE':
                skill = skillFireFins[Math.floor(Math.random() * skillFireFins.length)];
                break;
              case 'YINYANG':
                skill = skillYinyangFins[Math.floor(Math.random() * skillYinyangFins.length)];
                break;
              case 'LEGEND':
                skill = skillLegendFins[Math.floor(Math.random() * skillLegendFins.length)];
                break;
            }
            data.dragon = dragon._id;
            data.skill = skill._id;
            effect = await Effect.findById(skill.effect);
            if (effect?.level?.length) {
              data.level = getLevelEffect(morale);
            }
            await SkillDragon.create(data)
            break;
          case 'tail':
            switch (classDragon) {
              case 'METAL':
                skill = skillMetalTail[Math.floor(Math.random() * skillMetalTail.length)];
                break;
              case 'WOOD':
                skill = skillWoodTail[Math.floor(Math.random() * skillWoodTail.length)];
                break;
              case 'EARTH':
                skill = skillEarthTail[Math.floor(Math.random() * skillEarthTail.length)];
                break;
              case 'WATER':
                skill = skillWaterTail[Math.floor(Math.random() * skillWaterTail.length)];
                break;
              case 'FIRE':
                skill = skillFireTail[Math.floor(Math.random() * skillFireTail.length)];
                break;
              case 'YINYANG':
                skill = skillYinyangTail[Math.floor(Math.random() * skillYinyangTail.length)];
                break;
              case 'LEGEND':
                skill = skillLegendTail[Math.floor(Math.random() * skillLegendTail.length)];
                break;
            }
            data.dragon = dragon._id;
            data.skill = skill._id;
            effect = await Effect.findById(skill.effect);
            if (effect?.level?.length) {
              data.level = getLevelEffect(morale);
            }
            await SkillDragon.create(data)
            break;
          case 'head':
            switch (classDragon) {
              case 'METAL':
                skill = skillMetalHead[Math.floor(Math.random() * skillMetalHead.length)];
                break;
              case 'WOOD':
                skill = skillWoodHead[Math.floor(Math.random() * skillWoodHead.length)];
                break;
              case 'EARTH':
                skill = skillEarthHead[Math.floor(Math.random() * skillEarthHead.length)];
                break;
              case 'WATER':
                skill = skillWaterHead[Math.floor(Math.random() * skillWaterHead.length)];
                break;
              case 'FIRE':
                skill = skillFireHead[Math.floor(Math.random() * skillFireHead.length)];
                break;
              case 'YINYANG':
                skill = skillYinyangHead[Math.floor(Math.random() * skillYinyangHead.length)];
                break;
              case 'LEGEND':
                skill = skillLegendHead[Math.floor(Math.random() * skillLegendHead.length)];
                break;
            }
            data.dragon = dragon._id;
            data.skill = skill._id;
            effect = await Effect.findById(skill.effect);
            if (effect?.level?.length) {
              data.level = getLevelEffect(morale);
            }
            await SkillDragon.create(data)
            break;
          case 'wings':
            switch (classDragon) {
              case 'METAL':
                skill = skillMetalWings[Math.floor(Math.random() * skillMetalWings.length)];
                break;
              case 'WOOD':
                skill = skillWoodWings[Math.floor(Math.random() * skillWoodWings.length)];
                break;
              case 'EARTH':
                skill = skillEarthWings[Math.floor(Math.random() * skillEarthWings.length)];
                break;
              case 'WATER':
                skill = skillWaterWings[Math.floor(Math.random() * skillWaterWings.length)];
                break;
              case 'FIRE':
                skill = skillFireWings[Math.floor(Math.random() * skillFireWings.length)];
                break;
              case 'YINYANG':
                skill = skillYinyangWings[Math.floor(Math.random() * skillYinyangWings.length)];
                break;
              case 'LEGEND':
                skill = skillLegendWings[Math.floor(Math.random() * skillLegendWings.length)];
                break;
            }
            data.dragon = dragon._id;
            data.skill = skill._id;
            effect = await Effect.findById(skill.effect);
            if (effect?.level?.length) {
              data.level = getLevelEffect(morale);
            }
            await SkillDragon.create(data)
            break;
          case 'chest':
            switch (classDragon) {
              case 'METAL':
                skill = skillMetalArmor[Math.floor(Math.random() * skillMetalArmor.length)];
                break;
              case 'WOOD':
                skill = skillWoodArmor[Math.floor(Math.random() * skillWoodArmor.length)];
                break;
              case 'EARTH':
                skill = skillEarthArmor[Math.floor(Math.random() * skillEarthArmor.length)];
                break;
              case 'WATER':
                skill = skillWaterArmor[Math.floor(Math.random() * skillWaterArmor.length)];
                break;
              case 'FIRE':
                skill = skillFireArmor[Math.floor(Math.random() * skillFireArmor.length)];
                break;
              case 'YINYANG':
                skill = skillYinyangArmor[Math.floor(Math.random() * skillYinyangArmor.length)];
                break;
              case 'LEGEND':
                skill = skillLegendArmor[Math.floor(Math.random() * skillLegendArmor.length)];
                break;
            }
            data.dragon = dragon._id;
            data.skill = skill._id;
            effect = await Effect.findById(skill.effect);
            if (effect?.level?.length) {
              data.level = getLevelEffect(morale);
            }
            await SkillDragon.create(data)
            break;
          default:
            break;
        }
      }));
    }));
  } catch (error) {
    logger.error('DragonService syncNftsLpdi error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export function getLevelEffect(morale) {
  let levels;
  switch (morale) {
    case 0:
      levels = [
        { value: 'A', probability: 0.9 },
        { value: 'S', probability: 0.1 }
      ];
      return randomizer(levels);
    case 1:
      levels = [
        { value: 'A', probability: 0.6 },
        { value: 'S', probability: 0.4 }
      ];
      return randomizer(levels);
    case 2:
      levels = [
        { value: 'A', probability: 0.4 },
        { value: 'S', probability: 0.5 },
        { value: 'SS', probability: 0.1 },
      ];
      return randomizer(levels);
    case 3:
      levels = [
        { value: 'A', probability: 0.3 },
        { value: 'S', probability: 0.6 },
        { value: 'SS', probability: 0.1 },
      ];
      return randomizer(levels);
    case 4:
      levels = [
        { value: 'S', probability: 0.8 },
        { value: 'SS', probability: 0.2 },
      ];
      return randomizer(levels);
    case 5:
      levels = [
        { value: 'S', probability: 0.7 },
        { value: 'SS', probability: 0.3 },
      ];
      return randomizer(levels);
    case 9:
      levels = [
        { value: 'S', probability: 0.3 },
        { value: 'SS', probability: 0.7 },
      ];
      return randomizer(levels);
    case 10:
      levels = [
        { value: 'S', probability: 0.3 },
        { value: 'SS', probability: 0.7 },
      ];
      return randomizer(levels);
    case 11:
      levels = [
        { value: 'S', probability: 0.2 },
        { value: 'SS', probability: 0.8 },
      ];
      return randomizer(levels);
    case 12:
      levels = [
        { value: 'S', probability: 0.1 },
        { value: 'SS', probability: 0.9 },
      ];
      return randomizer(levels);
    case 13:
      levels = [
        { value: 'S', probability: 0.1 },
        { value: 'SS', probability: 0.9 },
      ];
      return randomizer(levels);
    case 14:
      return 'SS';
  }
}
export function randomizer(values) {
  let i, pickedValue,
    randomNr = Math.random(),
    threshold = 0;

  for (i = 0; i < values.length; i++) {
    if (values[i].probability === '*') {
      continue;
    }

    threshold += values[i].probability;
    if (threshold > randomNr) {
      pickedValue = values[i].value;
      break;
    }

    if (!pickedValue) {
      //nothing found based on probability value, so pick element marked with wildcard
      pickedValue = values.filter((value) => value.probability === '*');
    }
  }

  return pickedValue;
}
export async function syncTotalStats() {
  try {
    const dragons = await Dragons.find({ 'totalStats.total': 0 });
    return await Promise.all(
      dragons.map(async (dragon) => {
        const stats = dragon.stats;
        const potential = dragon.potential + 1;
        const level = dragon?.level ?? 1;
        const totalStats = {
          mana: stats.mana + ((level - 1) * potential),
          health: stats.health + ((level - 1) * potential),
          attack: stats.attack + ((level - 1) * potential),
          defend: stats.defend + ((level - 1) * potential),
          speed: stats.speed + ((level - 1) * potential),
          morale: stats.morale + ((level - 1) * potential),
        };
        totalStats.total = totalStats.mana + totalStats.health + totalStats.attack + totalStats.defend + totalStats.speed + totalStats.morale;
        await Dragons.updateOne({ id: dragon.id }, { $set: { totalStats: totalStats } });
      })
    );
  } catch (error) {
    logger.error('DragonService syncTotalStats error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function checkDuplicateDragon() {
  try {
    const dragons = await Dragons.find({}, 'id').sort({ id: 1 }).lean()
    const dragonIds = dragons.map(dragon => dragon.id);
    dragonIds.forEach(dragon => {
      let count = 0;
      dragonIds.forEach(id => {
        if (Number(id) === Number(dragon)) {
          count += 1;
        }
      })
      if (count > 1) {
        console.log(`Check : ${dragon} ---- ${count}`);
      }
    })
  } catch (error) {
    logger.error('DragonService checkDuplicateDragon error:', error);
  }
}

export async function migrateDataDragon(id) {
  try {
    await getDragonDetailFromBlToSync(parseInt(id, 0));
    return true;
  } catch (error) {
    logger.error('DragonService openDragon error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function favoritesDragon(id, owner) {
  try {
    const dragon = await Dragons.findOne({ id: parseInt(id, 0) });
    if (!dragon) {
      return Promise.reject(new APIError(404, [
        {
          msg: 'Dragon not found.',
          param: 'dragonNotFound',
        },
      ]));
    }
    const favorites = await Favorites.countDocuments({ id: parseInt(id, 0), owner });
    if (favorites) {
      await Favorites.deleteOne({
        id: parseInt(id, 0), owner
      });
    } else {
      await Favorites.create({
        id: parseInt(id, 0), owner
      });
    }
    return true;
  } catch (error) {
    logger.error('DragonService openDragon error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export function getParts(parts) {
  try {
    const data = {};
    Object.keys(parts).map((key) => {
      switch (key) {
        case 'horns':
          data.horns = PARTS_NAME.horns[parts[key]];
          break;
        case 'middlehorns':
          data.middlehorns = PARTS_NAME.middlehorns[parts[key]];
          break;
        case 'backcales':
          data.backcales = PARTS_NAME.backcales[parts[key]];
          break;
        case 'tail':
          data.tail = PARTS_NAME.tail[parts[key]];
          break;
        case 'head':
          data.head = parts[key] === 'f' ? `${PARTS_NAME.head[parts[key]]} ` : `${COLOR[parts.bodyColor]} ${PARTS_NAME.head[parts[key]]}`;
          break;
        case 'eyes':
          data.eyes = PARTS_NAME.eyes[parts[key]];
          break;
        case 'wings':
          data.wings = parts[key] === 'f' ? `${PARTS_NAME.wings[parts[key]]}` : `${COLOR[parts.wingsColor]} ${PARTS_NAME.wings[parts[key]]}`;
          break;
        case 'chest':
          data.chest = parts[key] === 'f' ? `${PARTS_NAME.chest[parts[key]]}` : `${COLOR[parts.tailColor]} ${PARTS_NAME.chest[parts[key]]}`;
          break;
        default:
          break;
      }
    });
    return data;
  } catch (error) {
    logger.error('DragonService getParts error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function getEffectIcons() {
  try {
    const effects = await Effect.find({}).lean();
    const iconEffects = {};
    effects.forEach((effect) => {
      iconEffects[effect.key] = getImageLink(`resource/effects/${effect.key}.png`);
    })
    return iconEffects;
  } catch (error) {
    logger.error('DragonService getParts error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function getFulSkills() {
  try {
    const skills = await Skill.find({}).sort({ id: 1 });
    return skills.map((skill) => skill.toJSON())
  } catch (error) {
    logger.error('DragonService getFulSkills error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

/**
 *
 * @param {array} ids
 * @returns {Promise<void>}
 */
export async function getListDragon(ids) {
  try {
    const dragons = await Dragons.find({ id: ids }).lean();
    return dragons;
  } catch (error) {
    logger.error('DragonService getListDragon error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function generateResourceDragons(options) {
  try {
    const conditions = {
      type: DRAGON_TYPE.DRAGON
    }
    if (options.fromId) {
      conditions.id = {
        $gte: Number(options.fromId)
      }
    }
    const dragons = await Dragons.find(conditions).sort({ id: 1 }).lean();
    let i = 1;
    while (i <= dragons.length) {
      // eslint-disable-next-line no-await-in-loop
      await generateResourcePerDragon(dragons[i]?.id);
      console.log(`Dragon ${dragons[i]?.id} resource created`)
      i += 1;
    }
    return true
  } catch (error) {
    logger.error('DragonService generateResourceDragons error:', error);
    throw new APIError(500, 'Internal server error');
  }
}


export function getLevelDragonViaExp(exp) {
  try {
    let level = 1;
    DRAGON_LEVELS.forEach(item => {
      if (exp >= item.exp) {
        level = item.level
      }
    })
    return level;
  } catch (error) {
    console.log('Error in getLevelDragonViaExp', error);
  }
}

export async function generateResourcePerDragon(id) {
  try {
    const dragon = await Dragons.findOne({ id });
    const data = await packageImageDragon(dragon.id, dragon.class, dragon.parts);
    const image = data ?? dragon.image;
    await Dragons.updateOne({ id },
      {
        $set: {
          image: image
        }
      });
    await syncSkillByDragon(id);
    return true;
  } catch (error) {
    console.log('Error in generateResourcePerDragon', error);
  }
}

export async function updateUseDefaultSkill(data, wallet) {
  try {
    const dataDragon = await Promise.all([
      Dragons.findById(data.dragon),
      SkillDragon.findOne({
        dragon: data.dragon,
        skill: data.skill
      })
    ])
    const dragon = dataDragon[0];
    const skillDragon = dataDragon[1];
    if (!dragon) {
      return Promise.reject(new APIError(404, [
        {
          msg: 'Dragon not found.',
          param: 'dragonNotFound',
        },
      ]));
    }
    if (dragon?.owner.toLowerCase() !== wallet.toLowerCase()) {
      return Promise.reject(new APIError(401, [
        {
          msg: 'Permission denied',
          param: 'PermissionDenied',
        },
      ]));
    }
    skillDragon.useDefault = data.useDefault;
    await skillDragon.save();
  } catch (error) {
    logger.error('DragonService updateUseDefaultSkill error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export function getCurrentStats(dragon, equipments) {
  try {
    const currentStats = {};
    Object.keys(dragon.stats).map((key) => {
      const equipmentBuff = equipments?.filter(equipment => equipment.stat === key) || [];
      const numberIncreaseByEquipments = equipmentBuff.reduce((pre, cur) => pre + cur.point, 0);
      currentStats[key] = dragon.stats[key] + (dragon?.potential + 1) * ((dragon.level || 1) - 1) + numberIncreaseByEquipments;
    })
    return currentStats;
  } catch (error) {
    console.log('Error in getCurrentStats', error);
  }
}

/**
 * Get list dragon skills
 * @param {number} options.limit
 * @param {number} options.skip
 * @param {number} options.page
 * @param {string} options.textSearch
 * @param {string} options.class
 * @param {string} options.rarity
 * @param {string} options.part
 * @param {string} options.attack
 * @param {string} options.defend
 * @param {string} options.effect
 * @param {string} options.order
 * @param {string} options.orderBy
 * @returns {Promise<void>}
 */
export async function getListDragonSkills(options) {
  try {
    const conditions = {};
    const sort = { id: 1 };
    if (typeof options.textSearch === 'string' && options.textSearch) {
      conditions.$or = [
        {
          name: { $regex: validSearchString(options.textSearch) }
        }
      ];
    }
    if (options.class) {
      conditions.class = options.class.split(',');
    }
    if (options.rarity) {
      conditions.rarity = options.rarity.split(',');
    }
    if (options.part) {
      conditions.part = options.part.split(',').map(item => PART_REPLACE_QUERY_ITEMS[item]);
    }
    if (options.attack) {
      const attack = options.attack.split(',');
      conditions.attack = {
        $gte: Number(attack[0]),
        $lte: Number(attack[1])
      }
    }
    if (options.defend) {
      const defend = options.defend.split(',');
      conditions.defend = {
        $gte: Number(defend[0]),
        $lte: Number(defend[1])
      }
    }
    if (options.effect) {
      conditions.effect = options.effect
    }
    if (options.order) {
      sort[options.order] = ORDER_BY[options.orderBy] || ORDER_BY.asc;
    }
    const data = await Promise.all([
      Skill.countDocuments(conditions),
      Skill
        .find(conditions)
        .sort(sort)
        .skip(options.skip)
        .limit(options.limit)
        .populate('effect')
    ])
    const skills = data[1].map(skill => {
      skill = skill.toJSON();
      if (skill?.effect?.description?.indexOf('by %value%') !== -1 && skill?.effect?.level?.length) {
        skill.effect.description = skill.effect.description.replace('by %value%', '');
      }
      return skill;
    });

    return {
      data: skills,
      totalItems: data[0],
      currentPage: options.page,
      totalPages: Math.ceil(data[0] / options.limit)
    };
  } catch (error) {
    logger.error('DragonService getListDragonSkills error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function getListEffect() {
  try {
    const effects = await Effect.find({}).sort({ id: 1 }).lean();
    return effects.map(effect => {
      if (effect?.description?.indexOf('by %value%') !== -1 && effect.level?.length) {
        const level = effect.level[0].split(',');
        const levelObj = {};
        level.forEach(key => {
          const effectValues = effect.key === EFFECT_KEYS.LETHAL ? EFFECT_LETHAL_LEVEL_VALUES : EFFECT_LEVEL_VALUES;
          effect.description = effect.description.replace('by %value%', '');
          levelObj[key] = effectValues[key]
        })
        effect.level = levelObj;
      }
      return effect
    })
    return effects
  } catch (error) {
    logger.error('DragonService getListEffect error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
