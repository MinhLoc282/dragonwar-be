import Express from 'express';
import path from 'path';
import mongoose from 'mongoose';

import Redis from './util/Redis';
import app from './api/index';
import logger from './api/logger';
import {
  SERVER_PORT,
  MONGO_URI,
  USE_EXPRESS_HOST_STATIC_FILE
} from './config';
import { createQueueMintNFT, createQueueSocket } from '../rabbitmq';
import { generateConfig } from './components/config/config.service';
import { getRatioRewardPvE, getRatioRewardPvP } from './components/reward/reward.service';

(async () => {
  await createQueueSocket();
  await createQueueMintNFT();
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    logger.info('Mongodb connected');
    // comment clear redis
    // await Redis.flushDB();
    await getRatioRewardPvE();
    await getRatioRewardPvP();
    await generateConfig();
    if (USE_EXPRESS_HOST_STATIC_FILE === true) {
      app.use('/resource', Express.static(path.resolve(__dirname, '../resource')));
      app.use('/uploads', Express.static(path.resolve(__dirname, '../uploads')));
    }
    app.listen(SERVER_PORT, (error) => {
      if (error) {
        logger.error('Cannot start backend services:');
        logger.error(error);
      } else {
        logger.info(`Backend service is running on port: ${SERVER_PORT}${process.env.NODE_APP_INSTANCE ? ` on core ${process.env.NODE_APP_INSTANCE}` : ''}!`);
        logger.info(`API docs: http://localhost:${SERVER_PORT}/v1/api-docs`);
      }
    });
  } catch (error) {
    logger.error('Please make sure Mongodb is installed and running!');
    logger.error(error);
    throw error;
  }
})();
export default app;
