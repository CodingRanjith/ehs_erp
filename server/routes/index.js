import { Router } from 'express';
import authRoutes from '../modules/auth/auth.route.js';
import dashboardRoutes from '../modules/dashboard/dashboard.route.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EHS ERP API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
