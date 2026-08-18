import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import { Users, Award, TrendingUp, Search } from 'lucide-react';

export default function FacultyPerformance() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiClient.getFacultyStudents().then(setStudents);
  }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Academic Performance</h1>
          <p className="text-xs sm:text-sm text-slate-500">Track class performance, quiz scores, and assignment completion rates.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student name or roll no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Roster Table */}
      <div className="card-clean overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Student Name & Roll No</th>
                <th className="p-4">Attendance Rate</th>
                <th className="p-4">Avg Quiz Score</th>
                <th className="p-4">Assignment Completion</th>
                <th className="p-4">Overall Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{st.name}</div>
                    <div className="text-[11px] text-slate-400">{st.rollNo}</div>
                  </td>
                  <td className="p-4">
                    <span className={`font-bold ${st.attendanceRate < 75 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {st.attendanceRate}%
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-indigo-700">{st.avgQuizScore}%</span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-emerald-700">{st.assignmentCompletionRate}%</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      st.riskSignals.level === 'low' ? 'bg-emerald-100 text-emerald-800' :
                      st.riskSignals.level === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {st.riskSignals.status}
                    </span>
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
