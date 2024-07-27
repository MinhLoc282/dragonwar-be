import logger from "../../api/logger";
import APIError from "../../util/APIError";
import Gift from './gift.model';
import { GIFT_STATUS, ITEM_TYPES } from '../../constants';
import { Promise } from 'mongoose';
import { mintNFTViaGift } from '../item/item.service';
import Item from '../item/item.model';
import Effect from '../dragon/effect.model';
import Users from '../user/user.model';
import Web3 from 'web3';

/**
 * @param auth
 * @param {string} auth._id
 * @returns {Promise<never>}
 */
export async function getGifts(auth) {
  try {
    const data = await Gift.aggregate(
      [
        {
          $match: {
            user: auth._id,
            status: GIFT_STATUS.UNOPENED,
          }
        },
        {
          $group: { _id: '$type', total: { $sum: 1 } }
        }
      ]
    );
    return data.map(item => ({
      type: item._id,
      total: item.total
    }));
  } catch (error) {
    logger.error('error getGifts : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}

/**
 * @param {string} wallet
 * @returns {Promise<null|*>}
 */
export async function getGiftsForWeb(wallet) {
  try {
    const user = await Users.findOne({
      address: Web3.utils.toChecksumAddress(wallet)
    }).lean();
    if (!user) {
      return null;
    }
    return await getGifts(user);
  } catch (error) {
    logger.error('error getGiftsForWeb : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}

/**
 * @param {string} giftId
 * @param {string} auth._id
 * @param {string} auth.address
 * @returns {Promise<never>}
 */
export async function openGift(type, auth) {
  try {
    const gifts = await Gift.find({
      status: GIFT_STATUS.UNOPENED,
      type,
      user: auth._id
    }).sort({ _id: 1 }).limit(1).lean();
    const gift = gifts?.[0];
    if (!gift) {
      return Promise.reject(new APIError(403, [{
        msg: 'Gift not found',
        param: 'GIFT_NOT_FOUND'
      }]));
    }
    await Gift.updateOne(
      {
        _id: gift._id
      }, {
        $set: {
          status: GIFT_STATUS.OPENED
        }
      }
    );
    const dataMinted = await mintNFTViaGift(auth, gift);
    if (!dataMinted) return null;
    const item = await Item.findById(dataMinted._id).populate('equipment').populate('skill');
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
    return data;
  } catch (error) {
    logger.error('error openGift : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}

/**
 *
 * @param {string} type
 * @param {string} wallet
 * @returns {Promise<*>}
 */
export async function openGiftForWeb(type, wallet) {
  try {
    const user = await Users.findOne({
      address: Web3.utils.toChecksumAddress(wallet)
    }).lean();
    if (!user) {
      return Promise.reject(new APIError(403, [{
        msg: 'User not found',
        param: 'USER_NOT_FOUND'
      }]));
    }
    return await openGift(type, user);
  } catch (error) {
    logger.error('error openGiftForWeb : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}
