import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { BookOpen, Users, Plus, Edit3, Settings } from 'lucide-react';

export default function FacultyCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.getCourses('FACULTY').then(setCourses);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Faculty Course Management</h1>
          <p className="text-xs sm:text-sm text-slate-500">Create, edit, and publish course modules and assignments.</p>
        </div>

        <button
          onClick={() => navigate('/faculty/courses/CS101/manage')}
          className="px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition-all flex items-center space-x-2 cursor-pointer shadow-xs self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Module</span>
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="card-clean p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 rounded-lg border border-purple-100">
                  {course.code}
                </span>
                <span className="text-xs text-slate-400">{course.credits} Credits</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{course.title}</h3>
              <p className="text-xs text-slate-500">{course.schedule} • {course.room}</p>
              <p className="text-xs text-slate-600 line-clamp-2 mt-2">{course.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">{course.enrolledStudents} Enrolled Students</span>

              <button
                onClick={() => navigate(`/faculty/courses/${course.id}/manage`)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Manage Content</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
