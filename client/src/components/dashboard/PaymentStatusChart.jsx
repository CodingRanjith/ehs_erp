import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatStatus, formatCurrency, CHART_COLORS } from '../../utils/formatters.js';

const PaymentStatusChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    name: formatStatus(item.status),
    count: item.count,
    amount: item.amount,
    status: item.status,
  }));

  const hasData = chartData.some((item) => item.count > 0);

  return (
    <div className="auth-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Payment Status
      </h3>
      {!hasData ? (
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
          No payment data available
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value, name, props) => {
                  if (name === 'count') return [value, 'Payments'];
                  return [formatCurrency(value), 'Amount'];
                }}
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg, #fff)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.status}
                    fill={CHART_COLORS.payment[index % CHART_COLORS.payment.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PaymentStatusChart;
