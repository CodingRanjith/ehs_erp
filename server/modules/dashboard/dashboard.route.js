import { Router } from 'express';
import {
  getDashboard,
  getDashboardOverview,
  getDashboardCharts,
  getDashboardRecent,
} from './dashboard.controller.js';
import authenticate from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getDashboard);
router.get('/overview', getDashboardOverview);
router.get('/charts', getDashboardCharts);
router.get('/recent', getDashboardRecent);

export default router;
