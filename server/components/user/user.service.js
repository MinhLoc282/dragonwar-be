import Web3 from 'web3';
import bcrypt from 'bcryptjs';
import Users from './user.model';
import APIError from '../../util/APIError';
import {
  BALANCE_FLUCTUATION_STATUS,
  BALANCE_FLUCTUATION_TYPES,
  BCRYPT_SALT_ROUNDS,
  DEFAULT_SESSION_KEY, GIFT_TYPES, MIN_BATTLE_COMPLETE_MISSION_PVE, MISSION_TYPES,
  USER_ROLE, USER_STATUS
} from '../../constants';
import { removeFile } from '../../helpers/file.helper';
import logger from '../../api/logger';
import { getSignerAddressWeb3 } from '../../util/parseSignerMessage';
import { getRedisInfo } from '../../helpers/redis';
import { ENVIRONMENT_LAUNCH } from '../../config';
import BalanceFluctuation from './balanceFLuctuation.model';
import { conditionTimeInDay } from '../../helpers';
import Config from '../config/config.model';
import { getProgressMissionPvE } from '../adventure/adventure.service';
import { whitelistAddress } from './whitelistAddress';
import Whitelist from './whitelist.model';
import BattleHistory from '../battleHistory/battleHistory.model';
import Gift from '../gift/gift.model';


/**
 *
 * @param options
 * @param {string} options.userName
 * @param {string} options.address
 * @param {string} options.signer
 * @param {string} options.file
 * @param {string} options.session
 * @returns {Promise<never>}
 */
export async function createUser(options) {
  try {
    if (!Web3.utils.isAddress(options.address)) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Address is invalid',
          params: 'ADDRESS_IS_INVALID'
        }
      ]));
    }

    const sessions = await getRedisInfo('sessionIds');
    if ((!sessions && options.session !== DEFAULT_SESSION_KEY) || (sessions?.length && !sessions.includes(options.session))) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Session is invalid',
          param: 'SESSION_INVALID'
        }
      ]));
    }

    const signerAddress = await getSignerAddressWeb3(options.session, options.signer);

    if (!signerAddress || Web3.utils.toChecksumAddress(options.address) !== Web3.utils.toChecksumAddress(signerAddress)) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Signer is invalid with wallet',
          param: 'SIGNER_NOT_MATCH'
        }
      ]));
    }

    const user = await Users.findOne({ address: Web3.utils.toChecksumAddress(options.address) });
    if (user) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Address is exists',
          params: 'USER_NAME_OR_ADDRESS_IS_EXISTS',
        },
      ]));
    }
    const dataCreate = {
      userName: options.userName || `User_${Date.now()}`,
      address: Web3.utils.toChecksumAddress(options.address),
    };
    if (options.file) {
      dataCreate.avatar = options.file;
    }
    let newUser = await Users.create(dataCreate);
    const token = newUser.signJWT(options.session);
    newUser = newUser.toJSON();
    newUser.token = token;
    return newUser;
  } catch (error) {
    logger.error('error createUser : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}

/**
 *
 * @param options
 * @param {number} options.page
 * @param {number} options.limit
 * @param {number} options.skip
 * @param {string} options.address
 * @param {string} options.userName
 * @param {string} options.textSearch
 * @returns {Promise<never>}
 */
export async function getUsers(options) {
  try {
    const conditions = {
      role: USER_ROLE.USER
    };
    if (options.textSearch) {
      conditions.$or = [
        {
          userName: { $regex: options.textSearch, $options: 'i' }
        },
        {
          address: { $regex: options.textSearch, $options: 'i' }
        },
      ];
    }
    const promise = [
      Users.countDocuments(conditions),
      Users.find(conditions).sort({ createdAt: -1 }).limit(options.limit).skip(options.skip)
    ];
    const data = await Promise.all(promise);
    const users = await Users.getMetaData(data[1]);
    return {
      data: users,
      totalItems: data[0],
      currentPage: options.page,
      totalPages: Math.ceil(data[0] / options.limit)
    };
  } catch (error) {
    logger.error('error getUsers : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}


export async function getProgressMission(userId) {
  try {
    const promise = [
      Users.countDocuments({
        _id: userId,
        checkinTime: conditionTimeInDay(Date.now())
      }),
      getProgressMissionPvE(userId)
    ];
    const mission = await Promise.all(promise);

    return [
      {
        name: 'Daily checkin',
        type: MISSION_TYPES.CHECKBOX,
        value: !!mission[0],
      },
      {
        name: 'Adventure quest',
        type: MISSION_TYPES.PROGRESS,
        value: mission[1]
      }
    ];
  } catch (error) {
    console.log('Error in getProgressMission => ', error);
  }
}

/**
 *
 * @param {string} id
 * @returns {Promise<never>}
 */
export async function getUserById(id, authorized = false) {
  try {
    let user = await Users.findById(id);
    if (!user) {
      return Promise.reject(new APIError(404, [
        {
          msg: 'User not found',
          params: 'USER_NOT_FOUND'
        }
      ]));
    }
    if (authorized) {
      const sessions = await getRedisInfo('sessionIds');
      const token = user.signJWT(sessions?.[0] || DEFAULT_SESSION_KEY);
      user = await Users.getMetaData(user);
      user.token = token;
      user.quest = await getProgressMission(user._id);
    }
    return user;
  } catch (error) {
    logger.error('error getUserById : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}

/**
 *
 * @param options
 * @param {string} options.userName
 * @param {string} options.file
 * @param {string} options.fullName
 * @param {string} options.currentPassword
 * @param {string} options.newPassword
 * @param {string} options.signer
 * @param {string} options.session
 * @param {string} auth._id
 * @returns {Promise<never>}
 */
export async function editUser(options, auth) {
  try {
    const user = await Users.findById(auth._id);
    if (!user) {
      return Promise.reject(new APIError(404, [
        {
          msg: 'User not found',
          params: 'USER_NOT_FOUND'
        }
      ]));
    }
    user.fullName = options.fullName || user.fullName;
    if (options.userName?.trim() && options.userName.trim() !== user.userName) {
      const userOther = await Users.findOne({ userName: options.userName.trim() });
      if (userOther) {
        return Promise.reject(new APIError(404, [
          {
            msg: 'userName is exist',
            params: 'USER_NAME_IS_EXIST'
          }
        ]));
      }
    }
    user.userName = options.userName?.trim() || user.userName;
    if (options.file && options.file !== user.avatar) {
      user.avatar = options.file;
      removeFile(user.avatar);
    }
    if (options.newPassword?.trim()) {
      if (options.currentPassword?.trim()) {
        if (!user.comparePassword(options.currentPassword.trim())) {
          return Promise.reject(new APIError(403, [
            {
              msg: 'Password is not correct',
              param: 'PASSWORD_IS_NOT_CORRECT'
            }
          ]));
        }
        user.password = bcrypt.hashSync(options.newPassword.trim(), BCRYPT_SALT_ROUNDS);
      }
      if (!options.currentPassword?.trim() && options.signer && options.newPassword) {
        const sessions = await getRedisInfo('sessionIds');
        if ((!sessions && options.session !== DEFAULT_SESSION_KEY) || (sessions?.length && !sessions.includes(options.session))) {
          return Promise.reject(new APIError(403, [
            {
              msg: 'Session is invalid',
              param: 'SESSION_INVALID'
            }
          ]));
        }

        const signerAddress = await getSignerAddressWeb3(options.session, options.signer);

        if (!signerAddress || Web3.utils.toChecksumAddress(user.address) !== Web3.utils.toChecksumAddress(signerAddress)) {
          return Promise.reject(new APIError(403, [
            {
              msg: 'Signer is invalid with wallet',
              param: 'SIGNER_NOT_MATCH'
            }
          ]));
        }
        user.password = bcrypt.hashSync(options.newPassword.trim(), BCRYPT_SALT_ROUNDS);
      }
    }
    await user.save();
    return user.toJSON();
  } catch (error) {
    logger.error('error editUser : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}

/**
 *
 * @param options
 * @param {string} options.address
 * @param {string} options.signer
 * @param {string} options.session
 * @param {string} options.userName
 * @param {string} options.password
 * @returns {Promise<*|*>}
 */
export async function login(options, role = USER_ROLE.USER) {
  try {
    let user;
    // login via sign wallet
    if (options.address && options.signer) {
      if (!Web3.utils.isAddress(options.address)) {
        return Promise.reject(new APIError(403, [
          {
            msg: 'Address is invalid',
            param: 'ADDRESS_IS_INVALID'
          }
        ]));
      }
      if (ENVIRONMENT_LAUNCH !== 'development') {
        const sessions = await getRedisInfo('sessionIds');
        if ((!sessions && options.session !== DEFAULT_SESSION_KEY) || (sessions?.length && !sessions.includes(options.session))) {
          return Promise.reject(new APIError(403, [
            {
              msg: 'Session is invalid',
              param: 'SESSION_INVALID'
            }
          ]));
        }
      }
      const signerAddress = await getSignerAddressWeb3(options.session, options.signer);
      if (!signerAddress || Web3.utils.toChecksumAddress(options.address) !== Web3.utils.toChecksumAddress(signerAddress)) {
        return Promise.reject(new APIError(403, [
          {
            msg: 'Signer is invalid with wallet',
            param: 'SIGNER_NOT_MATCH'
          }
        ]));
      }
      user = await Users.findOne({ address: Web3.utils.toChecksumAddress(options.address) });
      if (!user && role === USER_ROLE.USER) {
        // const whitelisted = await Whitelist.countDocuments({ address: options.address.toLowerCase() });
        // if (!whitelisted) {
        //   return Promise.reject(new APIError(403, [
        //     {
        //       msg: 'Wallet is not whitelisted',
        //       param: 'WALLET_I_NOT_WHITELISTED'
        //     }
        //   ]));
        // }
        const dataCreate = {
          userName: options.userName || `User_${Date.now()}`,
          address: Web3.utils.toChecksumAddress(options.address),
        };
        user = await Users.create(dataCreate);
      }
      if (role !== USER_ROLE.USER) {
        if (!user) {
          return Promise.reject(new APIError(403, [
            {
              msg: 'User not found',
              param: 'USER_NOT_FOUND'
            }
          ]));
        }
        if (user.role !== role) {
          return Promise.reject(new APIError(403, [
            {
              msg: 'Permission denied',
              param: 'PERMISSION_DENIED'
            }
          ]));
        }
      }
    }

    // login via userName, password
    if (options.userName && options.password) {
      user = await Users.findOne({ userName: options.userName.trim() });
      if (!user) {
        return Promise.reject(new APIError(403, [
          {
            msg: 'User not found',
            param: 'USER_NOT_FOUND'
          }
        ]));
      }
      if (!user.comparePassword(options.password)) {
        return Promise.reject(new APIError(403, [
          {
            msg: 'Password is incorrect',
            param: 'PASSWORD_IS_INCORRECT'
          }
        ]));
      }
    }

    if (!user) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'User not found',
          param: 'USER_NOT_FOUND'
        }
      ]));
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'User is inactive',
          param: 'USER_IS_INACTIVE'
        }
      ]));
    }
    const token = user.signJWT(options.session);
    user = await Users.getMetaData(user);
    user.token = token;
    user.quest = await getProgressMission(user._id);
    return user;
  } catch (error) {
    logger.error('error login : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}


export async function getSession() {
  try {
    const sessions = await getRedisInfo('sessionIds');
    return sessions?.[0] || DEFAULT_SESSION_KEY;
  } catch (error) {
    logger.error('error getSession : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}

/**
 * @param options
 * @param {number} options.page
 * @param {number} options.skip
 * @param {number} options.limit
 * @param {string} options.status
 * @param {string} userId
 * @returns {Promise<{totalItems: (number|module:mongoose), data, totalPages: number, currentPage: *}>}
 */
export async function getBalanceFluctuation(options, userId) {
  try {
    const conditions = {
      user: userId
    };
    if (options.status) {
      conditions.status = options.status;
    }
    const promise = [
      BalanceFluctuation.countDocuments(conditions),
      BalanceFluctuation.find(conditions).sort({ createdAt: -1 }).skip(options.skip).limit(options.limit)
    ];
    const data = await Promise.all(promise);
    return {
      data: data[1].map(item => item.toJSON()),
      totalItems: data[0],
      currentPage: options.page,
      totalPages: Math.ceil(data[0] / options.limit)
    };
  } catch (error) {
    logger.error('error getBalanceFluctuation : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}


export async function dailyCheckin(userId) {
  try {
    const user = await Users.findById(userId);
    if (!user) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'User not found',
          param: 'USER_NOT_FOUND'
        }
      ]));
    }
    const userCheckin = await Users.countDocuments({
      _id: userId,
      checkinTime: conditionTimeInDay(Date.now())
    });
    if (userCheckin) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'User has checked-in before',
          param: 'USER_CHECKED_IN_BEFORE'
        }
      ]));
    }
    user.checkinTime = new Date();
    await user.save();
    const checkConditionReceiveGift = await Promise.all([
      BattleHistory.countDocuments({
        players: userId,
        'adventure.id': {
          $gte: MIN_BATTLE_COMPLETE_MISSION_PVE
        },
        'result.isWin': true,
        createdAt: conditionTimeInDay(Date.now())
      }),
      Gift.countDocuments({
        user: userId,
        type: GIFT_TYPES.DAILY_QUEST,
        createdAt: conditionTimeInDay(Date.now()),
      })
    ]);
    if (checkConditionReceiveGift[0] && !checkConditionReceiveGift[1]) {
      await Gift.create({
        user: userId,
        type: GIFT_TYPES.DAILY_QUEST,
      });
    }
    return true;
  } catch (error) {
    logger.error('error dailyCheckin : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}


export async function generateWhitelist() {
  try {
    const promise = whitelistAddress.map(async (address) => {
      const whitelist = await Whitelist.findOne({ address: address.toLowerCase() });
      if (whitelist) return true;
      await Whitelist.create({
        address: address.toLowerCase()
      });
      return true;
    });
    await Promise.all(promise);
    return true;
  } catch (error) {
    logger.error('error generateWhitelist : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}


export async function addWhitelist(data) {
  try {
    if (!data.address || !Web3.utils.isAddress(data.address)) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Wallet is invalid',
          param: 'WALLET_IS_INVALID'
        }
      ]));
    }
    const whitelist = await Whitelist.findOne({ address: data.address.toLowerCase() });
    if (whitelist) {
      return Promise.reject(new APIError(403, [
        {
          msg: 'Whitelisted exists',
          param: 'WHITELISTED_EXISTS'
        }
      ]));
    }
    await Whitelist.create({
      address: data.address.toLowerCase()
    });
    return true;
  } catch (error) {
    logger.error('error generateWhitelist : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}


export async function gameGetUserById(id) {
  try {
    let user = await Users.findById(id);
    if (!user) {
      return Promise.reject(new APIError(404, [
        {
          msg: 'User not found',
          params: 'USER_NOT_FOUND'
        }
      ]));
    }
    const sessions = await getRedisInfo('sessionIds');
    const token = user.signJWT(sessions?.[0] || DEFAULT_SESSION_KEY);
    user = await Users.getMetaData(user);
    user.token = token;
    return user;
  } catch (error) {
    logger.error('error gameGetUserById : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}
