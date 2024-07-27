import { Router } from 'express';
import * as GiftController from './gift.controller';
import { isAuthorized, isAuthorUser } from '../../api/auth.middleware';
import * as GiftValidator from './gift.validator';

const router = new Router();

router.route('/')
  .get(
    isAuthorUser(),
    GiftController.getGifts
  );

router.route('/list')
  .get(
    isAuthorized(true),
    GiftController.getGiftsForWeb
    );

router.route('/open/:type')
  .post(
    isAuthorUser(),
    GiftValidator.openGift,
    GiftController.openGift
  );

router.route('/open-gift/:type')
  .post(
    isAuthorized(true),
    GiftValidator.openGift,
    GiftController.openGiftForWeb
  );

export default router;
