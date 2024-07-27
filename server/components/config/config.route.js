import { Router } from 'express';
import * as ConfigController from './config.controller';
import {isAuthorUser} from "../../api/auth.middleware";
import {USER_ROLE} from "../../constants";

const router = new Router();

router.route('/')
  .get(
    ConfigController.getConfigs
  )
  .put(
    isAuthorUser(USER_ROLE.ADMIN),
    ConfigController.editConfigs
  );

export default router;
