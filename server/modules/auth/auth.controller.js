import ApiResponse from '../../utils/ApiResponse.js';
import { AUTH_MESSAGES, COOKIE_NAMES } from '../../utils/constants.js';
import { asyncHandler, validateRequest, getCookieOptions } from '../../utils/helper.js';
import { getUserId } from '../../utils/supabaseMapper.js';
import authService from './auth.service.js';

export const login = asyncHandler(async (req, res) => {
  validateRequest(req);

  const { email, password, rememberMe } = req.body;
  const result = await authService.login({ email, password, rememberMe });

  res.cookie(
    COOKIE_NAMES.REFRESH_TOKEN,
    result.refreshToken,
    getCookieOptions(rememberMe)
  );

  res.status(200).json(
    ApiResponse.success(200, AUTH_MESSAGES.LOGIN_SUCCESS, {
      user: result.user,
      accessToken: result.accessToken,
      rememberMe: result.rememberMe,
    })
  );
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await authService.logout(getUserId(req.user));
  }

  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  res.status(200).json(ApiResponse.success(200, AUTH_MESSAGES.LOGOUT_SUCCESS));
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(getUserId(req.user));
  res.status(200).json(ApiResponse.success(200, 'Profile fetched', { user }));
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];

  const result = await authService.refreshAccessToken(token);

  res.status(200).json(
    ApiResponse.success(200, 'Token refreshed', {
      accessToken: result.accessToken,
      user: result.user,
    })
  );
});

export const forgotPassword = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result = await authService.forgotPassword(req.body.email);

  res.status(200).json(ApiResponse.success(200, result.message));
});

export const resetPassword = asyncHandler(async (req, res) => {
  validateRequest(req);

  const { token, password } = req.body;
  const result = await authService.resetPassword({ token, password });

  res.status(200).json(ApiResponse.success(200, result.message));
});
