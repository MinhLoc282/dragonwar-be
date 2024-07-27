import logger from '../../api/logger';
import APIError from '../../util/APIError';
import Report from './report.model';
import Dragons from '../dragon/dragon.model';
import Histories from '../dragon/history.model';
import {
  BATTLE_TYPES,
  DEFAULT_PAGE_LIMIT,
  GIFT_STATUS,
  HISTORY_TYPE, ITEM_LOG_TYPES,
  ROOM_NAMES,
  TICKET_TYPES,
  USER_ROLE
} from '../../constants';
import { getDragonForList } from '../dragon/dragon.service';
import HistoryMonster from '../event/historyMonster.model';
import Users from '../user/user.model';
import Teams from '../team/team.model';
import BattleHistories from '../battleHistory/battleHistory.model';
import RoomCaches from "../battleHistory/roomCache.model";
import Tickets from "../ticket/ticket.model";
import ItemLog from '../item/itemLog.model';
import { conditionTimeInDay } from '../../helpers';

export async function getReports(query = '') {
  try {
    const sortCondition = {};
    if (query.type) {
      sortCondition[query.type] = -1;
      sortCondition.id = 1;
    } else {
      sortCondition.id = 1;
    }
    const limit = Number(query.rows || DEFAULT_PAGE_LIMIT).valueOf();
    return await Dragons.find({
    }, 'id level generation potential totalStats xp cooldownIndex').sort(sortCondition).limit(limit);
  } catch (error) {
    logger.error('DragonService createAuction error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function getReportChart() {
  try {
    return await Report.find({}, 'dragons breeding adventure boots dragonsSale kaiSale dragonsSire kaiSire date');
  } catch (error) {
    logger.error('DragonService createAuction error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function getReportMarketplaceListed(query) {
  try {
    const sort = { _id: -1 };
    if (query.sort) {
      sort[query.sort] = -1;
      delete sort._id;
    }
    const data = await Histories.find({
      type: query.type
    }).sort(sort).skip(0).limit(20);
    return await Promise.all(data?.map(async (history) => {
      const dragon = await getDragonForList(history.id);
      dragon.createdAt = history.createdAt;
      return dragon;
    }));
  } catch (error) {
    logger.error('DragonService createAuction error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function getReportMarketplaceItems(options) {
  try {
    const conditions = {};
    if (options.itemType) {
      conditions.itemType = options.itemType;
    }
    if (options.type) {
      conditions.type = options.type;
    }
    const data = await ItemLog
      .find(conditions)
      .sort({ _id: -1 })
      .limit(20)
      .populate({
        path: 'item',
        populate: {
          path: 'skill'
        }
      })
      .populate({
        path: 'item',
        populate: {
          path: 'equipment'
        }
      });
    return data.map(item => item.toJSON());
  } catch (error) {
    logger.error('ReportService getReportMarketplaceItemsListed error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function getReportMarketplaceSold(query) {
  try {
    const sort = { _id: -1 };
    if (query.sort) {
      sort[query.sort] = -1;
      delete sort._id;
    }
    const data = await Histories.find({
      type: query.type
    }).sort(sort).skip(0).limit(20);
    return await Promise.all(data?.map(async (history) => {
      const dragon = await getDragonForList(history.id);
      dragon.price = history.price;
      dragon.from = query.type === HISTORY_TYPE.SUCCESSAUCTION ? history.from : history.to;
      dragon.createdAt = history.createdAt;
      return dragon;
    }));
  } catch (error) {
    logger.error('DragonService createAuction error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function getReportEvent() {
  try {
    const promises = [
      HistoryMonster.aggregate([
        {
          $match: {
            monster: 'XX',
            type: { $ne: 'Claim' }
          }
        },
        {
          $group: {
            _id: {
              monster: '$monster', dragonId: '$data.dragonId'
            },
            count: {
              $sum: 1
            }
          }
        },
        {
          $sort: { count: -1 }
        },
        { $limit: 40 }
      ]),
      HistoryMonster.aggregate([
        {
          $match: {
            monster: 'XX',
            type: 'Win'
          }
        },
        {
          $group: {
            _id: {
              monster: '$monster', dragonId: '$data.dragonId'
            },
            count: {
              $sum: 1
            }
          }
        }, {
          $sort: { count: -1 }
        },
        { $limit: 40 }
      ]),
      HistoryMonster.aggregate([
        {
          $match: {
            monster: 'YY',
            type: { $ne: 'Claim' }
          }
        },
        {
          $group: {
            _id: {
              monster: '$monster', dragonId: '$data.dragonId'
            },
            count: {
              $sum: 1
            }
          }
        }, {
          $sort: { count: -1 }
        },
        { $limit: 40 }
      ]),
      HistoryMonster.aggregate([
        {
          $match: {
            monster: 'YY',
            type: 'Kill'
          }
        },
        {
          $group: {
            _id: {
              monster: '$monster', dragonId: '$data.dragonId'
            },
            count: {
              $sum: 1
            }
          }
        }, {
          $sort: { count: -1 }
        },
        { $limit: 40 }
      ]),
      HistoryMonster.aggregate([
        {
          $match: {
            type: 'Claim',
            monster: 'XX',
          }
        },
        {
          $group: {
            _id: {
              owner: '$data.owner'
            },
            count: {
              $sum: '$data.reward'
            }
          }
        }, {
          $sort: { count: -1 }
        },
        { $limit: 40 }
      ]),
      HistoryMonster.aggregate([
        {
          $match: {
            type: 'Claim',
            monster: 'YY',
          }
        },
        {
          $group: {
            _id: {
              owner: '$data.owner'
            },
            count: {
              $sum: '$data.reward'
            }
          }
        }, {
          $sort: { count: -1 }
        },
        { $limit: 40 }
      ]),
    ];
    const promise = await Promise.all(promises);
    return {
      xx: promise[0],
      xxWin: promise[1],
      yy: promise[2],
      yyKill: promise[3],
      claimXX: promise[4],
      claimYY: promise[5],
    };
  } catch (error) {
    logger.error('DragonService createAuction error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function syncData() {
  try {
    const data = await Histories.find({
      type: { $in: [HISTORY_TYPE.SUCCESSSIRING, HISTORY_TYPE.SUCCESSAUCTION] }
    });
    await Promise.all(data?.map(async (history) => {
      await Histories.updateOne({
        _id: history._id
      }, {
        $set: {
          price: parseFloat(history.price, 2)
        }
      });
    }));
    const results = await Promise.all([
      Histories.countDocuments({
        type: HISTORY_TYPE.SUCCESSAUCTION
      }),
      Histories.countDocuments({
        type: HISTORY_TYPE.SUCCESSSIRING
      }),
      Histories.aggregate([
        {
          $match: {
            type: HISTORY_TYPE.SUCCESSAUCTION,
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$price'
            }
          }
        }
      ]),
      Histories.aggregate([
        {
          $match: {
            type: HISTORY_TYPE.SUCCESSSIRING
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$price'
            }
          }
        }
      ]),
    ]);
    await Report.updateOne({
      date: new Date(new Date().setHours(0, 0, 0, 0))
    }, {
      $set: {
        dragonsSale: results[0],
        dragonsSire: results[1],
        kaiSale: results[2]?.[0]?.total ?? 0,
        kaiSire: results[3]?.[0]?.total ?? 0,
      }
    });
    return true;
  } catch (error) {
    logger.error('DragonService createAuction error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function getReportMarketplace() {
  try {
    const now = new Date().getTime();
    const day = now - (24 * 60 * 60 * 1000);
    const week = now - (7 * 24 * 60 * 60 * 1000);
    const month = now - (30 * 24 * 60 * 60 * 1000);
    const results = await Promise.all([
      Histories.countDocuments({
        type: HISTORY_TYPE.SUCCESSAUCTION,
        createdAt: { $gte: new Date(day), $lte: new Date(now) },
      }),
      Histories.countDocuments({
        type: HISTORY_TYPE.SUCCESSSIRING,
        createdAt: { $gte: new Date(day), $lte: new Date(now) },
      }),
      Histories.countDocuments({
        type: HISTORY_TYPE.SUCCESSAUCTION,
        createdAt: { $gte: new Date(week), $lte: new Date(now) },
      }),
      Histories.countDocuments({
        type: HISTORY_TYPE.SUCCESSSIRING,
        createdAt: { $gte: new Date(week), $lte: new Date(now) },
      }),
      Histories.countDocuments({
        type: HISTORY_TYPE.SUCCESSAUCTION,
        createdAt: { $gte: new Date(month), $lte: new Date(now) },
      }),
      Histories.countDocuments({
        type: HISTORY_TYPE.SUCCESSSIRING,
        createdAt: { $gte: new Date(month), $lte: new Date(now) },
      }),
      Histories.aggregate([
        {
          $match: {
            type: HISTORY_TYPE.SUCCESSAUCTION,
            createdAt: { $gte: new Date(day), $lte: new Date(now) },
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$price'
            }
          }
        }
      ]),
      Histories.aggregate([
        {
          $match: {
            type: HISTORY_TYPE.SUCCESSSIRING,
            createdAt: { $gte: new Date(day), $lte: new Date(now) },
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$price'
            }
          }
        }
      ]),
      Histories.aggregate([
        {
          $match: {
            type: HISTORY_TYPE.SUCCESSAUCTION,
            createdAt: { $gte: new Date(week), $lte: new Date(now) },
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$price'
            }
          }
        }
      ]),
      Histories.aggregate([
        {
          $match: {
            type: HISTORY_TYPE.SUCCESSSIRING,
            createdAt: { $gte: new Date(week), $lte: new Date(now) },
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$price'
            }
          }
        }
      ]),
      Histories.aggregate([
        {
          $match: {
            type: HISTORY_TYPE.SUCCESSAUCTION,
            createdAt: { $gte: new Date(month), $lte: new Date(now) },
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$price'
            }
          }
        }
      ]),
      Histories.aggregate([
        {
          $match: {
            type: HISTORY_TYPE.SUCCESSSIRING,
            createdAt: { $gte: new Date(month), $lte: new Date(now) },
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$price'
            }
          }
        }
      ])
    ]);
    return {
      day: {
        sale: results[0],
        sire: results[1],
        totalSale: results[6]?.[0]?.total ?? 0,
        totalSire: results[7]?.[0]?.total ?? 0,
      },
      week: {
        sale: results[2],
        sire: results[3],
        totalSale: results[8]?.[0]?.total ?? 0,
        totalSire: results[9]?.[0]?.total ?? 0,
      },
      month: {
        sale: results[4],
        sire: results[5],
        totalSale: results[10]?.[0]?.total ?? 0,
        totalSire: results[11]?.[0]?.total ?? 0,
      }
    };
  } catch (error) {
    logger.error('DragonService createAuction error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function getCountMarketplaceItems() {
  try {
    const now = new Date().getTime();
    const day = now - (24 * 60 * 60 * 1000);
    const week = now - (7 * 24 * 60 * 60 * 1000);
    const month = now - (30 * 24 * 60 * 60 * 1000);
    const results = await Promise.all([
      ItemLog.countDocuments({
        type: ITEM_LOG_TYPES.SOLD,
        createdAt: { $gte: new Date(day), $lte: new Date(now) },
      }),
      ItemLog.countDocuments({
        type: ITEM_LOG_TYPES.SOLD,
        createdAt: { $gte: new Date(week), $lte: new Date(now) },
      }),
      ItemLog.countDocuments({
        type: ITEM_LOG_TYPES.SOLD,
        createdAt: { $gte: new Date(month), $lte: new Date(now) },
      }),
      ItemLog.aggregate([
        {
          $match: {
            type: ITEM_LOG_TYPES.SOLD,
            createdAt: { $gte: new Date(day), $lte: new Date(now) },
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$price'
            }
          }
        }
      ]),
      ItemLog.aggregate([
        {
          $match: {
            type: ITEM_LOG_TYPES.SOLD,
            createdAt: { $gte: new Date(week), $lte: new Date(now) },
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$price'
            }
          }
        }
      ]),
      ItemLog.aggregate([
        {
          $match: {
            type: ITEM_LOG_TYPES.SOLD,
            createdAt: { $gte: new Date(month), $lte: new Date(now) },
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$price'
            }
          }
        }
      ])
    ]);
    return {
      day: {
        sale: results[0],
        totalSale: results[3]?.[0]?.total ?? 0,
      },
      week: {
        sale: results[1],
        totalSale: results[4]?.[0]?.total ?? 0,
      },
      month: {
        sale: results[2],
        totalSale: results[5]?.[0]?.total ?? 0,
      }
    };
  } catch (error) {
    logger.error('DragonService createAuction error:', error);
    throw new APIError(500, 'Internal server error');
  }
}


export async function adminGetDashboard() {
  try {
    const promise = [
      Users.countDocuments({ role: USER_ROLE.USER }),
      Teams.countDocuments({}),
      BattleHistories.countDocuments({ type: BATTLE_TYPES.ADVENTURE }),
      BattleHistories.countDocuments({ type: BATTLE_TYPES.ARENA }),
      RoomCaches.countDocuments({ name: ROOM_NAMES.ADVENTURE }),
      RoomCaches.countDocuments({ name: ROOM_NAMES.ARENA }),
    ];
    const data = await Promise.all(promise);
    return {
      users: data[0],
      teams: data[1],
      adventure: data[2],
      arena: data[3],
      livingAdventure: data[4],
      livingArena: data[5]
    };
  } catch (error) {
    logger.error('DragonService adminGetDashboard error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function getReportBattles() {
  try {
    const promise = [
      BattleHistories.countDocuments({
        type: BATTLE_TYPES.ADVENTURE,
      }),
      BattleHistories.countDocuments({
        type: BATTLE_TYPES.ARENA,
      }),
      Tickets.aggregate([
        {
          $match: {
            type: TICKET_TYPES.PVE_TICKET,
          }
        },
        {
          $group: { _id: null, total: { $sum: '$priceNumber' } }
        }
      ])
    ];
    const data = await Promise.all(promise);
    return {
      totalAdventure: data[0],
      totalArena: data[1],
      revenueAdventure: Math.floor(data[2][0]?.total / 10) * 10
    };
  } catch (error) {
    logger.error('ReportService getReportBattles error:', error);
    throw new APIError(500, 'Internal server error');
  }

}

export async function syncReportDuplicateDocs(options) {
  try {
    if (!options.limit) {
      return;
    }
    const reports = await Report.find({}).sort({ _id: -1 }).limit(Number(options.limit)).lean();
    const init = reports[reports.length - 1];
    let total = {
      dragons: init.dragons,
      breeding: init.breeding,
      adventure: init.adventure,
      boots: init.boots,
      dragonsSale: init.dragonsSale,
      kaiSale: init.kaiSale,
      dragonsSire: init.dragonsSire,
      kaiSire: init.kaiSire,
      totalItems: init.totalItems,
      burnedItems: init.burnedItems,
      itemsSale: init.itemsSale,
      kaiSaleItems: init.kaiSaleItems,
      feeSaleItems: init.feeSaleItems,
    };
    let i = reports.length - 2;
    while (i >= 0) {
      const currentData = reports[i];
      const data = {
        dragons: total.dragons + currentData.dragons,
        breeding: total.breeding + currentData.breeding,
        adventure: total.adventure + currentData.adventure,
        boots: total.boots + currentData.boots,
        dragonsSale: total.dragonsSale + currentData.dragonsSale,
        kaiSale: total.kaiSale + currentData.kaiSale,
        dragonsSire: total.dragonsSire + currentData.dragonsSire,
        kaiSire: total.kaiSire + currentData.kaiSire,
        totalItems: {
          equipment: total.totalItems.equipment + currentData.totalItems.equipment,
          skill_card: total.totalItems.skill_card + currentData.totalItems.skill_card,
          exp_card: total.totalItems.exp_card + currentData.totalItems.exp_card,
        },
        burnedItems: {
          equipment: total.burnedItems.equipment + currentData.burnedItems.equipment,
          skill_card: total.burnedItems.skill_card + currentData.burnedItems.skill_card,
          exp_card: total.burnedItems.exp_card + currentData.burnedItems.exp_card,
        },
        itemsSale: {
          equipment: total.itemsSale.equipment + currentData.itemsSale.equipment,
          skill_card: total.itemsSale.skill_card + currentData.itemsSale.skill_card,
          exp_card: total.itemsSale.exp_card + currentData.itemsSale.exp_card,
        },
        kaiSaleItems: {
          equipment: total.kaiSaleItems.equipment + currentData.kaiSaleItems.equipment,
          skill_card: total.kaiSaleItems.skill_card + currentData.kaiSaleItems.skill_card,
          exp_card: total.kaiSaleItems.exp_card + currentData.kaiSaleItems.exp_card,
        },
        feeSaleItems: {
          equipment: total.feeSaleItems.equipment + currentData.feeSaleItems.equipment,
          skill_card: total.feeSaleItems.skill_card + currentData.feeSaleItems.skill_card,
          exp_card: total.feeSaleItems.exp_card + currentData.feeSaleItems.exp_card,
        },
      };
      reports[i] = {
        ...reports[i],
        ...data
      };
      await Report.updateOne({ _id: reports[i]._id } , { $set: data} );
      i -= 1;
    }
    return reports;
  } catch (error) {
    logger.error('ReportService syncReportDuplicateDocs error:', error);
    throw new APIError(500, 'Internal server error');
  }
}


/**
 * @param {string} options.type
 * @param {number} options.page
 * @param {number} options.limit
 * @returns {Promise<void>}
 */
export async function adminGetBattleReport(options) {
  try {
    const currentDate = Date.now();
    const date = currentDate - options.skip * 24 * 60 * 60 * 1000;
    const promise = [];
    let i = 0;
    while (i < options.limit) {
      const condition = {
        createdAt: conditionTimeInDay(date - i * 24 * 60 * 60 * 1000)
      };
      promise.push(
        Promise.all([
          BattleHistories.countDocuments({
            ...condition,
            type: BATTLE_TYPES.ADVENTURE
          }),
          BattleHistories.countDocuments({
            ...condition,
            type: BATTLE_TYPES.ARENA
          }),
        ])
      );
      i += 1;
    }
    const data = await Promise.all(promise);
    const lastBattle = await BattleHistories.find({}).sort({ _id: 1 }).limit(1);
    const totalDate = Math.ceil((currentDate - new Date(lastBattle?.[0]?.createdAt || currentDate).getTime()) / (24 * 60 * 60 * 1000));
    return {
      data: data.map((item, index) => ({
        pve: item[0],
        pvp: item[1],
        date: conditionTimeInDay(date - index * 24 * 60 * 60 * 1000).$gte
      })),
      totalItems: totalDate,
      currentPage: options.page,
      totalPages: Math.ceil(totalDate / options.limit)
    };
  } catch (error) {
    logger.error('ReportService adminGetBattleReport error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
