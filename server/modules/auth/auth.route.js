import { Router } from 'express';
import {
  login,
  logout,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
} from './auth.controller.js';
import {
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from './auth.validation.js';
import authenticate from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/login', loginValidation, login);
router.post('/logout', authenticate, logout);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);
router.get('/me', authenticate, getMe);
router.post('/refresh-token', refreshToken);

export default router;
