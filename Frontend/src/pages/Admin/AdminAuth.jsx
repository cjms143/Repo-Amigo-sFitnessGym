import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminAuth = () => {
  const navigate = useNavigate();
  const { login, register, loading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretKey: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (isLogin && (!formData.username || !formData.password)) {
      alert('Please fill in all required fields');
      return false;
    }
    if (!isLogin) {
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.secretKey) {
        alert('Please fill in all required fields');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL; 
      if (isLogin) {
        await login(formData.username, formData.password); 
      } else {
        await register(formData.username, formData.email, formData.password, formData.secretKey); 
      }
      navigate('/admin'); 
    } catch (err) {
      
      console.error('Authentication error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-neutral-800/50 p-8 rounded-2xl border border-[#bfa14a]/20 backdrop-blur-sm">
        <div>
          <h2 className="text-center text-3xl font-bold text-[#bfa14a] mb-2">
            Admin {isLogin ? 'Login' : 'Registration'}
          </h2>
          <p className="text-center text-neutral-400">
            {isLogin
              ? 'Sign in to access admin dashboard'
              : 'Create a new admin account'}
          </p>
          {error && (
            <p className="mt-2 text-center text-red-500 text-sm">
              {error}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bfa14a]">
                <FaEnvelope />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full pl-10 pr-4 py-3 bg-neutral-900/50 border border-[#bfa14a]/30 rounded-lg focus:outline-none focus:border-[#bfa14a] text-white placeholder-neutral-500 transition-colors"
                required
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bfa14a]">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-900/50 border border-[#bfa14a]/30 rounded-lg focus:outline-none focus:border-[#bfa14a] text-white placeholder-neutral-500 transition-colors"
                  required
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bfa14a]">
                <FaLock />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-12 py-3 bg-neutral-900/50 border border-[#bfa14a]/30 rounded-lg focus:outline-none focus:border-[#bfa14a] text-white placeholder-neutral-500 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bfa14a] hover:text-[#CDAC5A] transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {!isLogin && (
              <>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bfa14a]">
                    <FaLock />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full pl-10 pr-4 py-3 bg-neutral-900/50 border border-[#bfa14a]/30 rounded-lg focus:outline-none focus:border-[#bfa14a] text-white placeholder-neutral-500 transition-colors"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bfa14a]">
                    <FaKey />
                  </div>
                  <input
                    type="password"
                    name="secretKey"
                    value={formData.secretKey}
                    onChange={handleChange}
                    placeholder="Admin Secret Key"
                    className="w-full pl-10 pr-4 py-3 bg-neutral-900/50 border border-[#bfa14a]/30 rounded-lg focus:outline-none focus:border-[#bfa14a] text-white placeholder-neutral-500 transition-colors"
                    required
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 flex items-center justify-center gap-2 rounded-lg 
                bg-[#bfa14a] text-neutral-900 font-semibold transition-all duration-300
                hover:bg-[#CDAC5A] focus:outline-none focus:ring-2 focus:ring-[#bfa14a] focus:ring-offset-2 focus:ring-offset-neutral-900
                ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                <>{isLogin ? 'Sign In' : 'Create Account'}</>
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#bfa14a] hover:text-[#CDAC5A] transition-colors text-sm"
            >
              {isLogin
                ? "Don't have an admin account? Register"
                : 'Already have an account? Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;