import { Router } from 'express';
import * as AdventureController from './adventure.controller';
import * as AdventureValidator from './adventure.validator';
import {isAuthorUser} from "../../api/auth.middleware";
import {USER_ROLE} from "../../constants";


const router = new Router();

router.route('/sync-boss')
  .get(
    AdventureController.syncBoss
  );

router.route('/')
  .get(
    AdventureController.getAdventures
  );

router.route('/admin')
  .get(
    isAuthorUser(USER_ROLE.ADMIN),
    AdventureController.adminGetAdventures
  );

router.route('/boss')
  .get(
    isAuthorUser(USER_ROLE.ADMIN),
    AdventureController.getBoss
  );

router.route('/boss/:id')
  .put(
    isAuthorUser(USER_ROLE.ADMIN),
    AdventureController.editBoss
  );

router.route('/:id')
  .get(
    AdventureController.getAdventure
  )
  .put(
    isAuthorUser(USER_ROLE.ADMIN),
    AdventureValidator.editAdventure,
    AdventureController.editAdventure
  );

export default router;
