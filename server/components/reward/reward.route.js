import { Router } from 'express';
import { isAuthorUser } from '../../api/auth.middleware';
import * as RewardController from './reward.controller';
import * as RewardValidator from './reward.validator';
import { USER_ROLE } from '../../constants';

const router = new Router();


router.route('/claim-token')
  .post(
    isAuthorUser(),
    RewardValidator.requestClaimToken,
    RewardController.claimToken
  );

router.route('/pool-reward')
  .get(
    RewardController.getPoolReward
  );

router.route('/ranking-reward-pve')
  .get(
    isAuthorUser(),
    RewardController.getRankingRewardPvE
  );


router.route('/admin')
  .get(
    isAuthorUser(USER_ROLE.ADMIN),
    RewardController.adminGetRewards
  );

router.route('/battle/:id')
  .get(
    isAuthorUser(),
    RewardController.getRewardBattle
  );

export default router;
