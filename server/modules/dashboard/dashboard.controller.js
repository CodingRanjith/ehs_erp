import ApiResponse from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/helper.js';
import dashboardService from './dashboard.service.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardData();

  res.status(200).json(
    ApiResponse.success(200, 'Dashboard data fetched successfully', data)
  );
});

export const getDashboardOverview = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getOverview();

  res.status(200).json(
    ApiResponse.success(200, 'Dashboard overview fetched successfully', { stats })
  );
});

export const getDashboardCharts = asyncHandler(async (req, res) => {
  const charts = await dashboardService.getCharts();

  res.status(200).json(
    ApiResponse.success(200, 'Dashboard charts fetched successfully', { charts })
  );
});

export const getDashboardRecent = asyncHandler(async (req, res) => {
  const recent = await dashboardService.getRecent();

  res.status(200).json(
    ApiResponse.success(200, 'Recent dashboard data fetched successfully', recent)
  );
});
