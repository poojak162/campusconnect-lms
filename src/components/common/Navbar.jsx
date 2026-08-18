import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  UserCheck, 
  Activity, 
  Bell, 
  Search, 
  ChevronDown,
  LogOut
} from 'lucide-react';

export default function Navbar({ onToggleTelemetry }) {
  const { role, user, logout, isStudent } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  if (!user) return null;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-700 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">CampusConnect</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                LMS
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Academic Learning Platform</p>
          </div>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses, modules, assignments..."
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Action Controls & Profile Menu */}
        <div className="flex items-center space-x-3 sm:space-x-4">

          {/* Activity Event Telemetry Drawer Button */}
          <button
            onClick={onToggleTelemetry}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all text-xs font-medium cursor-pointer"
            title="View captured learning activity events log"
          >
            <span className="signal-dot"></span>
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Learning Activity Logs</span>
          </button>

          {/* Active Role Badge */}
          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider hidden sm:inline ${
            isStudent ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-purple-50 text-purple-700 border-purple-200'
          }`}>
            {role}
          </span>

          {/* User Profile Info & Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-300"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-500 leading-tight capitalize">{role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 p-3 z-50">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                  <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{user.name}</h4>
                    <p className="text-xs text-slate-500">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-800 rounded-full">
                      {user.department}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-600 space-y-1">
                  <p><strong>ID:</strong> {user.id}</p>
                  {isStudent ? (
                    <>
                      <p><strong>Enrollment:</strong> {user.enrollmentNo}</p>
                      <p><strong>GPA:</strong> {user.overallGpa} / 4.0</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Designation:</strong> {user.designation}</p>
                      <p><strong>Cabin:</strong> {user.cabin}</p>
                    </>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100">
                  <button 
                    onClick={logout}
                    className="w-full text-center py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
