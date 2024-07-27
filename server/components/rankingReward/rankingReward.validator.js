import { param, body, query } from 'express-validator';
import validatorErrorHandler from '../../api/validatorErrorHandler';


export const createRankingReward = [
  body('from').isInt({ min: 0 }).withMessage('from number must be a positive integer'),
  body('to').optional().isInt({ min: 0 }).withMessage('to number must be a positive integer'),
  body('reward').isInt({ min: 0 }).withMessage('to number must be a positive integer'),
  validatorErrorHandler,
];
