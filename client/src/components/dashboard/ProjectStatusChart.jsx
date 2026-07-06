import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatStatus, CHART_COLORS } from '../../utils/formatters.js';

const ProjectStatusChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    name: formatStatus(item.status),
    value: item.count,
    status: item.status,
  }));

  const hasData = chartData.some((item) => item.value > 0);

  return (
    <div className="auth-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Project Status
      </h3>
      {!hasData ? (
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
          No project data available
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.status}
                    fill={CHART_COLORS.project[index % CHART_COLORS.project.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [value, 'Projects']}
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg, #fff)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ProjectStatusChart;
