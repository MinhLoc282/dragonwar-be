import { Router } from 'express';
import * as ExportController from './export.controller';
import { isAuthorUser } from '../../api/auth.middleware';
import { USER_ROLE } from '../../constants';

const router = new Router();

router.route('/')
  .get(
    ExportController.getExports
  );


router.route('/export-pvp-reward')
  .post(
    isAuthorUser(USER_ROLE.ADMIN),
    ExportController.exportPvpRanking
  );

router.route('/export-pve-reward-per-month')
  .post(
    ExportController.exportRankingRewardPvE
  );

export default router;
