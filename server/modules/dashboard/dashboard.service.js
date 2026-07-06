import dashboardRepository from './dashboard.repository.js';

class DashboardService {
  async getDashboardData() {
    const [
      stats,
      monthlyRevenue,
      projectStatus,
      paymentStatus,
      recentEnquiries,
      recentProjects,
      recentActivities,
      pendingPaymentsAmount,
    ] = await Promise.all([
      dashboardRepository.getOverviewStats(),
      dashboardRepository.getMonthlyRevenue(6),
      dashboardRepository.getProjectStatusChart(),
      dashboardRepository.getPaymentStatusChart(),
      dashboardRepository.getRecentEnquiries(5),
      dashboardRepository.getRecentProjects(5),
      dashboardRepository.getRecentActivities(10),
      dashboardRepository.getPendingPaymentsAmount(),
    ]);

    return {
      stats: {
        ...stats,
        pendingPaymentsAmount,
      },
      charts: {
        monthlyRevenue,
        projectStatus,
        paymentStatus,
      },
      recentEnquiries,
      recentProjects,
      recentActivities,
    };
  }

  async getOverview() {
    const stats = await dashboardRepository.getOverviewStats();
    const pendingPaymentsAmount = await dashboardRepository.getPendingPaymentsAmount();
    return { ...stats, pendingPaymentsAmount };
  }

  async getCharts() {
    const [monthlyRevenue, projectStatus, paymentStatus] = await Promise.all([
      dashboardRepository.getMonthlyRevenue(6),
      dashboardRepository.getProjectStatusChart(),
      dashboardRepository.getPaymentStatusChart(),
    ]);

    return { monthlyRevenue, projectStatus, paymentStatus };
  }

  async getRecent() {
    const [recentEnquiries, recentProjects, recentActivities] = await Promise.all([
      dashboardRepository.getRecentEnquiries(5),
      dashboardRepository.getRecentProjects(5),
      dashboardRepository.getRecentActivities(10),
    ]);

    return { recentEnquiries, recentProjects, recentActivities };
  }
}

export default new DashboardService();
