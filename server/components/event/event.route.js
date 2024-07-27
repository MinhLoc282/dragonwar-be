import { Router } from 'express';
import * as EventController from './event.controller';
import { isAuthorized } from '../../api/auth.middleware';
const router = new Router();

router.route('')
  .get(
    isAuthorized(),
    EventController.getEvents,
  );
router.route('/get-event-history-owner')
  .get(
    isAuthorized(),
    EventController.getEventsUser,
  );
router.route('/sync-data-rewardYY')
  .get(
    EventController.syncDataRewardYY,
  );
router.route('/dragons')
  .get(
    isAuthorized(true),
    EventController.getDragonOwner,
  );
router.route('/:id/dragons')
  .get(
    isAuthorized(true),
    EventController.getDragonByMonster,
  );
router.route('/:trxHash')
  .get(
    EventController.getEvent,
  );
export default router;
