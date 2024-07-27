import AMPQ from '../../rabbitmq/ampq';
import { WORKER_NAME, RESIZE_IMAGE_AFTER_FAILED } from '../../server/constants';
import logger from '../../server/util/logger';
import { resizeImage } from '../../server/helpers/resize';

export function run() {
  logger.info('CONVERT_MEDIA WORKER IS RUNNING...');
  AMPQ.consumeData(WORKER_NAME.RESIZE_IMAGE, async (msg, channel) => {
    try {
      const data = msg.content.toString();
      resizeImage(data);
      return channel.ack(msg);
    } catch (error) {
      logger.error('CONVERT_MEDIA error:');
      logger.error(error);
      setTimeout(() => {
        channel.nack(msg);
      }, RESIZE_IMAGE_AFTER_FAILED);
      throw error;
    }
  }, {
    noAck: false,
  });
}
