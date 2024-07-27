import AMPQ from '../../rabbitmq/ampq';
import { WORKER_NAME, HANDLE_EVENT_KAI_AFTER_FAILED } from '../../server/constants';
import logger from '../../server/util/logger';
import { birthDragon, pregnantDragon, updateDragon, trainingDragon } from '../../server/components/dragon/dragon.service';

export function run() {
  logger.info('HANDLE_EVENT_KAI WORKER IS RUNNING...');
  AMPQ.consumeData(WORKER_NAME.HANDLE_EVENT_KAI, async (msg, channel) => {
    try {
      const result = JSON.parse(msg.content.toString());
      const data = result.data;
      switch (result.type) {
        case 'BIRTH':
          await birthDragon(
            parseInt(data.dragonId, 0),
            parseInt(data.matronId, 0),
            data.owner
          );
          break;
        case 'TRANSFER':
          await updateDragon(parseInt(data.tokenId, 0), { owner: data.owner });
          break;
        case 'PREGNANT':
          await pregnantDragon(parseInt(data.matronId, 0), parseInt(data.sireId, 0));
          break;
        case 'TRAINING':
          await trainingDragon(
            parseInt(data.dragonId, 0),
            parseInt(data.xp, 0),
            parseInt(data.level, 0),
            parseInt(data.startLock, 0),
            parseInt(data.price, 0)
          );
          break;
        default:
          break;
      }
      return channel.ack(msg);
    } catch (error) {
      logger.error('HANDLE_EVENT_KAI error:');
      logger.error(error);
      setTimeout(() => {
        channel.nack(msg);
      }, HANDLE_EVENT_KAI_AFTER_FAILED);
      throw error;
    }
  }, {
    noAck: false,
  });
}
