import { Router } from 'express';
import * as ItemController from './item.controllder';
import { isAuthorUser } from '../../api/auth.middleware';

const router = new Router();

router.route('/')
  .get(
    ItemController.getItems
  );

router.route('/pending-items')
  .get(
    isAuthorUser(),
    ItemController.getMintingItem
  );

router.route('/sync-equipments')
  .post(
    ItemController.syncEquipments
  );

router.route('/equipments')
  .get(
    ItemController.getEquipments
  );

router.route('/sync-pending-items')
  .post(
    ItemController.syncPendingItems
  );

router.route('/mint-item-test')
  .post(
    ItemController.mintItemTest
  );


router.route('/upgrade-success-rate')
  .get(
    ItemController.upgradeSuccessRate
  );

router.route('/:type/:id')
  .get(
    ItemController.getItem
  );

router.route('/migrate/:type/:id')
  .get(
    ItemController.migrateItem
  );

router.route('/histories/:type/:id')
  .get(
    ItemController.getItemHistories
  );

export default router;
