import { body } from 'express-validator';
import validatorErrorHandler from '../../api/validatorErrorHandler';


export const editAdventure = [
  body('name').isLength({ min: 1, max: 100 }).withMessage('name cannot exceed 100 characters'),
  body('boss').isArray({ min: 3, max: 3 }).withMessage('boss must have 3 elements'),
  validatorErrorHandler,
];
