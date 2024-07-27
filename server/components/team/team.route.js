import { Router } from 'express';
import * as TeamController from './team.controller';
import * as TeamValidator from './team.validator';
import { isAuthorUser } from '../../api/auth.middleware';
import { USER_ROLE } from '../../constants';
import { addDefaultTeamValidator } from './team.validator';

const router = new Router();

router.route('')
  .get(
    isAuthorUser(),
    TeamController.getTeams,
  );

router.route('')
  .post(
    isAuthorUser(),
    TeamValidator.teamCreateValidator,
    TeamController.createTeam,
  );

router.route('/ranking')
  .get(
    isAuthorUser(),
    TeamController.getRanks
  );

router.route('/admin')
  .get(
    isAuthorUser(USER_ROLE.ADMIN),
    TeamController.adminGetListTeams
  );

router.route('/available-default-teams')
  .get(
    TeamController.getAvailableDefaultTeam
  );

router.route('/default')
  .post(
    TeamValidator.addDefaultTeamValidator,
    isAuthorUser(USER_ROLE.ADMIN),
    TeamController.addDefaultTeam
  )
  .get(
    isAuthorUser(USER_ROLE.ADMIN),
    TeamController.getDefaultTeams
  );

router.route('/default/:id')
  .put(
    TeamValidator.teamGetDetailValidator,
    isAuthorUser(USER_ROLE.ADMIN),
    TeamController.editDefaultTeam
  )
  .delete(
    isAuthorUser(USER_ROLE.ADMIN),
    TeamController.deleteDefaultTeam
  );

router.route('/detail/:id')
  .get(
    isAuthorUser(),
    TeamValidator.teamGetDetailValidator,
    TeamController.getDetailTeam,
  );

router.route('/:id')
  .put(
    isAuthorUser(),
    TeamValidator.teamUpdateValidator,
    TeamController.updateTeam,
  );

router.route('/:id')
  .get(
    TeamValidator.teamGetDetailValidator,
    TeamController.getTeam,
  );


router.route('/:id')
  .delete(
    isAuthorUser(),
    TeamController.deleteTeam,
  );

export default router;
