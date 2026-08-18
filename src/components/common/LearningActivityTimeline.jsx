import React from 'react';
import { 
  CheckCircle, 
  Play, 
  FileCheck, 
  Award, 
  BookOpen, 
  LogIn, 
  FolderOpen,
  ArrowRight,
  Clock
} from 'lucide-react';

/**
 * Format raw event object into clean student-facing timeline item label
 */
function formatEventLabel(event) {
  switch (event.activityType) {
    case 'MODULE_COMPLETED':
      return {
        icon: CheckCircle,
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        title: `Completed Module`,
        detail: event.moduleId || event.courseId
      };
    case 'ASSIGNMENT_SUBMITTED':
      return {
        icon: FileCheck,
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
        title: `Submitted Assignment`,
        detail: event.courseId ? `Course: ${event.courseId}` : null
      };
    case 'QUIZ_SUBMITTED':
      return {
        icon: Award,
        color: 'text-purple-600 bg-purple-50 border-purple-200',
        title: `Completed Quiz`,
        detail: event.score !== null ? `Score: ${event.score}` : null
      };
    case 'MODULE_VIEWED':
      return {
        icon: ArrowRight,
        color: 'text-slate-600 bg-slate-100 border-slate-200',
        title: `Viewed Module`,
        detail: event.moduleId || event.courseId
      };
    case 'COURSE_OPENED':
      return {
        icon: BookOpen,
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        title: `Opened Course`,
        detail: event.courseId
      };
    case 'ASSIGNMENT_STARTED':
      return {
        icon: Clock,
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        title: `Started Assignment`,
        detail: event.courseId
      };
    case 'QUIZ_STARTED':
      return {
        icon: Clock,
        color: 'text-purple-600 bg-purple-50 border-purple-200',
        title: `Started Quiz`,
        detail: event.courseId
      };
    case 'LOGIN':
      return {
        icon: LogIn,
        color: 'text-slate-600 bg-slate-50 border-slate-200',
        title: `Logged into LMS`,
        detail: 'Session Active'
      };
    default:
      return {
        icon: ArrowRight,
        color: 'text-slate-600 bg-slate-100 border-slate-200',
        title: event.activityType,
        detail: event.courseId
      };
  }
}

/**
 * Group events into Today, Yesterday, and Earlier sections
 */
function groupEventsByDate(events) {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  const groups = {
    Today: [],
    Yesterday: [],
    Earlier: []
  };

  events.forEach(evt => {
    const evtDate = new Date(evt.timestamp).toDateString();
    if (evtDate === today) {
      groups.Today.push(evt);
    } else if (evtDate === yesterday) {
      groups.Yesterday.push(evt);
    } else {
      groups.Earlier.push(evt);
    }
  });

  return groups;
}

export default function LearningActivityTimeline({ events = [] }) {
  if (!events || events.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-400">
        No learning activity recorded yet. Explore modules, complete assignments, or take quizzes!
      </div>
    );
  }

  const grouped = groupEventsByDate(events);

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([groupName, groupEvents]) => {
        if (groupEvents.length === 0) return null;

        return (
          <div key={groupName} className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {groupName}
            </span>

            <div className="space-y-2">
              {groupEvents.map(evt => {
                const formatted = formatEventLabel(evt);
                const Icon = formatted.icon;

                return (
                  <div key={evt.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-2xs">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg border ${formatted.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{formatted.title}</h4>
                        {formatted.detail && (
                          <p className="text-[11px] text-slate-500">{formatted.detail}</p>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
