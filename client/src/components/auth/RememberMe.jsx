const RememberMe = ({ checked, onChange, className = '' }) => {
  return (
    <label
      className={`inline-flex items-center gap-2 cursor-pointer select-none ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
      />
      <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
    </label>
  );
};

export default RememberMe;
