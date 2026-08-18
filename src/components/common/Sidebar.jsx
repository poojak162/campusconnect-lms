import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  HelpCircle,
  TrendingUp,
  Users,
  Activity,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const { role, isFaculty } = useAuth();

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/courses', label: 'My Courses', icon: BookOpen },
    { to: '/student/assignments', label: 'Assignments', icon: FileText },
    { to: '/student/quizzes', label: 'Quizzes', icon: HelpCircle },
    { to: '/student/progress', label: 'Learning Progress', icon: TrendingUp },
  ];

  const facultyLinks = [
    { to: '/faculty/dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
    { to: '/faculty/courses', label: 'Course Management', icon: BookOpen },
    { to: '/faculty/assignments', label: 'Assignments & Grading', icon: FileText },
    { to: '/faculty/quizzes', label: 'Quizzes', icon: HelpCircle },
    { to: '/faculty/performance', label: 'Student Performance', icon: Users },
    { to: '/faculty/engagement', label: 'Student Activity & Engagement', icon: Activity },
  ];

  const links = isFaculty ? facultyLinks : studentLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        
        {/* Navigation Group Header */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            {role} Portal Navigation
          </p>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs border-l-4 border-indigo-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-current" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Data Architecture Callout Card */}
        <div className="p-3.5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl shadow-xs">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Learning Data Logger</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            This LMS logs student activity signals (modules, assignments, quizzes) to provide data for the CampusConnect backend.
          </p>
        </div>

      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-100 text-xs text-slate-400">
        <p className="font-semibold text-slate-600">CampusConnect LMS v1.0</p>
        <p>Academic Teaching & Learning</p>
      </div>
    </aside>
  );
}
