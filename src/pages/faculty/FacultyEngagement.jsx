import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import { Clock, FileX, Sparkles, Activity } from 'lucide-react';

export default function FacultyEngagement() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    apiClient.getFacultyStudents().then(setStudents);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg space-y-3">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Learning Activity & Signal Logging</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Student Learning Activity Matrix</h1>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          This dashboard presents student learning-behaviour data captured by the LMS (active platform hours, module views, completion counts, missed deadlines, and quiz metrics) to provide activity data for the CampusConnect backend.
        </p>
      </div>

      {/* Engagement Matrix Table */}
      <div className="card-clean overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Learning Behaviour Metrics Matrix</h3>
          <span className="text-xs text-slate-400">Captured live in activity log</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Student & ID</th>
                <th className="p-4">Active Time</th>
                <th className="p-4">Modules Viewed / Completed</th>
                <th className="p-4">Missed Deadlines</th>
                <th className="p-4">Last LMS Activity</th>
                <th className="p-4">Activity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{st.name}</div>
                    <div className="text-[11px] text-slate-400">{st.id} • {st.rollNo}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1 text-slate-800 font-bold">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{st.timeSpentHours} hrs</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-slate-700">
                      {st.modulesViewed} viewed / <strong className="text-indigo-600">{st.modulesCompleted} completed</strong>
                    </span>
                  </td>
                  <td className="p-4">
                    {st.missedAssignments > 0 ? (
                      <span className="font-bold text-rose-600 flex items-center space-x-1">
                        <FileX className="w-3.5 h-3.5" />
                        <span>{st.missedAssignments} Missed</span>
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-bold">0 Missed ✓</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-500">{st.lastActive}</td>
                  <td className="p-4">
                    <div className={`p-2 rounded-xl border space-y-1 ${
                      st.activityStatus.level === 'low' ? 'bg-rose-50 border-rose-200 text-rose-900' :
                      st.activityStatus.level === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}>
                      <div className="font-bold text-[11px]">
                        <span>{st.activityStatus.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 line-clamp-1">{st.activityStatus.notes}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
