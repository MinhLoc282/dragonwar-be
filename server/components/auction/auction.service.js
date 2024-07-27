import web3 from 'web3';

import logger from '../../api/logger';
import APIError from '../../util/APIError';
import Dragon from '../dragon/dragon.model';
import { getAuctionTokenById } from '../../web3/kai/readContract/kai';
import { createDragonHistory } from '../dragon/dragon.service';

export async function createAuction(id, type = '') {
  try {
    const price = await getAuctionTokenById(id, type);
    const dragon = await Dragon.findOneAndUpdate({ id: parseInt(id, 0) }, {
      $set: {
        price: web3.utils.fromWei(price, 'ether'),
        sale: type,
        dateListed: new Date()
      }
    });
    await createDragonHistory({
      id: parseInt(id, 0),
      from: dragon?.owner ?? '',
      price: web3.utils.fromWei(price, 'ether'),
      type: type
    });
  } catch (error) {
    logger.error('DragonService createAuction error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
export async function cancelAuction(id, type = '') {
  try {
    const dragon = await Dragon.findOneAndUpdate({ id: parseInt(id, 0) }, {
      $unset: {
        price: 1,
        sale: 1
      },
    });
    if (type) {
      await createDragonHistory({
        id: parseInt(id, 0),
        from: dragon?.owner ?? '',
        type: type
      });
    }
  } catch (error) {
    logger.error('DragonService cancelAuction error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
