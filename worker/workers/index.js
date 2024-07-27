import AMPQ from '../../rabbitmq/ampq';
import * as ConvertMediaWorker from './convertMedia';
import * as HandleEventWorker from './handleEvent';
import * as MintNFTWorker from './mintNFT';
import logger from '../../server/util/logger';

export async function createWorkers() {
  try {
    await AMPQ.initChannel();
    // Run workers here
    ConvertMediaWorker.run();
    HandleEventWorker.run();
    MintNFTWorker.run();
    return true;
  } catch (error) {
    logger.error('AMPQ: createWorkers initChannel error:');
    logger.error(error);
    throw error;
  }
}
