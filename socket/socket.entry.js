import mongoose from 'mongoose';
import logger from '../server/util/logger';
import { MONGO_URI } from '../server/config';
import { theSubscriptionKai } from '../server/web3/kai/readContract/kai';
import { createQueue } from '../rabbitmq';

(async () => {
  await createQueue();
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    logger.info('Mongodb connected');
    theSubscriptionKai().then(() => {
      console.log('Listening the transfer event');
    }).catch((listenError) => {
      console.log('Listening the transfer event error:');
      console.log(listenError);
    });
  } catch (error) {
    logger.error('Please make sure Mongodb is installed and running!');
    throw error;
  }
})();
