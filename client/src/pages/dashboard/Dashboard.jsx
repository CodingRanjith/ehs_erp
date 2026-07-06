import { useAuth } from '../../hooks/useAuth.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import { ROLE_LABELS } from '../../constants/roles.js';
import Button from '../../components/common/Button.jsx';

const Dashboard = () => {
  const { user, logout, isLoading } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Easy Home Solutions ERP
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <Button variant="outline" onClick={handleLogout} isLoading={isLoading}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="auth-card p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome, {user?.name}!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You are logged in as{' '}
            <span className="font-medium text-primary-600 dark:text-primary-400">
              {ROLE_LABELS[user?.role] || user?.role}
            </span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Projects', 'Enquiries', 'Quotations', 'Materials'].map((module) => (
              <div
                key={module}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
              >
                <p className="font-medium text-gray-900 dark:text-white">{module}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Coming soon</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
