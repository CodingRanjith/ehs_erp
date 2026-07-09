import { validationResult } from 'express-validator';
import ApiError from './ApiError.js';
import { mapUserToApi } from './supabaseMapper.js';

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const validateRequest = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    throw ApiError.badRequest('Validation failed', formattedErrors);
  }
};

export const sanitizeUser = (user) => {
  if (!user) return null;
  return mapUserToApi(user);
};

export const getCookieOptions = (rememberMe = false) => {
  const maxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000
    : 7 * 24 * 60 * 60 * 1000;

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge,
    path: '/',
  };
};
