import { param } from 'express-validator';
import validatorErrorHandler from '../../api/validatorErrorHandler';


export const battleHistoryGetOne = [
  param('id').isMongoId().withMessage('Battle history id is invalid'),
  validatorErrorHandler,
];
