import { param, body, query } from 'express-validator';
import validatorErrorHandler from '../../api/validatorErrorHandler';


export const teamCreateValidator = [
  body('name').isLength({ max: 100 }).withMessage('name cannot exceed 100 characters'),
  body('name').isLength({ min: 1 }).withMessage('name is required'),
  validatorErrorHandler,
];


export const teamUpdateValidator = [
  body('name').isLength({ max: 100 }).withMessage('name cannot exceed 100 characters'),
  validatorErrorHandler,
];


export const teamGetDetailValidator = [
  param('id').isMongoId().withMessage('Team id is invalid'),
  validatorErrorHandler,
];

export const addDefaultTeamValidator = [
  body('team').isMongoId().withMessage('Team id is invalid'),
  validatorErrorHandler
];
