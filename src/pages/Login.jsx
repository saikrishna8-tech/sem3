import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login(email, password);
      navigate(user.role === 'ADMIN' ? '/admin' : '/');
    } catch (err) {
      setError(err.message || 'Login failed. Check Gateway and Backend are running.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/20 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold-dark/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-card p-8 sm:p-10">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center justify-center mb-6">
              <Package className="h-10 w-10 text-gold" />
            </Link>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-sm font-semibold text-gold hover:text-gold-dark transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-3 pl-11 pr-12 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-3 rounded-xl text-lg font-bold mt-4">
              Sign In
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-slate-500 dark:text-slate-400">
            Demo: admin@aurabuy.com / admin123 (ADMIN) · user@aurabuy.com / user123 (USER)
          </p>

          <div className="mt-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-gold font-bold hover:text-gold-dark transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
