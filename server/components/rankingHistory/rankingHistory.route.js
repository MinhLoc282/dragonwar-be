import { Router } from 'express';
import * as RankingHistoryController from "./rankingHistory.controller";
import {isAuthorUser} from "../../api/auth.middleware";
const router = new Router();

router.route('/')
  .get(
    isAuthorUser(),
    RankingHistoryController.getRankingHistory
  );

router.route('/overview')
  .get(
    RankingHistoryController.getOverviewHistory
  );

router.route('/sync-report')
  .get(
    RankingHistoryController.syncReportRanking
  );

export default router;
