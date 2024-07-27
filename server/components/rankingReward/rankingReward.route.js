import { Router } from 'express';
import * as RankingRewardController from './rankingReward.controller';
import * as RankingRewardValidator from './rankingReward.validator';
import { isAuthorUser } from '../../api/auth.middleware';
import { USER_ROLE } from '../../constants';

const router = new Router();

router.route('/')
  .get(
    RankingRewardController.getRankingReward
  )
  .post(
    isAuthorUser(USER_ROLE.ADMIN),
    RankingRewardValidator.createRankingReward,
    RankingRewardController.createRankingReward
  );

router.route('/initial')
  .post(
    isAuthorUser(USER_ROLE.ADMIN),
    RankingRewardController.initialRankingReward
  );

router.route('/initial-ranking-user')
  .post(
    isAuthorUser(USER_ROLE.ADMIN),
    RankingRewardController.initialRankingUser
  );

router.route('/ranking-user')
  .get(
    RankingRewardController.getRankingUser
  );

router.route('/:id')
  .get(
    RankingRewardController.getRankingRewardById
  )
  .put(
    isAuthorUser(USER_ROLE.ADMIN),
    RankingRewardValidator.createRankingReward,
    RankingRewardController.updateRankingReward
  )
  .delete(
    isAuthorUser(USER_ROLE.ADMIN),
    RankingRewardController.deleteRankingReward
  );

router.route('/ranking-user/:id')
  .put(
    isAuthorUser(USER_ROLE.ADMIN),
    RankingRewardController.updateRankingUser
  )

export default router;
