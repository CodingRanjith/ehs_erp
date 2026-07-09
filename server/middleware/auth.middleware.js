import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import { AUTH_MESSAGES } from '../utils/constants.js';
import jwtConfig from '../config/jwt.js';
import authRepository from '../modules/auth/auth.repository.js';
import { asyncHandler } from '../utils/helper.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw ApiError.unauthorized(AUTH_MESSAGES.UNAUTHORIZED);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtConfig.access.secret);
    const user = await authRepository.findById(decoded.id);

    if (!user) {
      throw ApiError.unauthorized(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    if (!user.is_active) {
      throw ApiError.forbidden(AUTH_MESSAGES.ACCOUNT_INACTIVE);
    }

    req.user = authRepository.toApiUser(user);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized(AUTH_MESSAGES.TOKEN_EXPIRED);
    }
    if (error.name === 'JsonWebTokenError') {
      throw ApiError.unauthorized(AUTH_MESSAGES.TOKEN_INVALID);
    }
    throw error;
  }
});

export default authenticate;
