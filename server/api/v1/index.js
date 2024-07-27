import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import { Router } from 'express';
import { MORGAN_FORMAT } from '../../constants';
import swaggerSpecV1 from './docs';
import dragonRoute from '../../components/dragon/dragon.route';
import reportRoute from '../../components/report/report.route';
import eventRoute from '../../components/event/event.route';
import teamRoute from '../../components/team/team.route';
import userRoute from '../../components/user/user.route';
import adventureRoute from '../../components/adventure/adventure.route';
import battleHistoryRoute from '../../components/battleHistory/battleHistory.route';
import rankingRewardRoute from '../../components/rankingReward/rankingReward.route';
import rewardRoute from '../../components/reward/reward.route';
import configRoute from '../../components/config/config.route';
import giftRoute from '../../components/gift/gift.route';
import ticketRoute from '../../components/ticket/ticket.route';
import exportRoute from '../../components/exports/export.route';
import rankingHistoryRoute from '../../components/rankingHistory/rankingHistory.route';
import itemsRoute from '../../components/item/item.route';

const router = new Router();

router.use('/dragons', [dragonRoute]);
router.use('/reports', [reportRoute]);
router.use('/events', [eventRoute]);
router.use('/teams', [teamRoute]);
router.use('/users', [userRoute]);
router.use('/adventures', [adventureRoute]);
router.use('/battle-histories', [battleHistoryRoute]);
router.use('/ranking-rewards', [rankingRewardRoute]);
router.use('/rewards', [rewardRoute]);
router.use('/configs', [configRoute]);
router.use('/gifts', [giftRoute]);
router.use('/tickets', [ticketRoute]);
router.use('/exports', [exportRoute]);
router.use('/ranking-histories', [rankingHistoryRoute]);
router.use('/items', [itemsRoute]);

// Docs
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging') {
  router.use(morgan(MORGAN_FORMAT, {
    skip: (req, res) => {
      if (req.originalUrl.includes('api-docs')) {
        return true;
      }
      return res.statusCode < 400;
    },
    stream: process.stderr,
  }));
  router.use(morgan(MORGAN_FORMAT, {
    skip: (req, res) => {
      if (req.originalUrl.includes('api-docs')) {
        return true;
      }
      return res.statusCode >= 400;
    },
    stream: process.stdout,
  }));
  router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecV1));
} else {
  router.use(morgan(MORGAN_FORMAT, {
    skip: (req, res) => res.statusCode < 400,
    stream: process.stderr,
  }));
  router.use(morgan(MORGAN_FORMAT, {
    skip: (req, res) => res.statusCode >= 400,
    stream: process.stdout,
  }));
}

export default router;
