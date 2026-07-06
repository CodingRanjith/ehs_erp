import {
  Enquiry,
  Project,
  Payment,
  Material,
  Worker,
  Activity,
} from './dashboard.models.js';
import {
  PROJECT_STATUS,
  PAYMENT_STATUS,
  WORKER_STATUS,
} from './dashboard.constants.js';

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const getLastNMonths = (months = 6) => {
  const result = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      label: date.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
    });
  }
  return result;
};

class DashboardRepository {
  async getOverviewStats() {
    const { start: todayStart, end: todayEnd } = getTodayRange();

    const [
      totalEnquiries,
      activeProjects,
      completedProjects,
      pendingPayments,
      todaysSiteVisits,
      workersAvailable,
      materialsLowStock,
      revenueResult,
    ] = await Promise.all([
      Enquiry.countDocuments(),
      Project.countDocuments({ status: PROJECT_STATUS.ACTIVE }),
      Project.countDocuments({ status: PROJECT_STATUS.COMPLETED }),
      Payment.countDocuments({
        status: { $in: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.PARTIAL, PAYMENT_STATUS.OVERDUE] },
      }),
      Enquiry.countDocuments({
        siteVisitDate: { $gte: todayStart, $lte: todayEnd },
      }),
      Worker.countDocuments({ status: WORKER_STATUS.AVAILABLE }),
      Material.countDocuments({
        $expr: { $lte: ['$quantity', '$minStockLevel'] },
      }),
      Payment.aggregate([
        { $match: { status: PAYMENT_STATUS.PAID } },
        { $group: { _id: null, total: { $sum: '$paidAmount' } } },
      ]),
    ]);

    return {
      totalEnquiries,
      activeProjects,
      completedProjects,
      pendingPayments,
      todaysSiteVisits,
      workersAvailable,
      materialsLowStock,
      revenue: revenueResult[0]?.total || 0,
    };
  }

  async getMonthlyRevenue(months = 6) {
    const monthRange = getLastNMonths(months);
    const startDate = new Date(monthRange[0].year, monthRange[0].month - 1, 1);

    const revenueData = await Payment.aggregate([
      {
        $match: {
          status: PAYMENT_STATUS.PAID,
          paidDate: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$paidDate' },
            month: { $month: '$paidDate' },
          },
          revenue: { $sum: '$paidAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const revenueMap = new Map(
      revenueData.map((item) => [
        `${item._id.year}-${item._id.month}`,
        item.revenue,
      ])
    );

    return monthRange.map(({ year, month, label }) => ({
      month: label,
      revenue: revenueMap.get(`${year}-${month}`) || 0,
    }));
  }

  async getProjectStatusChart() {
    const data = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return data.map((item) => ({
      status: item._id,
      count: item.count,
    }));
  }

  async getPaymentStatusChart() {
    const data = await Payment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          amount: { $sum: '$amount' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return data.map((item) => ({
      status: item._id,
      count: item.count,
      amount: item.amount,
    }));
  }

  async getRecentEnquiries(limit = 5) {
    return Enquiry.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('enquiryNumber customerName phone status source siteVisitDate createdAt')
      .lean();
  }

  async getRecentProjects(limit = 5) {
    return Project.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('projectNumber title customerName status estimatedValue startDate createdAt')
      .lean();
  }

  async getRecentActivities(limit = 10) {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('type title description module createdAt')
      .lean();

    if (activities.length > 0) {
      return activities;
    }

    const [recentEnquiries, recentProjects, recentPayments] = await Promise.all([
      Enquiry.find()
        .sort({ createdAt: -1 })
        .limit(4)
        .select('enquiryNumber customerName status createdAt')
        .lean(),
      Project.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select('projectNumber title status createdAt')
        .lean(),
      Payment.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select('paymentNumber amount status createdAt')
        .lean(),
    ]);

    const derived = [
      ...recentEnquiries.map((e) => ({
        _id: e._id,
        type: 'enquiry',
        title: `New enquiry ${e.enquiryNumber}`,
        description: `${e.customerName} - ${e.status}`,
        module: 'enquiry',
        createdAt: e.createdAt,
      })),
      ...recentProjects.map((p) => ({
        _id: p._id,
        type: 'project',
        title: `Project ${p.projectNumber}`,
        description: `${p.title} - ${p.status}`,
        module: 'project',
        createdAt: p.createdAt,
      })),
      ...recentPayments.map((pay) => ({
        _id: pay._id,
        type: 'payment',
        title: `Payment ${pay.paymentNumber}`,
        description: `₹${pay.amount?.toLocaleString('en-IN')} - ${pay.status}`,
        module: 'payment',
        createdAt: pay.createdAt,
      })),
    ];

    return derived
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  async getPendingPaymentsAmount() {
    const result = await Payment.aggregate([
      {
        $match: {
          status: { $in: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.PARTIAL, PAYMENT_STATUS.OVERDUE] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $subtract: ['$amount', '$paidAmount'] } },
        },
      },
    ]);

    return result[0]?.total || 0;
  }
}

export default new DashboardRepository();
