import AMPQ from './ampq';
import {
  WORKER_NAME,
} from '../server/constants';
import logger from '../server/util/logger';

export async function createQueue() {
  try {
    await AMPQ.initChannel();
    AMPQ.initQueue(WORKER_NAME.RESIZE_IMAGE);
    logger.info('AMPQ queue initialized');
    return true;
  } catch (error) {
    logger.error('AMPQ: createQueue initChannel error:');
    logger.error(error);
    throw error;
  }
}

export async function createQueueSocket() {
  try {
    await AMPQ.initChannel();
    AMPQ.initQueue(WORKER_NAME.HANDLE_EVENT_KAI);
    logger.info('AMPQ queue initialized');
    return true;
  } catch (error) {
    logger.error('AMPQ: createQueue initChannel error:');
    logger.error(error);
    throw error;
  }
}

export async function createQueueMintNFT() {
  try {
    await AMPQ.initChannel();
    AMPQ.initQueue(WORKER_NAME.MINT_NFT);
    logger.info('AMPQ queue initialized');
    return true;
  } catch (error) {
    logger.error('AMPQ: createQueue initChannel error:');
    logger.error(error);
    throw error;
  }
}
