import { mockCourses } from '../data/mockCourses';
import { mockModules } from '../data/mockModules';
import { mockAssignments } from '../data/mockAssignments';
import { mockQuizzes } from '../data/mockQuizzes';
import { mockStudents } from '../data/mockStudents';
import { recordActivity, ActivityTypes } from './activityLogger';
import { progressService } from './progressService';

/**
 * CampusConnect LMS - Abstracted Data API Client
 */
export const apiClient = {
  // Course APIs
  async getCourses(role = 'STUDENT', studentId = 'STU-1001') {
    return new Promise(resolve => {
      const updated = mockCourses.map(course => {
        const progress = progressService.calculateCourseProgress(studentId, course.id);
        const nextActivity = progressService.getNextLearningActivity(studentId, course.id);
        const courseMods = mockModules.filter(m => m.courseId === course.id);
        const completedIds = progressService.getCompletedModuleIds(studentId);
        const completedCount = courseMods.filter(m => completedIds.includes(m.id)).length;

        return {
          ...course,
          progress,
          completedModules: completedCount,
          totalModules: courseMods.length || course.totalModules,
          nextActivity
        };
      });
      setTimeout(() => resolve(updated), 50);
    });
  },

  async getCourseById(courseId, studentId = 'STU-1001') {
    return new Promise(resolve => {
      const course = mockCourses.find(c => c.id === courseId);
      if (!course) {
        resolve(null);
        return;
      }

      const progress = progressService.calculateCourseProgress(studentId, courseId);
      const nextActivity = progressService.getNextLearningActivity(studentId, courseId);
      const courseMods = mockModules.filter(m => m.courseId === courseId);
      const completedIds = progressService.getCompletedModuleIds(studentId);
      const completedCount = courseMods.filter(m => completedIds.includes(m.id)).length;

      // Record COURSE_OPENED event
      recordActivity({
        studentId,
        courseId,
        activityType: ActivityTypes.COURSE_OPENED,
        progress
      });

      resolve({
        ...course,
        progress,
        completedModules: completedCount,
        totalModules: courseMods.length || course.totalModules,
        nextActivity
      });
    });
  },

  // Module APIs
  async getModulesByCourse(courseId, studentId = 'STU-1001') {
    return new Promise(resolve => {
      const courseMods = mockModules.filter(m => m.courseId === courseId);
      const completedIds = progressService.getCompletedModuleIds(studentId);

      const updated = courseMods.map(m => ({
        ...m,
        isCompleted: completedIds.includes(m.id)
      }));

      setTimeout(() => resolve(updated), 50);
    });
  },

  async toggleModuleCompletion(studentId = 'STU-1001', courseId, moduleId) {
    const res = progressService.toggleModuleCompletion(studentId, courseId, moduleId);
    return Promise.resolve(res);
  },

  // Assignment APIs
  async getAssignments(role = 'STUDENT', studentId = 'STU-1001') {
    return new Promise(resolve => {
      const subs = progressService.getSubmissions(studentId);
      const updated = mockAssignments.map(a => {
        const sub = subs[a.id];
        return {
          ...a,
          status: sub ? sub.status : 'Not Submitted',
          submittedDate: sub ? sub.submittedDate : null,
          submissionFileName: sub ? sub.fileName : null,
          score: sub?.score !== undefined ? sub.score : a.score
        };
      });
      setTimeout(() => resolve(updated), 50);
    });
  },

  async recordAssignmentStarted(studentId = 'STU-1001', courseId, assignmentId) {
    const progress = progressService.calculateCourseProgress(studentId, courseId);
    recordActivity({
      studentId,
      courseId,
      moduleId: null,
      activityType: ActivityTypes.ASSIGNMENT_STARTED,
      progress
    });
  },

  async submitAssignment(assignmentId, studentId = 'STU-1001', courseId = 'CS101', fileName = 'submission.zip') {
    const res = progressService.submitAssignment(studentId, courseId, assignmentId, fileName);
    return Promise.resolve({ success: true, submission: res });
  },

  // Quiz APIs
  async getQuizzes(role = 'STUDENT', studentId = 'STU-1001') {
    return new Promise(resolve => {
      const scores = progressService.getQuizScores(studentId);
      const updated = mockQuizzes.map(q => {
        const s = scores[q.id];
        return {
          ...q,
          status: s ? s.status : 'Available',
          userScore: s ? s.score : null,
          attemptsUsed: s ? s.attemptsUsed : 0
        };
      });
      setTimeout(() => resolve(updated), 50);
    });
  },

  async recordQuizStarted(studentId = 'STU-1001', courseId, quizId) {
    const progress = progressService.calculateCourseProgress(studentId, courseId);
    recordActivity({
      studentId,
      courseId,
      moduleId: null,
      activityType: ActivityTypes.QUIZ_STARTED,
      progress
    });
  },

  async submitQuizAttempt(quizId, studentId = 'STU-1001', courseId = 'CS101', score = 0, totalPoints = 20) {
    const res = progressService.recordQuizScore(studentId, courseId, quizId, score, totalPoints);
    return Promise.resolve({ success: true, quizScore: res });
  },

  async recordMaterialAccess(studentId = 'STU-1001', courseId, moduleId, material) {
    return progressService.recordMaterialAccess(studentId, courseId, moduleId, material);
  },

  async getRecentlyAccessedMaterials(studentId = 'STU-1001') {
    return progressService.getRecentlyAccessedMaterials(studentId);
  },

  async getStudentOverallStats(studentId = 'STU-1001') {
    return progressService.getStudentOverallStats(studentId);
  },

  async getFacultyStudents() {
    return new Promise(resolve => setTimeout(() => resolve([...mockStudents]), 50));
  }
};
