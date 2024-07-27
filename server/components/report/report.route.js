import { Router } from 'express';
import * as ReportController from './report.controller';
import {isAuthorUser} from "../../api/auth.middleware";
import {USER_ROLE} from "../../constants";

const router = new Router();

router.route('')
    .get(
      ReportController.getReports,
    );
router.route('/chart')
    .get(
      ReportController.getReportChart,
    );

router.route('/sync-report-duplicate-docs')
  .post(
    ReportController.syncReportDuplicateDocs
  );

router.route('/report-marketplace')
    .get(
      ReportController.getReportMarketplace,
    );
router.route('/report-marketplace/listed')
    .get(
      ReportController.getReportMarketplaceListed,
    );
router.route('/report-marketplace-items')
  .get(
    ReportController.getReportMarketplaceItems,
  );
router.route('/count-marketplace-items')
  .get(
    ReportController.getCountMarketplaceItems,
  );
router.route('/report-marketplace/sold')
    .get(
      ReportController.getReportMarketplaceSold,
    );
router.route('/report-event')
    .get(
      ReportController.getReportEvent,
    );
router.route('/sync-data')
    .get(
      ReportController.syncData,
    );

router.route('/battles')
  .get(
    ReportController.getReportBattles
  );

router.route('/admin/dashboard')
  .get(
    isAuthorUser(USER_ROLE.ADMIN),
    ReportController.adminGetDashboard
  );

router.route('/admin/battles')
  .get(
    isAuthorUser(USER_ROLE.ADMIN),
    ReportController.adminGetBattleReport
  );

export default router;
