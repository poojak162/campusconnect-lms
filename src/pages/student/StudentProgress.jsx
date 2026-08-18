import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getStudentActivities, 
  getAssignmentCompletionRate, 
  getAverageQuizScore, 
  getLastActiveTime 
} from '../../services/activityLogger';
import { apiClient } from '../../services/apiClient';
import StatCard from '../../components/common/StatCard';
import LearningActivityTimeline from '../../components/common/LearningActivityTimeline';
import { TrendingUp, Clock, FileText, CheckCircle, Activity, Award, HelpCircle } from 'lucide-react';

export default function StudentProgress() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [asnCompletionRate, setAsnCompletionRate] = useState(0);
  const [avgQuizScore, setAvgQuizScore] = useState(null);
  const [lastActive, setLastActive] = useState(null);

  useEffect(() => {
    async function loadProgress() {
      const s = await apiClient.getStudentOverallStats(user.id);
      const c = await apiClient.getCourses('STUDENT', user.id);
      const acts = getStudentActivities(user.id);
      const rate = getAssignmentCompletionRate(user.id);
      const quizAvg = getAverageQuizScore(user.id);
      const last = getLastActiveTime(user.id);

      setStats(s);
      setCourses(c);
      setActivities(acts);
      setAsnCompletionRate(rate);
      setAvgQuizScore(quizAvg);
      setLastActive(last);
    }
    loadProgress();
  }, [user.id]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Learning Progress & Activity Analytics</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Basic learning-behaviour metrics, course completion percentages, and activity timeline.
        </p>
      </div>

      {/* Basic Learning Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Completion"
          value={`${stats?.avgProgress || 57}%`}
          subtitle="Across enrolled subjects"
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Modules Completed"
          value={stats?.completedModulesCount || 5}
          subtitle={`Out of ${stats?.totalModulesCount || 8} total`}
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          title="Assignment Rate"
          value={`${asnCompletionRate}%`}
          subtitle="Submitted coursework"
          icon={FileText}
          color="amber"
        />
        <StatCard
          title="Average Quiz Score"
          value={avgQuizScore !== null ? `${avgQuizScore} pts` : 'N/A'}
          subtitle="Auto-graded quizzes"
          icon={Award}
          color="purple"
        />
      </div>

      {/* Course Progress Breakdown Cards */}
      <div className="card-clean p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Course Completion Breakdown</h3>
        <div className="space-y-4">
          {courses.map((c) => (
            <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-900">{c.code} — {c.title}</span>
                <span className="text-indigo-700">{c.progress}% Completed</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${c.progress}%` }}></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Faculty: {c.instructor}</span>
                <span>Modules: {c.completedModules}/{c.totalModules} Finished</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Activity Timeline */}
      <div className="card-clean p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <span>Learning Activity Timeline ({activities.length})</span>
          </h3>
          {lastActive && (
            <span className="text-xs text-slate-400">
              Last Active: {new Date(lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <LearningActivityTimeline events={activities.slice().reverse()} />
      </div>

    </div>
  );
}
