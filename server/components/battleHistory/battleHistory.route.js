import { Router } from 'express';
import { isAuthorUser } from '../../api/auth.middleware';
import * as BattleHistoryController from './battleHistory.controller';
import * as BattleHistoryValidator from './battleHistory.validator';
import { USER_ROLE } from '../../constants';

const router = new Router();

router.route('/')
  .get(
    isAuthorUser(),
    BattleHistoryController.getBattleHistories
  );

router.route('/admin')
  .get(
    isAuthorUser(USER_ROLE.ADMIN),
    BattleHistoryController.adminGetBattleHistories
  );

router.route('/current-arena')
  .get(
    isAuthorUser(),
    BattleHistoryController.getCurrentArena
  );

router.route('/:id')
  .get(
    isAuthorUser(),
    BattleHistoryValidator.battleHistoryGetOne,
    BattleHistoryController.getBattleHistory
  );

router.route('/:id/reward')
  .get(
    isAuthorUser(),
    BattleHistoryValidator.battleHistoryGetOne,
    BattleHistoryController.getAmountRewardByBattle
  );


export default router;
