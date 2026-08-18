import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import { apiClient } from '../../services/apiClient';
import { 
  Users, 
  BookOpen, 
  Clock, 
  CheckSquare, 
  Plus, 
  ArrowRight,
  Activity
} from 'lucide-react';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function loadData() {
      const c = await apiClient.getCourses('FACULTY');
      const s = await apiClient.getFacultyStudents();
      setCourses(c);
      setStudents(s);
    }
    loadData();
  }, []);

  const inactiveStudents = students.filter(s => s.activityStatus.level === 'low' || s.activityStatus.level === 'medium');

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            {user.designation} • {user.department}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Faculty Command Center — {user.name}
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm max-w-xl">
            Managing 4 active courses and 142 enrolled students. Track student coursework, create learning content, and grade submissions.
          </p>
        </div>

        <button
          onClick={() => navigate('/faculty/courses')}
          className="px-4 py-2.5 bg-white text-slate-900 font-bold rounded-xl text-xs hover:bg-slate-100 transition-all flex items-center space-x-2 cursor-pointer shadow-md self-start md:self-center"
        >
          <Plus className="w-4 h-4 text-indigo-600" />
          <span>Manage Courses</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Teaching Courses"
          value={courses.length}
          subtitle="Spring Semester"
          icon={BookOpen}
          color="indigo"
        />
        <StatCard
          title="Enrolled Students"
          value={students.length}
          subtitle="Across all sections"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Pending Submissions"
          value="14"
          subtitle="Requires grading"
          icon={CheckSquare}
          color="purple"
        />
        <StatCard
          title="Activity Watchlist"
          value={inactiveStudents.length}
          subtitle="Students needing followup"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Course Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">My Teaching Courses</h2>
            <button
              onClick={() => navigate('/faculty/courses')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 cursor-pointer"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="card-clean p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                      {course.code}
                    </span>
                    <span className="text-xs text-slate-400">{course.enrolledStudents} Students</span>
                  </div>
                  <h3 className="font-bold text-slate-900">{course.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{course.schedule}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{course.totalModules} Published Modules</span>
                  <button
                    onClick={() => navigate(`/faculty/courses/${course.id}/manage`)}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium cursor-pointer"
                  >
                    Manage Content
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Student Activity Watchlist */}
        <div className="space-y-6">
          <div className="card-clean p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Activity className="w-4 h-4 text-amber-600" />
              <span>Activity Watchlist</span>
            </h3>

            <div className="space-y-3">
              {inactiveStudents.map((st) => (
                <div key={st.id} className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{st.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      st.activityStatus.level === 'low' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {st.activityStatus.label}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">Last Active: {st.lastActive}</p>
                  <p className="text-slate-500 text-[10px]">Note: {st.activityStatus.notes}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/faculty/engagement')}
              className="w-full py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold cursor-pointer text-center block"
            >
              View Full Student Engagement Matrix
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
