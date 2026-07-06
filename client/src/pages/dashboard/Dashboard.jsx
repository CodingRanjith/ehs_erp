import { useDashboard } from '../../hooks/useDashboard.js';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import DashboardStats from '../../components/dashboard/DashboardStats.jsx';
import RevenueChart from '../../components/dashboard/RevenueChart.jsx';
import ProjectStatusChart from '../../components/dashboard/ProjectStatusChart.jsx';
import PaymentStatusChart from '../../components/dashboard/PaymentStatusChart.jsx';
import RecentEnquiriesTable from '../../components/dashboard/RecentEnquiriesTable.jsx';
import RecentProjectsTable from '../../components/dashboard/RecentProjectsTable.jsx';
import RecentActivities from '../../components/dashboard/RecentActivities.jsx';

const Dashboard = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboard();

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loader fullScreen text="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="auth-card p-12 text-center">
          <p className="text-red-500 mb-2">Failed to load dashboard</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {error?.message || 'Something went wrong'}
          </p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  const { stats, charts, recentEnquiries, recentProjects, recentActivities } = data;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Overview of your business operations
            </p>
          </div>
          {isFetching && !isLoading && (
            <span className="text-xs text-gray-400 animate-pulse">Refreshing...</span>
          )}
        </div>

        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart data={charts?.monthlyRevenue} />
          </div>
          <RecentActivities activities={recentActivities} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectStatusChart data={charts?.projectStatus} />
          <PaymentStatusChart data={charts?.paymentStatus} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <RecentEnquiriesTable enquiries={recentEnquiries} />
          <RecentProjectsTable projects={recentProjects} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
