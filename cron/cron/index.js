import * as HandleEventCron from './handleEvent';
import logger from '../../server/util/logger';
import {
  CRON_TIME,
  CRON_TIME_CREATE_SESSION, CRON_TIME_LOG_RANKING_REWARD,
  CRON_TIME_RESET_TIMES_BATTLE_PVE,
  CRON_TIME_UNLOCK_REWARD, CRON_TIME_UPDATE_POOL_REWARD_PVE
} from '../../server/constants';

const cron = require('node-cron');

export async function createCron() {
  try {
    cron.schedule(CRON_TIME, () => {
      HandleEventCron.createDataStart();
    });
  } catch (error) {
    logger.error('AMPQ: createWorkers initChannel error:');
    logger.error(error);
    throw error;
  }
}

export async function createCronGenerateSession() {
  try {
    HandleEventCron.createSession();
    cron.schedule(CRON_TIME_CREATE_SESSION, () => {
      HandleEventCron.createSession();
    });
  } catch (error) {
    logger.error('Error in createCronGenerateSession');
    logger.error(error);
    throw error;
  }
}

export async function createCronResetTimesBattle() {
  try {
    cron.schedule(CRON_TIME_RESET_TIMES_BATTLE_PVE, () => {
      HandleEventCron.resetTimesBattle();
    });
  } catch (error) {
    logger.error('Error in createCronResetTimesBattle');
    logger.error(error);
    throw error;
  }
}

export async function createCronUpdatePoolReward() {
  try {
    cron.schedule(CRON_TIME_UPDATE_POOL_REWARD_PVE, () => {
      HandleEventCron.updatePoolReward();
    });
  } catch (error) {
    logger.error('Error in createCronUpdatePoolReward');
    logger.error(error);
    throw error;
  }
}

export async function createCronLogReward() {
  try {
    cron.schedule(CRON_TIME_LOG_RANKING_REWARD, () => {
      HandleEventCron.logRankingReward();
    });
  } catch (error) {
    logger.error('Error in createCronLogReward');
    logger.error(error);
    throw error;
  }
}

// export async function createCronUnlockReward() {
//   try {
//     cron.schedule(CRON_TIME_UNLOCK_REWARD, () => {
//       HandleEventCron.unlockRewards();
//     });
//   } catch (error) {
//     logger.error('Error in createCronUnlockReward');
//     logger.error(error);
//     throw error;
//   }
// }

export async function syncDataReport() {
  try {
    await HandleEventCron.syncDataReport();
  } catch (error) {
    logger.error('error syncDataReport: ', error);
    logger.error(error);
    throw error;
  }
}
