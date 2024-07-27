import { Router } from 'express';
import * as UserController from './user.controller';
import * as UserMulter from './user.multer';
import * as UserValidator from './user.validator';
import { isAuthorUser } from '../../api/auth.middleware';
import { USER_ROLE } from '../../constants';


const router = new Router();

router.route('/')
  .post(
    UserMulter.userProfileUploader,
    UserValidator.userCreateValidator,
    UserController.createUser
  )
  .get(
    isAuthorUser(USER_ROLE.ADMIN),
    UserValidator.getListValidator,
    UserController.getUsers
  )
  .put(
    isAuthorUser(),
    UserMulter.userProfileUploader,
    UserValidator.userUpdateValidator,
    UserController.editUser
  );

router.route('/session')
  .get(
    UserController.getSession
  );

router.route('/auth')
  .post(
    UserValidator.userLoginValidator,
    UserController.login
  );

router.route('/me')
  .get(
    isAuthorUser(),
    UserController.getMe
  );

router.route('/balance-fluctuations')
  .get(
    isAuthorUser(),
    UserValidator.getListValidator,
    UserController.getBalanceFluctuation
  );

router.route('/daily-checkin')
  .post(
    isAuthorUser(),
    UserController.dailyCheckin
  );

router.route('/generate-whitelist')
  .get(
    UserController.generateWhitelist
  );

router.route('/add-whitelist')
  .post(
    isAuthorUser(USER_ROLE.ADMIN),
    UserController.addWhitelist
  );

router.route('/:id')
  .get(
    isAuthorUser(USER_ROLE.ADMIN),
    UserValidator.userGetByIdValidator,
    UserController.getUserById
  );

router.route('/admin/auth')
  .post(
    UserValidator.userLoginValidator,
    UserController.loginAdmin
  );

router.route('/game/:id')
  .get(
    UserController.gameGetUserById
  );

export default router;
