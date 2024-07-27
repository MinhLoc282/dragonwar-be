import logger from '../../api/logger';
import APIError from '../../util/APIError';
import History from './historyMonster.model';
import { DEFAULT_PAGE_LIMIT, DRAGON_TYPE, HISTORY_MONSTER_TYPE, MAX_PAGE_LIMIT } from '../../constants';
import { Promise } from 'mongoose';
import Dragons from '../dragon/dragon.model';
import { getImageSize } from '../../helpers/resize';
import { validSearchString } from '../../helpers/string.helper';

export async function createEventHistory(data) {
  try {
    await Dragons.updateOne({ id: data.data.dragonId }, { $set: { unlockTimestamp: data.data.unlockTimestamp }});
    await History.create(data);
  } catch (error) {
    logger.error('DragonService createHistory error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function getEvent(trxHash) {
  try {
    return await History.findOne({ trxHash });
  } catch (error) {
    logger.error('DragonService getEvent error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function getEvents(wallet, query) {
  try {
    const {
      type,
      id,
      monster,
      dragonId,
      rowPerPage
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
    const conditions = {};
    if (monster) {
      conditions.monster = monster;
    }
    if (type) {
      conditions.type = type;
    }
    if (id) {
      conditions['data.monsterId'] = parseInt(id, 0);
    }
    if (dragonId) {
      conditions['data.dragonId'] = parseInt(dragonId, 0);
    }
    const promises = await Promise.all([
      History.find(conditions).sort({ _id: -1 }).skip(skip).limit(pageLimit).lean(),
      History.countDocuments(conditions)
    ]);
    let data = promises[0];
    const totalItems = promises[1];
    data = await Promise.all(data?.map(async history => {
      if (history?.data?.dragonId) {
        const dragon = await Dragons.findOne({ id: history.data.dragonId });
        history.ownerAddress = dragon?.owner ?? '';
      }
      return history;
    }));
    return {
      data,
      currentPage: page,
      totalPage: Math.ceil(totalItems / pageLimit),
      totalItems: totalItems,
    };
  } catch (error) {
    logger.error('DragonService createHistory error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function getEventsUser(wallet, query) {
  try {
    const {
      type,
      id,
      monster,
      dragonId,
      rowPerPage
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
    const conditions = {};
    if (monster) {
      conditions.monster = monster;
    }
    if (type !== HISTORY_MONSTER_TYPE.CLAIM) {
      const dragons = await Dragons.distinct('id', { owner: new RegExp(['^', wallet, '$'].join(''), 'i'), type: DRAGON_TYPE.DRAGON });
      if (id) {
        conditions['data.monsterId'] = parseInt(id, 0);
      }
      if (type) {
        conditions.type = type;
      } else {
        conditions.type = { $ne: HISTORY_MONSTER_TYPE.CLAIM };
      }
      if (dragonId) {
        conditions['data.dragonId'] = parseInt(dragonId, 0);
      } else {
        conditions['data.dragonId'] = { $in: dragons };
      }
    } else {
      conditions['data.owner'] = new RegExp(['^', wallet, '$'].join(''), 'i');
    }
    const promises = await Promise.all([
      History.find(conditions).sort({ _id: -1 }).skip(skip).limit(pageLimit),
      History.countDocuments(conditions)
    ]);
    const data = promises[0];
    const totalItems = promises[1];
    return {
      data,
      currentPage: page,
      totalPage: Math.ceil(totalItems / pageLimit),
      totalItems: totalItems,
    };
  } catch (error) {
    logger.error('DragonService createHistory error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function getDragonByMonster(id, wallet, query) {
  try {
    const {
      rowPerPage,
      level,
      textSearch
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
    const conditions = { owner: new RegExp(['^', wallet, '$'].join(''), 'i'), type: DRAGON_TYPE.DRAGON, sale: null };
    if (parseInt(level, 0) > 1) {
      conditions.level = { $gte: parseInt(level, 0) };
    }
    if (typeof textSearch === 'string' && textSearch) {
      conditions.$or = [
        { idString: { $regex: validSearchString(textSearch) } },
        { name: { $regex: validSearchString(textSearch) } },
        { description: { $regex: validSearchString(textSearch) } }
      ];
    }
    const promises = await Promise.all([
      Dragons.find(conditions).sort({ id: 1 }).skip(skip).limit(pageLimit),
      Dragons.countDocuments(conditions)
    ]);
    const dragons = promises[0];
    const totalItems = promises[1];
    const data = await Promise.all(dragons?.map(async dragon => {
      return {
        id: dragon.id,
        name: dragon.name,
        generation: dragon.generation,
        image: getImageSize(dragon.image),
        class: dragon.class,
        type: dragon.type,
        stats: dragon.stats,
        potential: dragon.potential,
        cooldownIndex: dragon.cooldownIndex,
        isReady: dragon.isReady,
        isGestating: dragon.isGestating,
        xp: dragon.xp,
        level: dragon.type === DRAGON_TYPE.DRAGON ? dragon.level : 1,
        mutant: dragon.mutant,
        timeLock: dragon?.unlockTimestamp ?? 0,
        totalHis: 0,
        win: false
      };
    }));
    return {
      data,
      currentPage: page,
      totalPage: Math.ceil(totalItems / pageLimit),
      totalItems: totalItems,
    };
  } catch (error) {
    logger.error('DragonService createHistory error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function getDragonOwner(wallet) {
  try {
    return await Dragons.distinct('id', { owner: new RegExp(['^', wallet, '$'].join(''), 'i') });
  } catch (error) {
    logger.error('DragonService createHistory error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function syncDataRewardYY() {
  try {
    const histories = await History.find({ type: 'Claim', monster: 'YY' });
    await Promise.all(histories.map( async (history) => {
      await History.updateOne({ _id: history._id }, {
        $set: {
          'data.reward': parseFloat(history.data.reward, 2)
        }
      });
    }));
  } catch (error) {
    logger.error('DragonService createHistory error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
