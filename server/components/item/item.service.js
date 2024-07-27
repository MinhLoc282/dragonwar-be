import logger from '../../api/logger';
import APIError from '../../util/APIError';
import {
  DEAD_ADDRESS,
  GIFT_TYPES, HISTORY_TYPE,
  ITEM_LOG_STATUS,
  ITEM_LOG_TYPES,
  ITEM_STATUS,
  ITEM_TYPES, ITEMS_ORDER_FIELDS, NFT_POSITIONS, NFT_POSITIONS_REVERSE, ORDER_BY, PART_REPLACE_QUERY_ITEMS,
  ROOT_PATH, SKILL_RARITY,
  WORKER_NAME
} from '../../constants';
import Item from './item.model';
import { generateValueByRatio, randomIntFromInterval } from '../../helpers';
import AMPQ from '../../../rabbitmq/ampq';
import Users from '../user/user.model';
import Notification from '../dragon/notification.model';
import Web3 from 'web3';
import ItemLog from './itemLog.model';
import {
  EQUIPMENT_ADDRESS,
  EXPERIENCE_ADDRESS,
  KAI_CONTRACT_TRAINING,
  MARKETPLACE_NFT_ADDRESS,
  SKILLS_ADDRESS,
  WEARABLE_EQUIPMENT_ADDRESS,
  WEARABLE_SKILL_ADDRESS
} from '../../config';
import Equipment from './equipment.model';
import { web3 } from '../../web3/kai';
import {
  getEquipmentById,
  getExperienceById,
  getItemInDragon,
  getItemOnMarketplace
} from '../../web3/kai/readContract/kai';
import { validSearchString } from '../../helpers/string.helper';
import Skill from '../dragon/skill.model';
import Effect from '../dragon/effect.model';
import NotificationOwner from '../dragon/notificationOwner.model';
import { Promise } from 'mongoose';
import Report from '../report/report.model';
import Gift from '../gift/gift.model';
import Dragons from '../dragon/dragon.model';

const XLSX = require('xlsx');

export const EXPERIENCE_TYPES = {
  A: 50,
  B: 150,
  C: 250,
  D: 350
};

export const ITEM_TYPE_VIA_CONTRACT = {
  [EXPERIENCE_ADDRESS]: ITEM_TYPES.EXP_CARD,
  [EQUIPMENT_ADDRESS]: ITEM_TYPES.EQUIPMENT,
  [SKILLS_ADDRESS]: ITEM_TYPES.SKILL_CARD
};

export const ITEM_CONTRACT_VIA_TYPE = {
  [ITEM_TYPES.EQUIPMENT]: EQUIPMENT_ADDRESS,
  [ITEM_TYPES.SKILL_CARD]: SKILLS_ADDRESS
};

export const WEARABLE_CONTRACT_VIA_TYPE = {
  [ITEM_TYPES.EQUIPMENT]: WEARABLE_EQUIPMENT_ADDRESS,
  [ITEM_TYPES.SKILL_CARD]: WEARABLE_SKILL_ADDRESS
};

export const RATIO_OPEN_SILVER_GIFT = [
  // {
  //   value: ITEM_TYPES.EXP_CARD,
  //   ratio: 70
  // },
  {
    value: ITEM_TYPES.SKILL_CARD,
    ratio: 50
  },
  {
    value: ITEM_TYPES.EQUIPMENT,
    ratio: 50
  }
];

export const RATIO_OPEN_GOLD_GIFT = [
  // {
  //   value: ITEM_TYPES.EXP_CARD,
  //   ratio: 30
  // },
  {
    value: ITEM_TYPES.SKILL_CARD,
    ratio: 50
  },
  {
    value: ITEM_TYPES.EQUIPMENT,
    ratio: 50
  }
];

/**
 * @param options
 * @param {string} options.status
 * @param {string} options.owner
 * @param {string} options.textSearch
 * @param {string} options.type
 * @param {string} options.dragon
 * @param {string} options.nftType
 * @param {number} options.exceptId
 * @param {string} options.part
 * @param {string} options.notUse
 * @param {number} options.page
 * @param {number} options.limit
 * @param {number} options.skip
 * @param {string} options.order
 * @param {string} options.orderBy
 * @returns {Promise<{totalItems: (number|Array<EnforceDocument<unknown, {}>>), data: *[], totalPages: number, currentPage}>}
 */
export async function getItems(options) {
  try {
    const conditions = {
      status: [ITEM_STATUS.ACTIVE, ITEM_STATUS.SELLING, ITEM_STATUS.USED]
    };
    const sort = {};
    if (typeof options.textSearch === 'string' && options.textSearch) {
      conditions.$or = [
        {
          nftIdString: { $regex: validSearchString(options.textSearch) }
        }
      ];
    }
    if (options.exceptId) {
      conditions.nftId = { $ne: options.exceptId };
    }
    if (options.type) {
      conditions.type = options.type;
      const conditionItemType = {};
      if (options.nftType) {
        conditionItemType.id = options.nftType;
      }
      if (options.part) {
        conditionItemType.part = options.part.split(',')?.map(item => options.type === ITEM_TYPES.SKILL_CARD ? PART_REPLACE_QUERY_ITEMS[item] : item);
      }
      if (options.rarity) {
        conditionItemType.rarity = options.rarity.split(',');
      }
      if (Object.keys(conditionItemType)?.length) {
        switch (options.type) {
          case ITEM_TYPES.EQUIPMENT:
            const equipmentIds = await Equipment.findOne(conditionItemType).distinct('_id');
            conditions.equipment = equipmentIds;
            break;
          case ITEM_TYPES.SKILL_CARD:
            const skillIds = await Skill.findOne(conditionItemType).distinct('_id');
            conditions.skill = skillIds;
            break;
          default:
            break;
        }
      }
      if (typeof options.textSearch === 'string' && options.textSearch) {
        const conditionsSearch = {
          name: { $regex: validSearchString(options.textSearch) }
        };
        switch (options.type) {
          case ITEM_TYPES.EQUIPMENT:
            const equipmentIds = await Equipment.findOne(conditionsSearch).distinct('_id');
            conditions.$or.push({
              equipment: equipmentIds
            });
            break;
          case ITEM_TYPES.SKILL_CARD:
            const skillIds = await Skill.findOne(conditionsSearch).distinct('_id');
            conditions.$or.push({
              skill: skillIds
            });
            break;
          default:
            break;
        }
      }
    }
    if (options.owner) {
      conditions.owner = options.owner;
    }
    if (options.status) {
      conditions.status = options.status;
      if (options.status === 'NOTUSE') {
        conditions.status = [ITEM_STATUS.ACTIVE, ITEM_STATUS.SELLING];
      }
    }
    if (options.dragon) {
      conditions.dragon = options.dragon;
    }
    if (options.exp) {
      conditions.exp = options.exp.split(',').map(item => Number(item));
    }
    if (options.price) {
      const price = options.price.split(',');
      if (price?.length === 2) {
        conditions.price = {
          $gte: price[0]
        };
        if (Number(price[1]) !== 100000) { // max query
          conditions.price.$lte = price[1];
        }
      }
    }
    if (options.level) {
      const level = options.level.split(',');
      if (level?.length === 2) {
        conditions.level = {
          $gte: level[0],
          $lte: level[1]
        };
      }
    }
    const orderByValue = ORDER_BY[options.orderBy] || ORDER_BY.asc;
    if (options.order && ITEMS_ORDER_FIELDS[options.order]) {
      sort[ITEMS_ORDER_FIELDS[options.order]] = orderByValue;
    } else {
      sort.nftId = 1;
    }
    const promise = [
      Item.countDocuments(conditions),
      Item
        .find(conditions)
        .sort({ type: -1, ...sort })
        .skip(options.skip)
        .limit(options.limit)
        .populate('skill')
        .populate('equipment')
    ];
    const data = await Promise.all(promise);
    let items = data[1].map(item => item.toJSON());
    items = await Promise.all(items.map(async (item) => {
      if (item.type === ITEM_TYPES.SKILL_CARD) {
        const effect = await Effect.findById(item.skill.effect).lean();
        delete effect.level;
        item.skill.effect = effect;
      }
      return item;
    }));
    return {
      data: items,
      totalItems: data[0],
      currentPage: options.page,
      totalPages: Math.ceil(data[0] / options.limit)
    };
  } catch (error) {
    logger.error('ItemService getItems error:', error);
    throw new APIError(500, 'Internal server error');
  }
}


export async function getItem(type, id) {
  try {
    const item = await Item.findOne({
      type,
      nftId: id
    }).populate('equipment').populate('skill');
    if (!item) {
      return Promise.reject(new APIError(403, [{
        msg: 'Item not found',
        param: 'ITEM_NOT_FOUND'
      }]));
    }
    const data = item.toJSON();
    if (item.type === ITEM_TYPES.SKILL_CARD) {
      const effect = await Effect.findById(data?.skill?.effect).lean();
      delete effect.level;
      if (effect) {
        data.skill.effect = effect;
      }
    }
    if (item.status === ITEM_STATUS.USED && item.dragon) {
      const dragon = await Dragons.findOne({ id: item.dragon }).lean();
      if (dragon) {
        data.dragonSaleStatus = dragon.sale;
      }
    }
    return data;
  } catch (error) {
    logger.error('ItemService getItem error:', error);
    throw new APIError(500, 'Internal server error');
  }
}


export async function mintExperienceNFTViaGift(ratio, recipient, gift) {
  try {
    const exp = generateValueByRatio(ratio);
    const dataCreate = {
      type: ITEM_TYPES.EXP_CARD,
      exp,
      owner: recipient.address,
      status: ITEM_STATUS.PENDING
    };
    const item = await Item.create(dataCreate);
    const log = await ItemLog.create({
      gift: gift._id,
      type: ITEM_LOG_TYPES.TRANSFER,
      status: ITEM_LOG_STATUS.PENDING,
      item: item._id,
      itemType: item.type
    });
    const data = {
      recipient: recipient.address,
      exp,
      itemLog: log._id,
      item: item._id,
      itemUid: item.uid,
      type: ITEM_TYPES.EXP_CARD
    };
    AMPQ.sendDataToQueue(WORKER_NAME.MINT_NFT, data);
    return item;
  } catch (error) {
    logger.error('ItemService mintExperienceNFT error:', error);
  }
}

export async function mintEquipmentViaGift(recipient, equipment, gift) {
  try {
    const dataCreate = {
      type: ITEM_TYPES.EQUIPMENT,
      equipment: equipment._id,
      owner: recipient.address,
      status: ITEM_STATUS.PENDING
    };
    const item = await Item.create(dataCreate);
    const log = await ItemLog.create({
      gift: gift._id,
      type: ITEM_LOG_TYPES.TRANSFER,
      status: ITEM_LOG_STATUS.PENDING,
      item: item._id,
      itemType: item.type
    });
    const data = {
      recipient: recipient.address,
      equipment,
      itemLog: log._id,
      item: item._id,
      itemUid: item.uid,
      type: ITEM_TYPES.EQUIPMENT
    };
    AMPQ.sendDataToQueue(WORKER_NAME.MINT_NFT, data);
    return item;
  } catch (error) {
    console.log('Error in mintEquipmentViaGift', error);
  }
}

export async function mintSkillViaGift(recipient, skill, gift) {
  try {
    const dataCreate = {
      type: ITEM_TYPES.SKILL_CARD,
      skill: skill._id,
      owner: recipient.address,
      status: ITEM_STATUS.PENDING
    };
    const item = await Item.create(dataCreate);
    const log = await ItemLog.create({
      gift: gift._id,
      type: ITEM_LOG_TYPES.TRANSFER,
      status: ITEM_LOG_STATUS.PENDING,
      item: item._id,
      itemType: item.type
    });
    const data = {
      recipient: recipient.address,
      skill,
      itemLog: log._id,
      item: item._id,
      itemUid: item.uid,
      type: ITEM_TYPES.SKILL_CARD
    };
    AMPQ.sendDataToQueue(WORKER_NAME.MINT_NFT, data);
    return item;
  } catch (error) {
    console.log('Error in mintEquipmentViaGift', error);
  }
}

export async function mintNFTViaSilverGift(owner, gift) {
  try {
    const type = generateValueByRatio(RATIO_OPEN_SILVER_GIFT);
    let item;
    switch (type) {
      case ITEM_TYPES.EXP_CARD:
        // eslint-disable-next-line no-case-declarations
        const ratio = [
          {
            value: EXPERIENCE_TYPES.A,
            ratio: 80
          },
          {
            value: EXPERIENCE_TYPES.B,
            ratio: 20
          }
        ];
        item = await mintExperienceNFTViaGift(ratio, owner, gift);
        break;
      case ITEM_TYPES.EQUIPMENT:
        // eslint-disable-next-line no-case-declarations
        const equipments = await Equipment.find({ type: 1, rarity: 'A' }).lean();
        if (!equipments?.length) {
          break;
        }
        const equipmentIndex = randomIntFromInterval(0, equipments.length - 1);
        item = await mintEquipmentViaGift(owner, equipments[equipmentIndex], gift);
        break;
      case ITEM_TYPES.SKILL_CARD:
        const skills = await Skill.find({ id: { $gte: 99 }, rarity: SKILL_RARITY.COMMON }).lean();
        if (!skills?.length) {
          break;
        }
        const indexSkill = randomIntFromInterval(0, skills?.length - 1);
        item = await mintSkillViaGift(owner, skills[indexSkill], gift);
        break;
      default:
        break;
    }
    return item;
  } catch (error) {
    console.log('Error in mintNFTViaSilverGift', error);
  }
}

export async function mintNFTViaGoldGift(owner, gift) {
  try {
    const type = generateValueByRatio(RATIO_OPEN_GOLD_GIFT);
    let item;
    switch (type) {
      case ITEM_TYPES.EXP_CARD:
        // eslint-disable-next-line no-case-declarations
        const ratio = [
          {
            value: EXPERIENCE_TYPES.B,
            ratio: 80
          },
          {
            value: EXPERIENCE_TYPES.C,
            ratio: 15
          },
          {
            value: EXPERIENCE_TYPES.D,
            ratio: 5
          }
        ];
        item = await mintExperienceNFTViaGift(ratio, owner, gift);
        break;
      case ITEM_TYPES.EQUIPMENT:
        const ratioRarity = [
          {
            value: 'A',
            ratio: 70
          },
          {
            value: 'B',
            ratio: 30
          }
        ];
        const ratioType = [
          {
            value: 1,
            ratio: 70
          },
          {
            value: 2,
            ratio: 30
          }
        ];
        const rarity = generateValueByRatio(ratioRarity);
        const typeEquipment = generateValueByRatio(ratioType);
        const equipments = await Equipment.find({ type: typeEquipment, rarity }).lean();
        if (!equipments?.length) {
          break;
        }
        const equipmentIndex = randomIntFromInterval(0, equipments.length - 1);
        item = await mintEquipmentViaGift(owner, equipments[equipmentIndex], gift);
        break;
      case ITEM_TYPES.SKILL_CARD:
        const ratioRaritySkill = [
          {
            value: SKILL_RARITY.UNCOMMON,
            ratio: 70
          },
          {
            value: SKILL_RARITY.RARITY,
            ratio: 30
          }
        ];
        const raritySkill = generateValueByRatio(ratioRaritySkill);
        const skills = await Skill.find({ id: { $gte: 99 }, rarity: raritySkill }).lean();
        const indexSkill = randomIntFromInterval(0, skills?.length - 1);
        item = await mintSkillViaGift(owner, skills[indexSkill], gift);
        break;
      default:
        break;
    }
    return item;
  } catch (error) {
    console.log('Error in mintNFTViaSilverGift', error);
  }
}

export async function mintNFTViaDailyQuestGift(owner, gift) {
  try {
    const ratioRarity = [
      {
        value: SKILL_RARITY.COMMON,
        ratio: 70
      },
      {
        value: SKILL_RARITY.UNCOMMON,
        ratio: 20
      },
      {
        value: SKILL_RARITY.RARITY,
        ratio: 10
      }
    ];
    const raritySkill = generateValueByRatio(ratioRarity);
    const skills = await Skill.find({ id: { $gte: 99 }, rarity: raritySkill }).lean();
    if (!skills?.length) {
      return null;
    }
    const indexSkill = randomIntFromInterval(0, skills?.length - 1);
    const item = await mintSkillViaGift(owner, skills[indexSkill], gift);
    return item;
  } catch (error) {
    console.log('Error in mintNFTViaDailyQuestGift', error);
  }
}

export async function mintNFTViaGift(owner, gift) {
  try {
    let item = null;
    let ratioExp = null;
    switch (gift.type) {
      case GIFT_TYPES.PVE_SILVER:
        item = await mintNFTViaSilverGift(owner, gift);
        break;
      case GIFT_TYPES.PVE_GOLD:
        item = await mintNFTViaGoldGift(owner, gift);
        break;
      case GIFT_TYPES.DAILY_QUEST:
        item = await mintNFTViaDailyQuestGift(owner, gift);
        break;
      case GIFT_TYPES.EXP_WHITE:
      case GIFT_TYPES.EXP_BLUE:
      case GIFT_TYPES.EXP_VIOLET:
        ratioExp = {
          [GIFT_TYPES.EXP_WHITE]: [
            {
              value: 100,
              ratio: 70
            },
            {
              value: 150,
              ratio: 30
            }
          ],
          [GIFT_TYPES.EXP_BLUE]: [
            {
              value: 150,
              ratio: 70
            },
            {
              value: 200,
              ratio: 30
            }
          ],
          [GIFT_TYPES.EXP_VIOLET]: [
            {
              value: 200,
              ratio: 70
            },
            {
              value: 250,
              ratio: 30
            }
          ]
        };
        item = await mintExperienceNFTViaGift(ratioExp[gift.type], owner, gift);
        break;
      default:
        break;
    }
    return item;
  } catch (error) {
    logger.error('ItemService mintNFT error:', error);
  }
}


export async function createItemExperience(data) {
  try {
    if (!data?.owner) return;
    const owner = await Users.findOne({ address: Web3.utils.toChecksumAddress(data.owner) });
    if (!owner) return;
    const dataCreate = {
      nftId: data._id,
      nftIdString: data._id,
      type: ITEM_TYPES.EXP_CARD,
      exp: data.exp,
      owner: owner.address,
    };
    const item = await Item.create(dataCreate);
    return item;
  } catch (error) {
    logger.error('ItemService createItemExperience error:', error);
  }
}

export async function updateItemNFT(itemId, data) {
  try {
    return await Item.updateOne(
      {
        _id: itemId
      }, {
        $set: {
          nftId: data._id,
          nftIdString: data._id,
          status: ITEM_STATUS.ACTIVE
        }
      }
    );
  } catch (error) {
    logger.error('ItemService updateItemNFT error:', error);
  }
}

export async function transferNFTItem(data) {
  try {
    if (!data?.to) return;
    const item = await Item.findOne({
      nftId: data.tokenId,
      type: data.type
    });
    if (!item) return;
    const skipAddress = [
      KAI_CONTRACT_TRAINING?.toLowerCase(),
      MARKETPLACE_NFT_ADDRESS?.toLowerCase(),
      DEAD_ADDRESS,
      EQUIPMENT_ADDRESS.toLowerCase(),
      SKILLS_ADDRESS.toLowerCase(),
      WEARABLE_EQUIPMENT_ADDRESS.toLowerCase(),
      WEARABLE_SKILL_ADDRESS.toLowerCase()];
    if (!skipAddress.includes(data.to?.toLowerCase()) && !skipAddress.includes(data.from?.toLowerCase())) {
      const dataLog = {
        type: ITEM_LOG_TYPES.TRANSFER,
        item: item._id,
        from: data.from,
        to: data.to,
        txHash: data.txHash,
        itemType: item.type
      };
      await ItemLog.create(dataLog);
      item.owner = Web3.utils.toChecksumAddress(data.to);
    }
    await item.save();
  } catch (error) {
    logger.error('ItemService transferNFTItem error:', error);
  }
}

/**
 *
 * @param {number} data.itemId
 * @param {number} data.dragonId
 * @param {number} data.itemPosition
 * @param {string} data.type
 * @param {string} data.string
 * @param {string} data.txHash
 * @param {string} data.to
 * @returns {Promise<void>}
 */
export async function useItemToDragon(data) {
  try {
    const item = await Item.findOne({
      nftId: data.itemId,
      type: data.type
    });
    if (!item) return;
    const promise = [
      Item.updateOne(
        {
          _id: item._id,
        },
        {
          $set: {
            dragon: data.dragonId,
            status: ITEM_STATUS.USED
          }
        }
      ),
      ItemLog.create({
        type: ITEM_LOG_TYPES.USED,
        item: item._id,
        from: item.owner,
        to: data.to,
        txHash: data.txHash,
        dragon: data.dragonId,
        itemType: item.type
      })
    ];
    if (item.type === ITEM_TYPES.SKILL_CARD) {
      const skillIds = await Skill.find({
        id: {
          $gte: 99,
        },
        part: NFT_POSITIONS_REVERSE[data.itemPosition]
      }).distinct('_id');
      const itemsBurn = await Item.find({
        dragon: data.dragonId,
        skill: skillIds,
        status: ITEM_STATUS.USED
      });
      if (itemsBurn?.length) {
        itemsBurn.forEach((itemBurn) => {
          itemBurn.status = ITEM_STATUS.BURNED;
          itemBurn.owner = WEARABLE_CONTRACT_VIA_TYPE[data.type];
          itemBurn.dragon = null;
          promise.push(itemBurn.save());
          promise.push(ItemLog.create({
            type: ITEM_LOG_TYPES.BURNED,
            item: itemBurn._id,
            from: item.owner,
            to: WEARABLE_CONTRACT_VIA_TYPE[data.type],
            txHash: data.txHash,
            replaceBy: data.itemId,
            itemType: item.type
          }));
        });
      }
    }
    await Promise.all(promise);
  } catch (error) {
    logger.error('ItemService useItemToDragon error:', error);
  }
}

/**
 * @param {number} data.itemId
 * @param {number} data.dragonId
 * @param {string} data.type
 * @param {string} data.from
 * @param {string} data.txHash
 * @returns {Promise<void>}
 */
export async function unUseItemToDragon(data) {
  try {
    const item = await Item.findOne({
      nftId: data.itemId,
      type: data.type
    });
    if (!item) return;
    if (!item) return;
    item.dragon = null;
    item.status = ITEM_STATUS.ACTIVE;
    await Promise.all([
      item.save(),
      ItemLog.create({
        type: ITEM_LOG_TYPES.UNWEAR,
        item: item._id,
        from: data.from,
        to: item.owner,
        txHash: data.txHash,
        itemType: item.type
      })
    ]);
  } catch (error) {
    logger.error('ItemService unUseItemToDragon error:', error);
  }
}

/**
 *
 * @param {number} data._id
 * @param {number} data.burned
 * @param {string} data.type
 * @param {string} data.upgradeAddress
 * @param {string} data.txHash
 * @param {number} data.level
 * @returns {Promise<void>}
 */
export async function upgradeNFTItem(data) {
  try {
    const items = await Promise.all([
      Item.findOne({
        nftId: data._id,
        type: data.type
      }),
      Item.findOne({
        nftId: data.burned,
        type: data.type
      })
    ]);
    const updatedItem = items[0];
    const burnedItem = items[1];
    if (!updatedItem) return;
    updatedItem.level = data.level;
    const promise = [
      updatedItem.save(),
      ItemLog.create({
        type: ITEM_LOG_TYPES.UPGRADED,
        item: updatedItem._id,
        from: data.upgradeAddress,
        txHash: data.txHash,
        burnedItem: data.burned,
        itemType: data.type
      })
    ];
    if (burnedItem) {
      burnedItem.status = ITEM_STATUS.BURNED;
      burnedItem.owner = ITEM_CONTRACT_VIA_TYPE[data.type];
      promise.push(burnedItem.save());
      promise.push(ItemLog.create({
        type: ITEM_LOG_TYPES.BURNED,
        item: burnedItem._id,
        from: data.upgradeAddress,
        to: ITEM_CONTRACT_VIA_TYPE[data.type],
        txHash: data.txHash,
        itemType: data.type
      }));
    }
    await Promise.all(promise);
  } catch (error) {
    logger.error('ItemService upgradeNFTItem error:', error);
  }
}

export async function upgradeNFTItemFailed(data) {
  try {
    const items = await Promise.all([
      Item.findOne({
        nftId: data._id,
        type: data.type
      }),
      Item.findOne({
        nftId: data.burned,
        type: data.type
      })
    ]);
    const updatedItem = items[0];
    const burnedItem = items[1];
    updatedItem.level = data.level;
    const promise = [
      updatedItem.save(),
      ItemLog.create({
        type: ITEM_LOG_TYPES.UPGRADE_FAILED,
        item: updatedItem._id,
        from: data.upgradeAddress,
        txHash: data.txHash,
        burnedItem: data.burned,
        itemType: data.type
      })
    ];
    if (burnedItem) {
      burnedItem.status = ITEM_STATUS.BURNED;
      burnedItem.owner = ITEM_CONTRACT_VIA_TYPE[data.type];
      promise.push(burnedItem.save());
      promise.push(ItemLog.create({
        type: ITEM_LOG_TYPES.BURNED,
        item: burnedItem._id,
        from: data.upgradeAddress,
        to: ITEM_CONTRACT_VIA_TYPE[data.type],
        txHash: data.txHash,
        itemType: data.type
      }));
    }
    await Promise.all(promise);
  } catch (error) {
    console.log('Error in upgradeNFTItemFailed', error);
  }
}


export async function updateItemLog(id, data) {
  try {
    await ItemLog.updateOne(
      {
        _id: id
      }, {
        $set: data
      }
    );
  } catch (error) {
    console.log('Error in updateItemLog', error);
  }
}

export async function useExperienceNFTToDragon(data) {
  try {
    const item = await Item.findOne({
      nftId: data.itemId,
      type: ITEM_TYPES.EXP_CARD
    });
    if (!item) return;
    item.status = ITEM_STATUS.USED;
    item.owner = '';
    const dataLog = {
      type: ITEM_LOG_TYPES.USED,
      item: item._id,
      from: data.owner,
      dragon: data.dragonId,
      txHash: data.txHash,
      itemType: item.type
    };
    await Promise.all([
      item.save(),
      ItemLog.create(dataLog)
    ]);
    return true;
  } catch (error) {
    console.log('Error in useExperienceNFTToDragon ', error);
  }
}

/**
 * Get item histories
 * @param {string} id
 * @param {string} type
 * @param {number} options.page
 * @param {number} options.limit
 * @param {number} options.skip
 * @returns {Promise<{totalItems: (number|Array<EnforceDocument<unknown, {}>>), data: *[], totalPages: number, currentPage}|{totalItems: number, data: *[], totalPages: number, currentPage}>}
 */
export async function getItemHistories(id, type, options) {
  try {
    const item = await Item.findOne({
      nftId: id,
      type
    });
    if (!item) {
      return {
        data: [],
        totalItems: 0,
        currentPage: options.page,
        totalPages: 1
      };
    }
    const conditions = {
      item: item._id
    };
    const promise = [
      ItemLog.countDocuments(conditions),
      ItemLog
        .find(conditions)
        .sort({ _id: -1 })
        .skip(options.skip)
        .limit(options.limit)
    ];
    const data = await Promise.all(promise);
    return {
      data: data[1].map(item => item.toJSON()),
      totalItems: data[0],
      currentPage: options.page,
      totalPages: Math.ceil(data[0] / options.limit)
    };
  } catch (error) {
    logger.error('ItemService getItemHistories error:', error);
    throw new APIError(500, 'Internal server error');
  }
}


export async function syncEquipments() {
  try {
    const workbook = XLSX.readFile(`${ROOT_PATH}/resource/Itemdragons.xlsx`);
    const sheet_name_list = workbook.SheetNames;
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    const promise = xlData.map(async (data) => {
      const equipment = await Equipment.findOne({ id: data.id });
      if (!equipment) {
        await Equipment.create(data);
      } else {
        await Equipment.updateOne(
          {
            id: data.id
          },
          {
            $set: data
          }
        );
      }
    });
    await Promise.all(promise);
  } catch (error) {
    logger.error('ItemService syncEquipments error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function listNFTMarketplace(data) {
  try {
    const item = await Item.findOne({
      type: ITEM_TYPE_VIA_CONTRACT[data.token],
      nftId: data.tokenId
    });
    if (!item) return;
    item.price = web3.utils.fromWei(data.price, 'ether');
    item.status = ITEM_STATUS.SELLING;
    item.listingId = data.listingId;
    const itemLog = {
      type: ITEM_LOG_TYPES.SELLING,
      item: item._id,
      txHash: data.txHash,
      from: data.seller,
      to: MARKETPLACE_NFT_ADDRESS,
      price: web3.utils.fromWei(data.price, 'ether'),
      listingId: data.listingId,
      itemType: item.type
    };
    await Promise.all([
      item.save(),
      ItemLog.create(itemLog)
    ]);
  } catch (error) {
    console.log('Error in listNFTMarketplace ', error);
  }
}

export async function soldNFTMarketplace(data) {
  try {
    const item = await Item.findOne({
      type: ITEM_TYPE_VIA_CONTRACT[data.token],
      nftId: data.tokenId
    });
    if (!item) return;
    const itemLog = {
      type: ITEM_LOG_TYPES.SOLD,
      item: item._id,
      txHash: data.txHash,
      from: MARKETPLACE_NFT_ADDRESS,
      to: data.buyer,
      price: web3.utils.fromWei(data.price, 'ether'),
      fee: web3.utils.fromWei(data.price, 'ether') - web3.utils.fromWei(data.actualPrice, 'ether'),
      itemType: item.type,
      preOwner: item.owner
    };
    item.status = ITEM_STATUS.ACTIVE;
    item.owner = data.buyer;
    item.price = 0;
    item.listingId = 0;
    await Promise.all([
      item.save(),
      ItemLog.create(itemLog)
    ]);
  } catch (error) {
    console.log('Error in soldNFTMarketplace ', error);
  }
}

export async function cancelNFTMarketplace(data) {
  try {
    const item = await Item.findOne({
      listingId: data.listingId
    });
    if (!item) return;
    item.status = ITEM_STATUS.ACTIVE;
    item.price = 0;
    item.listingId = 0;
    const itemLog = {
      type: ITEM_LOG_TYPES.CANCEL_SELL,
      item: item._id,
      txHash: data.txHash,
      from: data.seller,
      to: MARKETPLACE_NFT_ADDRESS,
      itemType: item.type
    };
    await Promise.all([
      item.save(),
      ItemLog.create(itemLog)
    ]);
  } catch (error) {
    console.log('Error in cancelNFTMarketplace ', error);
  }
}


export async function syncExperienceCard(item) {
  try {
    const data = await getExperienceById(item.nftId);
    if (!data) return;
    if (data.owner.toLowerCase() === KAI_CONTRACT_TRAINING.toLowerCase() && item.status !== ITEM_STATUS.USED) {
      item.owner = '';
      item.price = 0;
      item.listingId = 0;
      item.status = ITEM_STATUS.USED;
      await item.save();
      return;
    }
    if (data.owner.toLowerCase() === MARKETPLACE_NFT_ADDRESS.toLowerCase() && item.status !== ITEM_STATUS.SELLING) {
      // todo: get data in marketplace
      const listingData = await getItemOnMarketplace(EXPERIENCE_ADDRESS, item.nftId);
      if (listingData) {
        item.status = ITEM_STATUS.SELLING;
        item.price = listingData.price;
        item.listingId = listingData.listingId;
        await item.save();
      }
      return;
    }
    if (item.status === ITEM_STATUS.ACTIVE) {
      item.owner = Web3.utils.toChecksumAddress(owner);
    }
    await item.save();
  } catch (error) {
    console.log('Error in syncExperienceCard', error);
  }
}

export async function syncEquipment(item) {
  try {
    const data = await getEquipmentById(item.nftId, EQUIPMENT_ADDRESS);
    const { owner } = data;
    item.level = data.item?.level || item.level;
    if (owner.toLowerCase() === EQUIPMENT_ADDRESS.toLowerCase() && item.status !== ITEM_STATUS.BURNED) {
      item.status = ITEM_STATUS.BURNED;
      item.owner = '';
      await item.save();
      return;
    }
    if (owner.toLowerCase() === MARKETPLACE_NFT_ADDRESS.toLowerCase() && item.status !== ITEM_STATUS.SELLING) {
      // todo: get data in marketplace
      const listingData = await getItemOnMarketplace(EQUIPMENT_ADDRESS, item.nftId);
      if (listingData) {
        item.status = ITEM_STATUS.SELLING;
        item.price = listingData.price;
        item.listingId = listingData.listingId;
        await item.save();
      }
      return;
    }
    if (owner.toLowerCase() === WEARABLE_EQUIPMENT_ADDRESS.toLowerCase()) {
      if (item.status !== ITEM_STATUS.USED) {
        const dragonId = await getItemInDragon(WEARABLE_EQUIPMENT_ADDRESS, item.nftId);
        if (dragonId) {
          item.status = ITEM_STATUS.USED;
          item.dragon = dragonId;
          await item.save();
        }
        return;
      }
      if (item.status === ITEM_STATUS.USED) {
        const dragon = await Dragons.findOne({ id: item.dragon }).lean();
        if (dragon) {
          if (item.owner.toLowerCase() !== dragon.owner.toLowerCase()) {
            item.owner = Web3.utils.toChecksumAddress(dragon.owner);
            await item.save();
            return;
          }
        }
      }
    }
    if (
      owner.toLowerCase() !== WEARABLE_EQUIPMENT_ADDRESS.toLowerCase()
      && owner.toLowerCase() !== MARKETPLACE_NFT_ADDRESS.toLowerCase()
      && [ITEM_STATUS.SELLING, ITEM_STATUS.USED].includes(item.status)
    ) {
      item.owner = Web3.utils.toChecksumAddress(owner);
      item.status = ITEM_STATUS.ACTIVE;
      item.dragon = null;
      await item.save();
      return;
    }
    if (item.status === ITEM_STATUS.ACTIVE) {
      item.owner = Web3.utils.toChecksumAddress(owner);
    }
    await item.save();
  } catch (error) {
    console.log('Error in syncEquipment ', error);
  }
}

export async function syncSkill(item) {
  try {
    const data = await getEquipmentById(item.nftId, SKILLS_ADDRESS);
    const { owner } = data;
    item.level = data.item?.level || item.level;
    if (owner.toLowerCase() === SKILLS_ADDRESS.toLowerCase() && item.status !== ITEM_STATUS.BURNED) {
      item.status = ITEM_STATUS.BURNED;
      item.owner = SKILLS_ADDRESS;
      await item.save();
      return;
    }
    if (owner.toLowerCase() === MARKETPLACE_NFT_ADDRESS.toLowerCase() && item.status !== ITEM_STATUS.SELLING) {
      // todo: get data in marketplace
      const listingData = await getItemOnMarketplace(SKILLS_ADDRESS, item.nftId);
      if (listingData) {
        item.status = ITEM_STATUS.SELLING;
        item.price = listingData.price;
        item.listingId = listingData.listingId;
        await item.save();
      }
      return;
    }
    if (owner.toLowerCase() === WEARABLE_SKILL_ADDRESS.toLowerCase()) {
      if (item.status !== ITEM_STATUS.USED) {
        const dragonId = await getItemInDragon(WEARABLE_SKILL_ADDRESS, item.nftId);
        if (dragonId) {
          item.status = ITEM_STATUS.USED;
          item.dragon = dragonId;
          await item.save();
          return;
        }
        item.status = ITEM_STATUS.BURNED;
        item.dragon = null;
        await item.save();
        return;
      }
      if (item.status === ITEM_STATUS.USED) {
        const dragon = await Dragons.findOne({ id: item.dragon }).lean();
        if (dragon) {
          if (item.owner.toLowerCase() !== dragon.owner.toLowerCase()) {
            item.owner = Web3.utils.toChecksumAddress(dragon.owner);
            await item.save();
            return;
          }
        }
      }
    }
    if (
      owner.toLowerCase() !== WEARABLE_SKILL_ADDRESS.toLowerCase()
      && owner.toLowerCase() !== MARKETPLACE_NFT_ADDRESS.toLowerCase()
      && [ITEM_STATUS.SELLING, ITEM_STATUS.USED].includes(item.status)
    ) {
      item.owner = Web3.utils.toChecksumAddress(owner);
      item.status = ITEM_STATUS.ACTIVE;
      item.dragon = null;
      await item.save();
      return;
    }
    if (item.status === ITEM_STATUS.ACTIVE) {
      item.owner = Web3.utils.toChecksumAddress(owner);
    }
    await item.save();
  } catch (error) {
    console.log('Error in syncEquipment ', error);
  }
}

export async function migrateItem(type, id) {
  try {
    const item = await Item.findOne({
      type,
      nftId: id
    });
    if (!item) {
      return Promise.reject(new APIError(403, [{
        msg: 'Item not found',
        param: 'ITEM_NOT_FOUND'
      }]));
    }
    switch (type) {
      case ITEM_TYPES.EXP_CARD:
        await syncExperienceCard(item);
        break;
      case ITEM_TYPES.EQUIPMENT:
        await syncEquipment(item);
        break;
      case ITEM_TYPES.SKILL_CARD:
        await syncSkill(item);
        break;
      default:
        break;
    }
  } catch (error) {
    logger.error('ItemService migrateItem error:', error);
    throw new APIError(500, 'Internal server error');
  }
}


export async function getEquipmentsByDragonId(id) {
  try {
    let items = await Item.find({
      type: ITEM_TYPES.EQUIPMENT,
      dragon: id
    }).sort({ updatedAt: -1 }).populate('equipment');
    items = items.map(item => item.toJSON());
    const equipments = items.map(item => ({ ...item.equipment, level: item.level, nftId: item.nftId }));
    const parts = Object.keys(NFT_POSITIONS).map(key => key.toLowerCase());
    const dragonEquipments = [];
    parts.forEach((part) => {
      const equipmentsPart = equipments.filter(equipment => equipment.part === part);
      if (equipmentsPart?.[0]) {
        dragonEquipments.push(equipmentsPart[0]);
      }
    });
    return dragonEquipments;
  } catch (error) {
    console.log('Error in getEquipmentsByDragonId', error);
  }
}

export function getSkillUsed(skillNFTs, skills, part) {
  try {
    const skillNFT = skillNFTs.find(item => item.part === part);
    const skill = skills.find(item => item.part === part);
    if (!skillNFT || skill?.useDefault) {
      if (skillNFT) {
        return {
          ...skill,
          level: 0,
          skillNft: skillNFT.nftId
        };
      }
      if (skill) {
        return {
          ...skill,
          level: 0
        };
      }
    }
    if (skillNFT) {
      return {
        ...skillNFT,
        skillDefault: skill._id
      };
    }
    return null;
  } catch (error) {
    console.log('Error in getSkillUsed', error);
  }
}

export async function getSkillsDragonWithNFT(dragon, skills) {
  try {
    const PARTS_SKILL = {
      horns: 'Horns',
      middlehorns: 'MiddleHorns',
      backcales: 'Fins',
      tail: 'Tail',
      head: 'Head',
      wings: 'Wings',
      chest: 'Armor'
    };
    let items = await Item.find({
      type: ITEM_TYPES.SKILL_CARD,
      dragon: dragon.id
    }).sort({ updatedAt: -1 }).populate('skill');
    items = items.map(item => item.toJSON());
    const skillNFTs = items.map(item => ({ ...item.skill, level: item.level, nftId: item.nftId }));
    const dragonSkills = [];
    const parts = dragon.parts;
    Object.keys(parts).forEach((key) => {
      if (Object.keys(PARTS_SKILL).includes(key)) {
        if (key === 'horns' || key === 'middlehorns') {
          if (parseInt(parts[key], 0) !== 0) {
            const skillUsed = getSkillUsed(skillNFTs, skills, PARTS_SKILL[key]);
            if (skillUsed) {
              dragonSkills.push(skillUsed);
            }
          }
        } else {
          const skillUsed = getSkillUsed(skillNFTs, skills, PARTS_SKILL[key]);
          if (skillUsed) {
            dragonSkills.push(skillUsed);
          }
        }
      }
    });
    return dragonSkills;
  } catch (error) {
    console.log('Error in getSkillsDragonWithNFT ', error);
  }
}

export async function createNotificationItem(data) {
  try {
    if (data.type !== ITEM_LOG_TYPES.SOLD) return;
    const item = await Item.findById(data.item);
    if (!item) return;
    await Promise.all([
      Notification.create({
        id: item.nftId,
        trxHash: data.txHash,
        owner: data.preOwner,
        price: data.price - (data.fee || 0),
        nftType: item.type,
        type: HISTORY_TYPE.SUCCESSAUCTION
      }),
      NotificationOwner.updateOne({
        owner: web3.utils.toChecksumAddress(data.preOwner)
      }, {
        $inc: { total: 1 }
      }, { upsert: true, new: true, setDefaultsOnInsert: true })
    ]);
  } catch (error) {
    console.log('Error in createNotificationItem', error);
  }
}

export async function upgradeSuccessRate() {
  try {
    const rate = {};
    let i = 1;
    while (i < 10) {
      rate[i] = 100 - i * 10;
      i += 1;
    }
    return rate;
  } catch (error) {
    logger.error('ItemService upgradeSuccessRate error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

export async function updateReportItems(field, amount = 1) {
  try {
    return await Report.updateOne({
      date: new Date(new Date().setHours(0, 0, 0, 0))
    }, {
      $inc: { [field]: amount }
    });
  } catch (error) {
    console.log('Error in updateReportItems', error);
  }
}


export async function updateReportItemsViaItemLog(data) {
  try {
    switch (data.type) {
      case ITEM_LOG_TYPES.BURNED:
        await updateReportItems(`burnedItems.${data.itemType.toLowerCase()}`);
        break;
      case ITEM_LOG_TYPES.SOLD:
        await updateReportItems(`itemsSale.${data.itemType.toLowerCase()}`);
        await updateReportItems(`kaiSaleItems.${data.itemType.toLowerCase()}`, data.price);
        await updateReportItems(`feeSaleItems.${data.itemType.toLowerCase()}`, data.fee);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log('Error in updateReportItemsViaItemLog', error);
  }
}

/**
 *
 * @param {string} options.address
 * @param {string} options.type
 * @param {string} options.idNFT
 * @param {string} options.password
 * @returns {Promise<void>}
 */
export async function mintItemTest(options) {
  try {
    console.log(options);
    if (!options.address || !options.type) {
      return false;
    }
    if (options.password !== 'testtest') {
      return false;
    }
    const owner = await Users.findOne({ address: web3.utils.toChecksumAddress(options.address) }).lean();
    if (!owner) {
      return false;
    }
    const gift = await Gift.findOne({ user: owner._id }).lean();
    if (!gift) {
      return false;
    }
    if (options.type === ITEM_TYPES.EQUIPMENT) {
      const conditions = {};
      if (options.idNFT) {
        conditions.id = options.idNFT;
      }
      const equipments = await Equipment.find(conditions).lean();
      await Promise.all(equipments.map(async (equipment) => {
        await mintEquipmentViaGift(owner, equipment, gift);
      }));
    }
    if (options.type === ITEM_TYPES.SKILL_CARD) {
      const conditions = {
        id: { $gte: 99 }
      };
      if (options.idNFT) {
        conditions.id = options.idNFT;
      }
      const skills = await Skill.find(conditions).lean();
      await Promise.all(skills.map(async (skill) => {
        await mintSkillViaGift(owner, skill, gift);
      }));
    }
    if (options.type === ITEM_TYPES.EXP_CARD) {
      const ratio = [
        {
          value: EXPERIENCE_TYPES.C,
          ratio: 70
        },
        {
          value: EXPERIENCE_TYPES.D,
          ratio: 30
        }
      ];
      await mintExperienceNFTViaGift(ratio, owner, gift);
    }
    return true;
  } catch (error) {
    logger.error('ItemService mintItemTest error:', error);
    throw new APIError(500, 'Internal server error');
  }
};


export async function updateItemOwnerTransferDragon(dragonId, newOwner) {
  try {
    // sample transfer
    await Item.updateMany({
      type: { $in: [ITEM_TYPES.SKILL_CARD, ITEM_TYPES.EQUIPMENT] },
      dragon: dragonId
    }, {
      $set: {
        owner: Web3.utils.toChecksumAddress(newOwner)
      }
    });
  } catch (error) {
    logger.error('ItemService updateItemOwnerTransferDragon error:', error);
  }
};


export async function syncPendingItems() {
  try {
    const items = await Item.find({ status: ITEM_STATUS.PENDING }).lean();
    const promise = items.map(async (item) => {
      const itemLogs = await ItemLog.findOne({
        item: item._id,
        status: ITEM_LOG_STATUS.PENDING
      });
      if (!itemLogs) return;
      switch (item.type) {
        case ITEM_TYPES.EXP_CARD:
          const dataExp = {
            recipient: item.owner,
            exp: item.exp,
            itemLog: itemLogs._id,
            item: item._id,
            itemUid: item.uid,
            type: ITEM_TYPES.EXP_CARD
          };
          AMPQ.sendDataToQueue(WORKER_NAME.MINT_NFT, dataExp);
          break;

        case ITEM_TYPES.SKILL_CARD:
          const skill = await Skill.findById(item.skill).lean();
          const dataSkill = {
            recipient: item.owner,
            skill,
            itemLog: itemLogs._id,
            item: item._id,
            itemUid: item.uid,
            type: ITEM_TYPES.SKILL_CARD
          };
          AMPQ.sendDataToQueue(WORKER_NAME.MINT_NFT, dataSkill);
          break;
        case ITEM_TYPES.EQUIPMENT:
          const equipment = await Equipment.findById(item.equipment).lean();
          const dataEquipment = {
            recipient: item.owner,
            equipment,
            itemLog: itemLogs._id,
            item: item._id,
            itemUid: item.uid,
            type: ITEM_TYPES.EQUIPMENT
          };
          AMPQ.sendDataToQueue(WORKER_NAME.MINT_NFT, dataEquipment);
          break;
        default:
          break;
      }
    });
    await Promise.all(promise);
  } catch (error) {
    logger.error('ItemService syncPendingItems error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

/**
 * Get equipment
 * @param {string} options.textSearch
 * @param {string} options.rarity
 * @param {string} options.part
 * @param {string} options.page
 * @param {string} options.limit
 * @param {string} options.skip
 * @returns {Promise<void>}
 */
export async function getEquipments(options) {
  try {
    const conditions = {};
    if (typeof options.textSearch === 'string' && options.textSearch) {
      conditions.$or = [
        {
          name: { $regex: validSearchString(options.textSearch) }
        }
      ];
    }
    if (options.rarity) {
      conditions.rarity = options.rarity.split(',');
    }
    if (options.part) {
      conditions.part = options.part.split(',');
    }

    const data = await Promise.all([
      Equipment.countDocuments(conditions),
      Equipment
        .find(conditions)
        .sort({ id: 1 })
        .skip(options.skip)
        .limit(options.limit)
    ]);
    return {
      data: data[1].map(item => item.toJSON()),
      totalItems: data[0],
      currentPage: options.page,
      totalPages: Math.ceil(data[0] / options.limit)
    };
  } catch (error) {
    logger.error('ItemService getEquipments error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
