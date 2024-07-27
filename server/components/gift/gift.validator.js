import { param } from 'express-validator';
import validatorErrorHandler from '../../api/validatorErrorHandler';

export const openGift = [
  param('type').isLength({ min: 1 }).withMessage('Gift type is required'),
  validatorErrorHandler,
];
