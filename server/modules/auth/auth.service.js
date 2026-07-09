import ApiError from '../../utils/ApiError.js';
import { AUTH_MESSAGES } from '../../utils/constants.js';
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  hashToken,
  verifyRefreshToken,
} from '../../utils/generateToken.js';
import { comparePassword } from '../../utils/password.js';
import authRepository from './auth.repository.js';
import { sendPasswordResetEmail } from '../../services/email.service.js';

const sanitizeUser = (user) => authRepository.toApiUser(user);

class AuthService {
  async login({ email, password, rememberMe = false }) {
    const user = await authRepository.findByEmail(email, true);

    if (!user) {
      throw ApiError.unauthorized(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    if (!user.is_active) {
      throw ApiError.forbidden(AUTH_MESSAGES.ACCOUNT_INACTIVE);
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const userId = user.id;
    const tokenPayload = { id: userId, role: user.role, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload, rememberMe);

    await authRepository.updateRefreshToken(userId, refreshToken);
    await authRepository.updateLastLogin(userId);

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
      rememberMe,
    };
  }

  async logout(userId) {
    await authRepository.clearRefreshToken(userId);
    return true;
  }

  async getProfile(userId) {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw ApiError.notFound(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    return sanitizeUser(user);
  }

  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unauthorized(AUTH_MESSAGES.UNAUTHORIZED);
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized(AUTH_MESSAGES.TOKEN_INVALID);
    }

    const user = await authRepository.findById(decoded.id, true);

    if (!user || user.refresh_token !== refreshToken) {
      throw ApiError.unauthorized(AUTH_MESSAGES.TOKEN_INVALID);
    }

    if (!user.is_active) {
      throw ApiError.forbidden(AUTH_MESSAGES.ACCOUNT_INACTIVE);
    }

    const tokenPayload = { id: user.id, role: user.role, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);

    return { accessToken, user: sanitizeUser(user) };
  }

  async forgotPassword(email) {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      return { message: AUTH_MESSAGES.PASSWORD_RESET_SENT };
    }

    const { resetToken, hashedToken } = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await authRepository.setResetToken(user.id, hashedToken, expiresAt);
    await sendPasswordResetEmail(user.email, resetToken);

    return { message: AUTH_MESSAGES.PASSWORD_RESET_SENT };
  }

  async resetPassword({ token, password }) {
    const hashedToken = hashToken(token);
    const user = await authRepository.findByResetToken(hashedToken);

    if (!user) {
      throw ApiError.badRequest(AUTH_MESSAGES.INVALID_RESET_TOKEN);
    }

    await authRepository.updateById(user.id, {
      password,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      refreshToken: null,
    });

    return { message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS };
  }
}

export default new AuthService();
