import { api } from '../api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIoT } from '../context/IoTContext';
import OliveLogo from '../components/OliveLogo';
import { Mail, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';

const Login = () => {
  const { login } = useIoT();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanEmail = email.trim().toLowerCase();

      // Call the backend login API endpoint
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, password })
      });

      // Save token and user details to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Update global context state if available and navigate
      if (login) {
        login(data.user.email, data.user.role);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotModal(false);
      setForgotEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background-warm flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-5xl bg-background-lowest rounded-2xl shadow-stitch border border-outline/10 overflow-hidden grid grid-cols-1 md:grid-cols-12">

        {/* Left Side: Branding and Info */}
        <div className="md:col-span-5 bg-gradient-to-br from-primary to-primary-container p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-10 w-60 h-60 rounded-full bg-white/5" />

          <div className="relative">
            <div className="flex flex-col items-start mb-6 bg-white p-4 rounded-stitch border border-white/20 shadow-sm w-fit">
              <OliveLogo className="w-28 h-auto" />
              <span className="text-[8px] uppercase tracking-widest text-[#00600a] font-bold mt-1.5 block">Enterprise System</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold leading-tight mt-10">
              Rooted Warmth in Industrial Monitoring
            </h1>
            <p className="text-sm text-white/80 mt-4 leading-relaxed font-medium">
              A comprehensive Multi-User IoT Platform managing real-time power consumption, energy efficiency indexes, panel loads, and automatic grid fail-safes.
            </p>
          </div>

          <div className="mt-12 md:mt-0 relative border-t border-white/20 pt-6">
            <p className="text-xs text-white/70 font-semibold">
              OliveIoT Innovations Private Limited
            </p>
            <p className="text-[10px] text-white/50 mt-1">
              Chennai, Tamil Nadu, India
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-main">Welcome Back</h2>
            <p className="text-sm text-text-muted mt-1 font-medium">
              Access the industrial energy telemetry console. Please sign in with your corporate email.
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-stitch bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-background-container border border-outline/10 rounded-stitch text-sm text-text-main placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-background-container border border-outline/10 rounded-stitch text-sm text-text-main placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-outline/20 text-primary focus:ring-primary"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-semibold text-text-muted">
                  Keep me signed in
                </label>
              </div>

              <button
                type="button"
                onClick={() => { setShowForgotModal(true); setForgotSuccess(false); }}
                className="text-xs font-bold text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-stitch font-bold text-sm shadow-md hover:bg-primary/95 hover:shadow-lg transition-all duration-200 mt-6 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-main/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-background-lowest rounded-2xl shadow-stitch border border-outline/10 p-6 sm:p-8 relative">
            <h3 className="font-serif text-xl font-bold text-text-main mb-2">Reset Password</h3>
            <p className="text-xs text-text-muted mb-6">
              Enter your corporate email address. If an account exists in our system, we'll transmit a passcode reset token.
            </p>

            {forgotSuccess ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-primary mb-3 animate-bounce" />
                <h4 className="text-sm font-bold text-text-main">Reset Link Dispatched</h4>
                <p className="text-xs text-text-muted mt-1">Check your inbox. Redirecting shortly...</p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="email@company.com"
                    className="w-full px-4 py-2.5 bg-background-container border border-outline/10 rounded-stitch text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 text-xs font-bold text-text-muted bg-background-container border border-outline/10 rounded-stitch hover:bg-background-high transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-primary rounded-stitch shadow hover:bg-primary/95 transition-colors"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;