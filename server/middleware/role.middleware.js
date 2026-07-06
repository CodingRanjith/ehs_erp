import ApiError from '../utils/ApiError.js';
import { AUTH_MESSAGES } from '../utils/constants.js';

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized(AUTH_MESSAGES.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden(AUTH_MESSAGES.FORBIDDEN));
    }

    next();
  };
};

export default authorize;
