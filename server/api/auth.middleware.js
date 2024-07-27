import Web3 from 'web3';
import jwt from 'jsonwebtoken';
import APIError from '../util/APIError';
import {AUTH_ERRORS, DEFAULT_SESSION_KEY, USER_ROLE, USER_STATUS} from '../constants';
import {ENVIRONMENT_LAUNCH, USER_JWT_SECRET_KEY} from '../config';
import User from '../components/user/user.model';
import logger from '../util/logger';
import {getRedisInfo} from "../helpers/redis";
/**
 * Validate user account
 * @param checkPermission
 * @returns {function(*, *, *)}
 */
export function isAuthorized(owner = false) {
  return async (req, res, next) => {
    try {
      if (owner && !Web3.utils.isAddress(req.header('wallet'))) {
        return next(new APIError(401, AUTH_ERRORS.UNAUTHORIZED));
      }
      if (Web3.utils.isAddress(req.header('wallet'))) {
        req.wallet = Web3.utils.toChecksumAddress(req.header('wallet'));
      }
      if (owner) {
        if (!req.header('wallet') || !Web3.utils.isAddress(req.wallet)) {
          return next(new APIError(403, 'WalletInvalid'));
        }
      }
      return next();
    } catch (error) {
      logger.error(`User validation error: ${error}`);
      return next(new APIError(500, 'Internal server error'));
    }
  };
}

export function isAuthorUser(role = null) {
  return async (req, res, next) => {
    try {
      const authorization = req.header('Authorization');
      if (typeof authorization !== 'string') {
        return next(new APIError(401, AUTH_ERRORS.UNAUTHORIZED));
      }
      const authorizationArray = authorization.split(' ');
      if (authorizationArray[0] === 'Bearer') {
        const token = authorizationArray[1];
        let userData;
        try {
          userData = jwt.verify(token, USER_JWT_SECRET_KEY);
        } catch (error) {
          return next(new APIError(401, AUTH_ERRORS.UNAUTHORIZED));
        }
        if (ENVIRONMENT_LAUNCH !== 'development') {
          const sessions = await getRedisInfo('sessionIds');
          if ((!sessions && userData.session !== DEFAULT_SESSION_KEY) || (sessions?.length && !sessions.includes(userData.session))) {
            return next(new APIError(401, AUTH_ERRORS.SESSION_EXPIRED));
          }
        }
        req.auth = await User.findOne({ _id: userData._id }, '_id userName signer address status role');
        if (!req.auth) {
          return next(new APIError(401, AUTH_ERRORS.UNAUTHORIZED));
        }
        if (req.auth.status !== USER_STATUS.ACTIVE) {
          return next(new APIError(401, AUTH_ERRORS.UNAUTHORIZED));
        }
        if (role && req.auth.role !== role) {
          return next(new APIError(401, AUTH_ERRORS.UNAUTHORIZED));
        }
        return next();
      }
      return next(new APIError(401, AUTH_ERRORS.UNAUTHORIZED));
    } catch (error) {
      logger.error(`User validation error: ${error}`);
      return next(new APIError(500, 'Internal server error'));
    }
  };
}
