import mongoose from 'mongoose';
import {
  createCron,
  createCronGenerateSession, createCronLogReward,
  createCronResetTimesBattle,
  createCronUpdatePoolReward,
  syncDataReport
} from './cron/index';
import logger from '../server/util/logger';
import { MONGO_URI } from '../server/config';

(async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    logger.info('Mongodb connected');
  } catch (error) {
    logger.error('Please make sure Mongodb is installed and running!');
    throw error;
  }
})();
syncDataReport().then(() => {
  logger.info('CronJob is syncDataReport');
}).catch((error) => {
  logger.error('CronJob start failed:');
  logger.error(error);
});

createCronGenerateSession().then(() => {
  logger.info('CronJob is createCronGenerateSession');
}).catch((error) => {
  logger.error('CronJob start failed:');
  logger.error(error);
});

createCronResetTimesBattle().then(() => {
  logger.info('CronJob is createCronResetTimesBattle');
}).catch((error) => {
  logger.error('CronJob start failed:');
  logger.error(error);
});

createCronUpdatePoolReward().then(() => {
  logger.info('CronJob is createCronUpdatePoolReward');
}).catch((error) => {
  logger.error('CronJob start failed:');
  logger.error(error);
});
createCronLogReward().then(() => {
  logger.info('CronJob is createCronLogReward');
}).catch((error) => {
  logger.error('CronJob start failed:');
  logger.error(error);
});

createCron().then(() => {
  logger.info('CronJob is running');
}).catch((error) => {
  logger.error('CronJob start failed:');
  logger.error(error);
});
