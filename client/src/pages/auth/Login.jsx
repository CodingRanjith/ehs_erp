import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoginForm from '../../components/auth/LoginForm.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { ROLE_LABELS } from '../../constants/roles.js';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, getDashboardRoute } = useAuth();

  const from = location.state?.from?.pathname || null;

  const handleLogin = async (data) => {
    const result = await login({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    });

    if (result.success) {
      const roleLabel = ROLE_LABELS[result.user.role] || result.user.role;
      toast.success(`Welcome back, ${result.user.name}! (${roleLabel})`);
      navigate(from || getDashboardRoute(), { replace: true });
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  return (
    <div className="auth-card p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Sign in to your account to continue
        </p>
      </div>
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
    </div>
  );
};

export default Login;
