import supabase from '../../config/supabase.js';
import { TABLES } from './dashboard.models.js';
import {
  PROJECT_STATUS,
  PAYMENT_STATUS,
  WORKER_STATUS,
} from './dashboard.constants.js';
import { mapRowToApi, mapRowsToApi, throwIfSupabaseError } from '../../utils/supabaseMapper.js';

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
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

const countRows = async (table, filters = []) => {
  let query = supabase.from(table).select('*', { count: 'exact', head: true });

  filters.forEach(({ method, column, value }) => {
    query = query[method](column, value);
  });

  const { count, error } = await query;
  throwIfSupabaseError(error, `Failed to count ${table}`);
  return count || 0;
};

const sumColumn = (rows, column) =>
  rows.reduce((total, row) => total + Number(row[column] || 0), 0);

class DashboardRepository {
  async getOverviewStats() {
    const { start, end } = getTodayRange();
    const pendingStatuses = [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.PARTIAL, PAYMENT_STATUS.OVERDUE];

    const [
      totalEnquiries,
      activeProjects,
      completedProjects,
      pendingPayments,
      todaysSiteVisits,
      workersAvailable,
      materials,
      paidPayments,
    ] = await Promise.all([
      countRows(TABLES.ENQUIRIES),
      countRows(TABLES.PROJECTS, [{ method: 'eq', column: 'status', value: PROJECT_STATUS.ACTIVE }]),
      countRows(TABLES.PROJECTS, [{ method: 'eq', column: 'status', value: PROJECT_STATUS.COMPLETED }]),
      countRows(TABLES.PAYMENTS, [{ method: 'in', column: 'status', value: pendingStatuses }]),
      countRows(TABLES.ENQUIRIES, [
        { method: 'gte', column: 'site_visit_date', value: start },
        { method: 'lte', column: 'site_visit_date', value: end },
      ]),
      countRows(TABLES.WORKERS, [{ method: 'eq', column: 'status', value: WORKER_STATUS.AVAILABLE }]),
      supabase.from(TABLES.MATERIALS).select('quantity, min_stock_level'),
      supabase
        .from(TABLES.PAYMENTS)
        .select('paid_amount')
        .eq('status', PAYMENT_STATUS.PAID),
    ]);

    throwIfSupabaseError(materials.error, 'Failed to fetch materials');
    throwIfSupabaseError(paidPayments.error, 'Failed to fetch paid payments');

    const materialsLowStock = (materials.data || []).filter(
      (item) => Number(item.quantity) <= Number(item.min_stock_level)
    ).length;

    const revenue = sumColumn(paidPayments.data || [], 'paid_amount');

    return {
      totalEnquiries,
      activeProjects,
      completedProjects,
      pendingPayments,
      todaysSiteVisits,
      workersAvailable,
      materialsLowStock,
      revenue,
    };
  }

  async getMonthlyRevenue(months = 6) {
    const monthRange = getLastNMonths(months);
    const startDate = new Date(monthRange[0].year, monthRange[0].month - 1, 1).toISOString();

    const { data, error } = await supabase
      .from(TABLES.PAYMENTS)
      .select('paid_amount, paid_date')
      .eq('status', PAYMENT_STATUS.PAID)
      .gte('paid_date', startDate);

    throwIfSupabaseError(error, 'Failed to fetch monthly revenue');

    const revenueMap = new Map();

    (data || []).forEach((payment) => {
      if (!payment.paid_date) return;
      const paidDate = new Date(payment.paid_date);
      const key = `${paidDate.getFullYear()}-${paidDate.getMonth() + 1}`;
      revenueMap.set(key, (revenueMap.get(key) || 0) + Number(payment.paid_amount || 0));
    });

    return monthRange.map(({ year, month, label }) => ({
      month: label,
      revenue: revenueMap.get(`${year}-${month}`) || 0,
    }));
  }

  async getProjectStatusChart() {
    const { data, error } = await supabase.from(TABLES.PROJECTS).select('status');
    throwIfSupabaseError(error, 'Failed to fetch project status chart');

    const statusMap = new Map();
    (data || []).forEach((project) => {
      statusMap.set(project.status, (statusMap.get(project.status) || 0) + 1);
    });

    return Array.from(statusMap.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);
  }

  async getPaymentStatusChart() {
    const { data, error } = await supabase.from(TABLES.PAYMENTS).select('status, amount');
    throwIfSupabaseError(error, 'Failed to fetch payment status chart');

    const statusMap = new Map();
    (data || []).forEach((payment) => {
      const current = statusMap.get(payment.status) || { count: 0, amount: 0 };
      current.count += 1;
      current.amount += Number(payment.amount || 0);
      statusMap.set(payment.status, current);
    });

    return Array.from(statusMap.entries())
      .map(([status, values]) => ({ status, count: values.count, amount: values.amount }))
      .sort((a, b) => b.count - a.count);
  }

  async getRecentEnquiries(limit = 5) {
    const { data, error } = await supabase
      .from(TABLES.ENQUIRIES)
      .select('id, enquiry_number, customer_name, phone, status, source, site_visit_date, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    throwIfSupabaseError(error, 'Failed to fetch recent enquiries');
    return mapRowsToApi(data);
  }

  async getRecentProjects(limit = 5) {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .select('id, project_number, title, customer_name, status, estimated_value, start_date, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    throwIfSupabaseError(error, 'Failed to fetch recent projects');
    return mapRowsToApi(data);
  }

  async getRecentActivities(limit = 10) {
    const { data, error } = await supabase
      .from(TABLES.ACTIVITIES)
      .select('id, type, title, description, module, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    throwIfSupabaseError(error, 'Failed to fetch recent activities');

    if ((data || []).length > 0) {
      return mapRowsToApi(data);
    }

    const [recentEnquiries, recentProjects, recentPayments] = await Promise.all([
      this.getRecentEnquiries(4),
      this.getRecentProjects(3),
      supabase
        .from(TABLES.PAYMENTS)
        .select('id, payment_number, amount, status, created_at')
        .order('created_at', { ascending: false })
        .limit(3),
    ]);

    throwIfSupabaseError(recentPayments.error, 'Failed to fetch recent payments');

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
      ...mapRowsToApi(recentPayments.data).map((pay) => ({
        _id: pay._id,
        type: 'payment',
        title: `Payment ${pay.paymentNumber}`,
        description: `₹${Number(pay.amount || 0).toLocaleString('en-IN')} - ${pay.status}`,
        module: 'payment',
        createdAt: pay.createdAt,
      })),
    ];

    return derived
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  async getPendingPaymentsAmount() {
    const { data, error } = await supabase
      .from(TABLES.PAYMENTS)
      .select('amount, paid_amount, status')
      .in('status', [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.PARTIAL, PAYMENT_STATUS.OVERDUE]);

    throwIfSupabaseError(error, 'Failed to fetch pending payments amount');

    return (data || []).reduce(
      (total, payment) => total + (Number(payment.amount || 0) - Number(payment.paid_amount || 0)),
      0
    );
  }
}

export default new DashboardRepository();
