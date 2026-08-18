/**
 * CampusConnect LMS - Reusable Activity Logger Service
 * 
 * Captures student learning-behaviour events for downstream backend intake.
 * Stores events separately in localStorage under 'campusconnect_activities'.
 */

const STORAGE_KEY_ACTIVITIES = 'campusconnect_activities';

export const ActivityTypes = {
  LOGIN: 'LOGIN',
  COURSE_OPENED: 'COURSE_OPENED',
  MODULE_VIEWED: 'MODULE_VIEWED',
  MODULE_COMPLETED: 'MODULE_COMPLETED',
  ASSIGNMENT_STARTED: 'ASSIGNMENT_STARTED',
  ASSIGNMENT_SUBMITTED: 'ASSIGNMENT_SUBMITTED',
  QUIZ_STARTED: 'QUIZ_STARTED',
  QUIZ_SUBMITTED: 'QUIZ_SUBMITTED'
};

/**
 * Retrieve raw activity events array from localStorage.
 */
function getStoredActivities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading activity log:', err);
    return [];
  }
}

/**
 * Save activity events array to localStorage.
 */
function saveActivities(activities) {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(activities.slice(-500)));
  } catch (err) {
    console.error('Error saving activity log:', err);
  }
}

/**
 * Record a standardized learning activity event.
 * 
 * @param {Object} params
 * @param {string} params.studentId
 * @param {string|null} [params.courseId=null]
 * @param {string|null} [params.moduleId=null]
 * @param {string} params.activityType - From ActivityTypes
 * @param {number|null} [params.score=null]
 * @param {number|null} [params.progress=null]
 * @returns {Object} Recorded activity event object
 */
export function recordActivity({
  studentId = 'STU-1001',
  courseId = null,
  moduleId = null,
  activityType,
  score = null,
  progress = null
}) {
  const timestamp = new Date().toISOString();
  const id = 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);

  const event = {
    id,
    studentId,
    courseId: courseId || null,
    moduleId: moduleId || null,
    activityType: activityType || ActivityTypes.MODULE_VIEWED,
    timestamp,
    score: score !== undefined && score !== null ? score : null,
    progress: progress !== undefined && progress !== null ? progress : null
  };

  const activities = getStoredActivities();
  activities.push(event);
  saveActivities(activities);

  return event;
}

/**
 * Get all activities for a specific student.
 */
export function getStudentActivities(studentId = 'STU-1001') {
  const activities = getStoredActivities();
  return activities.filter(a => a.studentId === studentId);
}

/**
 * Get all activities for a specific course.
 */
export function getCourseActivities(courseId) {
  const activities = getStoredActivities();
  return activities.filter(a => a.courseId === courseId);
}

/**
 * Get recent activity events for a student (most recent first).
 */
export function getRecentActivities(studentId = 'STU-1001', limit = 10) {
  const studentActs = getStudentActivities(studentId);
  return studentActs.slice().reverse().slice(0, limit);
}

/**
 * Basic Learning Metric: Last Active Timestamp
 */
export function getLastActiveTime(studentId = 'STU-1001') {
  const studentActs = getStudentActivities(studentId);
  if (studentActs.length === 0) return null;
  return studentActs[studentActs.length - 1].timestamp;
}

/**
 * Basic Learning Metric: Recent Activity Count (e.g. past N days)
 */
export function getRecentActivityCount(studentId = 'STU-1001', days = 7) {
  const studentActs = getStudentActivities(studentId);
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  return studentActs.filter(a => a.timestamp >= cutoff).length;
}

/**
 * Basic Learning Metric: Assignment Completion Rate (%)
 */
export function getAssignmentCompletionRate(studentId = 'STU-1001') {
  const studentActs = getStudentActivities(studentId);
  const started = studentActs.filter(a => a.activityType === ActivityTypes.ASSIGNMENT_STARTED).length;
  const submitted = studentActs.filter(a => a.activityType === ActivityTypes.ASSIGNMENT_SUBMITTED).length;
  if (started === 0) return submitted > 0 ? 100 : 0;
  return Math.min(100, Math.round((submitted / started) * 100));
}

/**
 * Basic Learning Metric: Average Quiz Score
 */
export function getAverageQuizScore(studentId = 'STU-1001') {
  const studentActs = getStudentActivities(studentId);
  const quizScores = studentActs
    .filter(a => a.activityType === ActivityTypes.QUIZ_SUBMITTED && a.score !== null)
    .map(a => a.score);

  if (quizScores.length === 0) return null;
  const sum = quizScores.reduce((acc, curr) => acc + curr, 0);
  return Math.round(sum / quizScores.length);
}

/**
 * Basic Learning Metric: Overall Course Progress Average (%)
 */
export function getOverallCourseProgress(studentId = 'STU-1001') {
  const studentActs = getStudentActivities(studentId);
  const progressEntries = studentActs
    .filter(a => a.progress !== null)
    .map(a => a.progress);

  if (progressEntries.length === 0) return 0;
  return progressEntries[progressEntries.length - 1]; // Return latest progress entry
}

/**
 * Clear stored activities (for testing/demo resets).
 */
export function clearActivities() {
  localStorage.removeItem(STORAGE_KEY_ACTIVITIES);
}
