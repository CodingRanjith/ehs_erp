import { Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import config from '../../config/env.js';

const SunIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

const AuthLayout = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 auth-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <div className="mb-8">
            <img
              src="/logo.png"
              alt="EHS Logo"
              className="h-16 w-auto mb-6 brightness-0 invert"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
              Easy Home Solutions
            </h1>
            <p className="text-xl text-blue-100 font-medium">ERP Management System</p>
          </div>
          <p className="text-blue-100 text-lg max-w-md leading-relaxed">
            Streamline your home improvement business with our comprehensive
            enterprise resource planning solution.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6 max-w-sm">
            {['Projects', 'Quotations', 'Materials', 'Workers'].map((item) => (
              <div key={item} className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <p className="font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -top-10 -left-10 w-60 h-60 bg-white/5 rounded-full" />
      </div>

      <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex justify-end p-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {config.appName}
              </h1>
            </div>
            <Outlet />
          </div>
        </div>

        <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Easy Home Solutions. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;
