import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import { HelpCircle, Plus, Clock, Users, Award } from 'lucide-react';

export default function FacultyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    apiClient.getQuizzes('FACULTY').then(setQuizzes);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Faculty Quiz Management</h1>
          <p className="text-xs sm:text-sm text-slate-500">Create interactive multiple-choice quizzes and view score distributions.</p>
        </div>

        <button className="px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition-all flex items-center space-x-2 cursor-pointer shadow-xs self-start sm:self-center">
          <Plus className="w-4 h-4" />
          <span>Create New Quiz</span>
        </button>
      </div>

      {/* Quizzes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((qz) => (
          <div key={qz.id} className="card-clean p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                  {qz.courseName}
                </span>
                <span className="text-xs text-slate-400 font-medium">Published</span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{qz.title}</h3>
              
              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <span>Duration: {qz.durationMinutes} mins</span>
                <span>•</span>
                <span>{qz.questions.length} Questions</span>
                <span>•</span>
                <span>Points: {qz.totalPoints}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Class Avg: 84%</span>
              <button className="px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-purple-700 font-semibold cursor-pointer">
                Edit Questions
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
