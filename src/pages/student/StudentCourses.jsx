import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import { BookOpen, Users, Clock, ArrowRight, Search, CheckCircle, Play } from 'lucide-react';

export default function StudentCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.getCourses('STUDENT', user.id).then(setCourses);
  }, [user.id]);

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(filter.toLowerCase()) || 
    c.code.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Enrolled Courses</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Access course syllabi, ordered modules, assignments, and assessments.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or code..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <div 
            key={course.id} 
            className="card-clean p-6 flex flex-col justify-between space-y-5 hover:border-indigo-300 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                  {course.code}
                </span>
                <span className="text-xs text-slate-400 font-medium">{course.schedule}</span>
              </div>

              <div>
                <h3 
                  onClick={() => navigate(`/student/courses/${course.id}`)}
                  className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Faculty: {course.instructor}</p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{course.description}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Course Progress ({course.completedModules}/{course.totalModules} Modules)
                </span>
                <span className="font-bold text-slate-900">{course.progress}%</span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>

              {/* Next Activity Indicator */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Next Learning Activity</span>
                  <span className="font-semibold text-slate-800 line-clamp-1">{course.nextActivity?.title}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{course.totalModules} Modules</span>
                  </span>
                  <span>•</span>
                  <span>{course.room}</span>
                </div>

                <button
                  onClick={() => navigate(`/student/courses/${course.id}`)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <span>View Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
