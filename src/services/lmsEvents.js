/**
 * CampusConnect LMS - Telemetry Event Bridge
 * 
 * Bridges telemetry UI listeners to the central activityLogger service.
 */

import { recordActivity, ActivityTypes, getStudentActivities } from './activityLogger';

const STORAGE_KEY_METRICS = 'campusconnect_lms_student_metrics';

export const EventTypes = ActivityTypes;

const listeners = new Set();

/**
 * Record event helper delegating to activityLogger.
 */
export function recordEvent(activityType, data = {}) {
  const recorded = recordActivity({
    studentId: data.studentId || 'STU-1001',
    courseId: data.courseId || null,
    moduleId: data.moduleId || null,
    activityType: activityType || ActivityTypes.MODULE_VIEWED,
    score: data.score !== undefined ? data.score : (data.details?.score !== undefined ? data.details.score : null),
    progress: data.progress !== undefined ? data.progress : null
  });

  const allActivities = getStudentActivities(recorded.studentId);
  listeners.forEach(cb => {
    try { cb(recorded, allActivities); } catch (e) { console.error(e); }
  });

  return recorded;
}

export function getAllEvents() {
  const raw = localStorage.getItem('campusconnect_activities');
  return raw ? JSON.parse(raw) : [];
}

export function getStudentMetrics(studentId = 'STU-1001') {
  try {
    const rawMetrics = localStorage.getItem(STORAGE_KEY_METRICS);
    if (!rawMetrics) return null;
    const all = JSON.parse(rawMetrics);
    return all[studentId] || null;
  } catch (e) {
    return null;
  }
}

export function clearEvents() {
  localStorage.removeItem('campusconnect_activities');
  listeners.forEach(cb => cb(null, []));
}

export function subscribeToEvents(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
