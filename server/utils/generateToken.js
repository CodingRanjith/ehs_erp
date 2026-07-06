import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import jwtConfig from '../config/jwt.js';

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, jwtConfig.access.secret, {
    expiresIn: jwtConfig.access.expiresIn,
  });
};

export const generateRefreshToken = (payload, rememberMe = false) => {
  return jwt.sign(payload, jwtConfig.refresh.secret, {
    expiresIn: rememberMe
      ? jwtConfig.refresh.rememberExpiresIn
      : jwtConfig.refresh.expiresIn,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, jwtConfig.access.secret);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, jwtConfig.refresh.secret);
};

export const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  return { resetToken, hashedToken };
};

export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
