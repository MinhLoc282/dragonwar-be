import AMPQ from '../../rabbitmq/ampq';
import { WORKER_NAME, MINT_NFT_AFTER_FAILED, ITEM_TYPES } from '../../server/constants';
import logger from '../../server/util/logger';
import { mintEquipmentNFT, mintExperienceNFT, mintSkillNFT } from '../../server/web3/kai/writeContract/mint';

export function run() {
  logger.info('MINT_NFT WORKER IS RUNNING...');
  AMPQ.consumeData(WORKER_NAME.MINT_NFT, async (msg, channel) => {
    try {
      const data = JSON.parse(msg.content.toString());
      switch (data.type) {
        case ITEM_TYPES.EXP_CARD:
          await mintExperienceNFT(data);
          break;
        case ITEM_TYPES.EQUIPMENT:
          await mintEquipmentNFT(data);
          break;
        case ITEM_TYPES.SKILL_CARD:
          await mintSkillNFT(data);
          break;
        default:
          break;
      }
      return channel.ack(msg);
    } catch (error) {
      logger.error('CONVERT_MEDIA error:');
      logger.error(error);
      setTimeout(() => {
        console.log('channel.nack');
        channel.nack(msg);
      }, MINT_NFT_AFTER_FAILED);
      throw error;
    }
  }, {
    noAck: false,
  });
}
