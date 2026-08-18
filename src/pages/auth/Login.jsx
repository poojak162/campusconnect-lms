import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Shield, KeyRound, Mail, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

export default function Login() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('student@campusconnect.demo');
  const [password, setPassword] = useState('student123');
  const [errorMessage, setErrorMessage] = useState('');

  // If already authenticated, redirect immediately to role dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'student') {
        navigate('/student/dashboard', { replace: true });
      } else if (user.role === 'faculty') {
        navigate('/faculty/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const sessionUser = login(email, password);
      if (sessionUser.role === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/faculty/dashboard');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid login credentials');
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-200">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">CampusConnect LMS</h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Academic Learning Platform for Students & Faculty
          </p>
        </div>

        {/* Login Card */}
        <div className="card-clean p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 text-center">Sign In to Your Account</h2>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campusconnect.demo"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Credentials Quick Fill Pills */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Demo Credentials (Click to Autofill)
            </span>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickFill('student@campusconnect.demo', 'student123')}
                className="p-2.5 border border-indigo-200 bg-indigo-50/60 rounded-xl text-left hover:bg-indigo-100/70 transition-all cursor-pointer group"
              >
                <span className="font-bold text-indigo-900 block flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Student Demo</span>
                </span>
                <span className="text-[10px] text-indigo-700 block truncate">student@campusconnect.demo</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('faculty@campusconnect.demo', 'faculty123')}
                className="p-2.5 border border-purple-200 bg-purple-50/60 rounded-xl text-left hover:bg-purple-100/70 transition-all cursor-pointer group"
              >
                <span className="font-bold text-purple-900 block flex items-center space-x-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Faculty Demo</span>
                </span>
                <span className="text-[10px] text-purple-700 block truncate">faculty@campusconnect.demo</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
