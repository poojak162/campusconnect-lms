import React, { useState, useEffect } from 'react';
import { getAllEvents, subscribeToEvents, clearEvents, getStudentMetrics } from '../../services/lmsEvents';
import { Activity, X, Trash2, Database, ShieldCheck } from 'lucide-react';

export default function EventTrackerDrawer({ isOpen, onClose }) {
  const [events, setEvents] = useState([]);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    setEvents(getAllEvents());
    setMetrics(getStudentMetrics('STU-1001'));

    const unsubscribe = subscribeToEvents((newEvent, allEvents) => {
      setEvents([...allEvents]);
      setMetrics(getStudentMetrics('STU-1001'));
    });

    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            <div>
              <h3 className="font-bold text-sm">Learning Activity Event Log</h3>
              <p className="text-[11px] text-slate-400">Captured student learning activity telemetry</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aggregated Student Activity Summary */}
        {metrics && (
          <div className="bg-slate-800 p-3 text-slate-200 text-xs border-b border-slate-700 grid grid-cols-3 gap-2">
            <div className="bg-slate-900/60 p-2 rounded-lg text-center">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Active Time</span>
              <span className="font-bold text-emerald-400 text-sm">{metrics.totalTimeSpentMinutes} mins</span>
            </div>
            <div className="bg-slate-900/60 p-2 rounded-lg text-center">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Mod Completed</span>
              <span className="font-bold text-indigo-400 text-sm">{metrics.modulesCompleted}</span>
            </div>
            <div className="bg-slate-900/60 p-2 rounded-lg text-center">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Submissions</span>
              <span className="font-bold text-purple-400 text-sm">{metrics.assignmentsSubmitted}</span>
            </div>
          </div>
        )}

        {/* Live Activity Stream List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Real-time Activity Stream ({events.length})
            </span>
            <button
              onClick={clearEvents}
              className="text-[11px] text-rose-600 hover:text-rose-700 flex items-center space-x-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Log</span>
            </button>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No learning activities logged yet.</p>
              <p className="mt-1">Interact with modules, videos, or quizzes to record events!</p>
            </div>
          ) : (
            events.slice().reverse().map((evt) => (
              <div key={evt.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full text-[10px]">
                    {evt.activityType || evt.type}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="text-slate-700 space-y-0.5">
                  <p><strong>Student ID:</strong> {evt.studentId}</p>
                  {evt.courseId && <p><strong>Course:</strong> {evt.courseId}</p>}
                  {evt.moduleId && <p><strong>Module:</strong> {evt.moduleId}</p>}
                  {evt.score !== null && <p><strong>Score:</strong> {evt.score}</p>}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 text-[11px] text-slate-500 text-center flex items-center justify-center space-x-1">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Activity data prepared for backend REST API ingestion</span>
        </div>

      </div>
    </div>
  );
}
