import { formatDate, formatStatus, STATUS_COLORS } from '../../utils/formatters.js';

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      STATUS_COLORS[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }`}
  >
    {formatStatus(status)}
  </span>
);

const RecentEnquiriesTable = ({ enquiries = [] }) => {
  return (
    <div className="auth-card overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Enquiries
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50">
              <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Enquiry #</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Customer</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Source</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No enquiries found
                </td>
              </tr>
            ) : (
              enquiries.map((enquiry) => (
                <tr key={enquiry._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                    {enquiry.enquiryNumber}
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-300">
                    {enquiry.customerName}
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-300">
                    {enquiry.source || '-'}
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge status={enquiry.status} />
                  </td>
                  <td className="px-6 py-3 text-gray-500 dark:text-gray-400">
                    {formatDate(enquiry.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentEnquiriesTable;
