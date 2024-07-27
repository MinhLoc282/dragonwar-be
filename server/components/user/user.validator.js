import { param, body, query } from 'express-validator';
import validatorErrorHandler from '../../api/validatorErrorHandler';


export const userCreateValidator = [
  body('userName').isLength({ max: 100 }).withMessage('userName cannot exceed 100 characters'),
  body('address').isLength({ max: 100 }).withMessage('address cannot exceed 100 characters'),
  body('address').isLength({ min: 1 }).withMessage('address is required'),
  body('signer').isLength({ min: 1 }).withMessage('signer is required'),
  body('session').isLength({ min: 5, max: 5 }).withMessage('session is invalid'),
  validatorErrorHandler,
];

export const userUpdateValidator = [
  body('userName').optional().isLength({ min: 6, max: 64 }).withMessage('userName cannot exceed 64 characters'),
  body('fullName').optional().isLength({ min: 1, max: 64 }).withMessage('fullName cannot exceed 64 characters'),
  body('newPassword').optional().isLength({ max: 64 }).withMessage('password cannot exceed 64 characters'),
  body('newPassword').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validatorErrorHandler,
];

export const userLoginValidator = [
  body('address').optional().isLength({ min: 1 }).withMessage('address is required'),
  body('signer').optional().isLength({ min: 1 }).withMessage('signer is required'),
  body('session').optional().isLength({ min: 5, max: 5 }).withMessage('session is invalid'),
  validatorErrorHandler,
];

export const userGetByIdValidator = [
  param('id').isMongoId().withMessage('User id is invalid'),
  validatorErrorHandler,
];

export const getListValidator = [
  query('page').isInt().optional(),
  query('rowPerPage').isInt().optional(),
  validatorErrorHandler,
];
