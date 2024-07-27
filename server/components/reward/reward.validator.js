import { body } from 'express-validator';
import validatorErrorHandler from '../../api/validatorErrorHandler';


export const requestClaimToken = [
  body('amount').isNumeric(),
  validatorErrorHandler,
];
