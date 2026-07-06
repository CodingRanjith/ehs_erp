import { Router } from 'express';
import authRoutes from '../modules/auth/auth.route.js';

const router = Router();

router.use('/auth', authRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EHS ERP API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
