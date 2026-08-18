/**
 * CampusConnect LMS - Progress & State Persistence Engine
 * 
 * Dynamically tracks completed modules, assignment submissions, quiz attempts, 
 * and calculates course progress % and next learning activities for students.
 */

import { mockCourses } from '../data/mockCourses';
import { mockModules } from '../data/mockModules';
import { mockAssignments } from '../data/mockAssignments';
import { mockQuizzes } from '../data/mockQuizzes';
import { recordActivity, ActivityTypes } from './activityLogger';

const KEY_COMPLETED_MODULES = 'campusconnect_completed_modules';
const KEY_SUBMISSIONS = 'campusconnect_submissions';
const KEY_QUIZ_SCORES = 'campusconnect_quiz_scores';
const KEY_ACCESSED_MATERIALS = 'campusconnect_accessed_materials';

function getStored(key, defaultValue = {}) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function saveStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key}:`, e);
  }
}

export const progressService = {
  getCompletedModuleIds(studentId = 'STU-1001') {
    const data = getStored(KEY_COMPLETED_MODULES, {
      'STU-1001': ['MOD-101', 'MOD-102', 'MOD-103', 'MOD-201']
    });
    return data[studentId] || ['MOD-101', 'MOD-102', 'MOD-103', 'MOD-201'];
  },

  isModuleCompleted(studentId, moduleId) {
    const completed = this.getCompletedModuleIds(studentId);
    return completed.includes(moduleId);
  },

  toggleModuleCompletion(studentId = 'STU-1001', courseId, moduleId) {
    const data = getStored(KEY_COMPLETED_MODULES, {
      'STU-1001': ['MOD-101', 'MOD-102', 'MOD-103', 'MOD-201']
    });
    let list = data[studentId] || ['MOD-101', 'MOD-102', 'MOD-103', 'MOD-201'];

    let isCompletedNow = false;
    if (list.includes(moduleId)) {
      list = list.filter(id => id !== moduleId);
    } else {
      list.push(moduleId);
      isCompletedNow = true;
    }
    data[studentId] = list;
    saveStored(KEY_COMPLETED_MODULES, data);

    const progress = this.calculateCourseProgress(studentId, courseId);

    if (isCompletedNow) {
      recordActivity({
        studentId,
        courseId,
        moduleId,
        activityType: ActivityTypes.MODULE_COMPLETED,
        progress
      });
    }

    return { isCompleted: isCompletedNow, progress };
  },

  getSubmissions(studentId = 'STU-1001') {
    const data = getStored(KEY_SUBMISSIONS, {
      'STU-1001': {
        'ASN-102': { status: 'Graded', submittedDate: '2026-08-17T14:22:00', fileName: 'aarav_avl_trees.zip', score: 92 },
        'ASN-201': { status: 'Submitted', submittedDate: '2026-08-16T18:45:00', fileName: 'ecommerce_schema_v2.sql', score: null }
      }
    });
    return data[studentId] || {};
  },

  submitAssignment(studentId = 'STU-1001', courseId, assignmentId, fileName) {
    const data = getStored(KEY_SUBMISSIONS, {
      'STU-1001': {
        'ASN-102': { status: 'Graded', submittedDate: '2026-08-17T14:22:00', fileName: 'aarav_avl_trees.zip', score: 92 },
        'ASN-201': { status: 'Submitted', submittedDate: '2026-08-16T18:45:00', fileName: 'ecommerce_schema_v2.sql', score: null }
      }
    });
    const studentSubs = data[studentId] || {};

    const submittedDate = new Date().toISOString();
    studentSubs[assignmentId] = {
      status: 'Submitted',
      submittedDate,
      fileName: fileName || 'assignment_submission.zip',
      score: null
    };

    data[studentId] = studentSubs;
    saveStored(KEY_SUBMISSIONS, data);

    const progress = this.calculateCourseProgress(studentId, courseId);

    recordActivity({
      studentId,
      courseId,
      moduleId: null,
      activityType: ActivityTypes.ASSIGNMENT_SUBMITTED,
      progress
    });

    return studentSubs[assignmentId];
  },

  getQuizScores(studentId = 'STU-1001') {
    const data = getStored(KEY_QUIZ_SCORES, {
      'STU-1001': {
        'QZ-101': { score: 18, total: 20, status: 'Completed', attemptsUsed: 1 }
      }
    });
    return data[studentId] || {};
  },

  recordQuizScore(studentId = 'STU-1001', courseId, quizId, score, total) {
    const data = getStored(KEY_QUIZ_SCORES, {
      'STU-1001': {
        'QZ-101': { score: 18, total: 20, status: 'Completed', attemptsUsed: 1 }
      }
    });
    const studentScores = data[studentId] || {};

    const prevAttempts = studentScores[quizId]?.attemptsUsed || 0;
    studentScores[quizId] = {
      score,
      total,
      status: 'Completed',
      attemptsUsed: prevAttempts + 1
    };

    data[studentId] = studentScores;
    saveStored(KEY_QUIZ_SCORES, data);

    const progress = this.calculateCourseProgress(studentId, courseId);

    recordActivity({
      studentId,
      courseId,
      moduleId: null,
      activityType: ActivityTypes.QUIZ_SUBMITTED,
      score,
      progress
    });

    return studentScores[quizId];
  },

  recordMaterialAccess(studentId = 'STU-1001', courseId, moduleId, material) {
    const data = getStored(KEY_ACCESSED_MATERIALS, {
      'STU-1001': []
    });
    let list = data[studentId] || [];
    
    list = list.filter(m => m.id !== material.id);
    list.unshift({
      ...material,
      courseId,
      moduleId,
      accessedAt: new Date().toISOString()
    });

    data[studentId] = list.slice(0, 10);
    saveStored(KEY_ACCESSED_MATERIALS, data);

    return data[studentId];
  },

  getRecentlyAccessedMaterials(studentId = 'STU-1001') {
    const data = getStored(KEY_ACCESSED_MATERIALS, {
      'STU-1001': [
        { id: 'mat-1', title: 'Big-O Cheat Sheet (PDF)', type: 'pdf', courseId: 'CS101', accessedAt: '2026-08-17T15:30:00' },
        { id: 'mat-3', title: 'Dynamic Array Implementation in C++', type: 'code', courseId: 'CS101', accessedAt: '2026-08-17T12:10:00' }
      ]
    });
    return data[studentId] || [];
  },

  calculateCourseProgress(studentId = 'STU-1001', courseId) {
    const courseModules = mockModules.filter(m => m.courseId === courseId);
    const completedIds = this.getCompletedModuleIds(studentId);
    
    if (courseModules.length === 0) return 50;

    const completedCount = courseModules.filter(m => completedIds.includes(m.id)).length;
    const moduleProgressRatio = completedCount / courseModules.length;

    const courseAsns = mockAssignments.filter(a => a.courseId === courseId);
    const subs = this.getSubmissions(studentId);
    const submittedAsnCount = courseAsns.filter(a => subs[a.id]?.status === 'Submitted' || subs[a.id]?.status === 'Graded').length;
    const asnProgressRatio = courseAsns.length > 0 ? (submittedAsnCount / courseAsns.length) : 1;

    const courseQuizzes = mockQuizzes.filter(q => q.courseId === courseId);
    const scores = this.getQuizScores(studentId);
    const completedQuizCount = courseQuizzes.filter(q => scores[q.id]?.status === 'Completed').length;
    const quizProgressRatio = courseQuizzes.length > 0 ? (completedQuizCount / courseQuizzes.length) : 1;

    const totalWeighted = (moduleProgressRatio * 0.6) + (asnProgressRatio * 0.2) + (quizProgressRatio * 0.2);
    return Math.round(totalWeighted * 100);
  },

  getNextLearningActivity(studentId = 'STU-1001', courseId) {
    const courseModules = mockModules.filter(m => m.courseId === courseId);
    const completedIds = this.getCompletedModuleIds(studentId);

    const nextMod = courseModules.find(m => !completedIds.includes(m.id));
    if (nextMod) {
      return { type: 'module', title: nextMod.title, id: nextMod.id, courseId };
    }

    const courseAsns = mockAssignments.filter(a => a.courseId === courseId);
    const subs = this.getSubmissions(studentId);
    const pendingAsn = courseAsns.find(a => !subs[a.id]);
    if (pendingAsn) {
      return { type: 'assignment', title: pendingAsn.title, id: pendingAsn.id, courseId };
    }

    const courseQuizzes = mockQuizzes.filter(q => q.courseId === courseId);
    const scores = this.getQuizScores(studentId);
    const pendingQuiz = courseQuizzes.find(q => !scores[q.id]);
    if (pendingQuiz) {
      return { type: 'quiz', title: pendingQuiz.title, id: pendingQuiz.id, courseId };
    }

    return { type: 'completed', title: 'Course Completed! All units finished.', courseId };
  },

  getStudentOverallStats(studentId = 'STU-1001') {
    const courseProgresses = mockCourses.map(c => this.calculateCourseProgress(studentId, c.id));
    const avgProgress = Math.round(courseProgresses.reduce((a, b) => a + b, 0) / courseProgresses.length);

    const completedModuleIds = this.getCompletedModuleIds(studentId);
    const submissions = this.getSubmissions(studentId);
    const quizScores = this.getQuizScores(studentId);

    const submittedAsnCount = Object.values(submissions).filter(s => s.status === 'Submitted' || s.status === 'Graded').length;
    const completedQuizCount = Object.values(quizScores).filter(q => q.status === 'Completed').length;

    return {
      avgProgress,
      completedModulesCount: completedModuleIds.length,
      totalModulesCount: mockModules.length,
      submittedAssignmentsCount: submittedAsnCount,
      completedQuizzesCount: completedQuizCount
    };
  }
};
