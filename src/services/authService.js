/**
 * CampusConnect LMS - Authentication Service
 * 
 * MVP Authentication system providing session persistence via localStorage
 * and demo credentials for Student and Faculty roles.
 */

import { recordActivity, ActivityTypes } from './activityLogger';

const STORAGE_KEY_AUTH = 'campusconnect_auth_user';

// Mock credentials database
const DEMO_USERS = [
  {
    id: 'STU-1001',
    name: 'Aarav Sharma',
    email: 'student@campusconnect.demo',
    password: 'student123',
    role: 'student',
    department: 'Computer Science & Engineering',
    semester: 'Semester 5',
    enrollmentNo: 'CC2023-CS-084',
    overallGpa: 3.82,
    completedCredits: 78,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'FAC-2002',
    name: 'Dr. Elena Rostova',
    email: 'faculty@campusconnect.demo',
    password: 'faculty123',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    cabin: 'Block B - Room 402',
    totalCourses: 4,
    activeStudents: 142,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256'
  }
];

export const authService = {
  /**
   * Authenticate user with email & password.
   * @returns {Object} User session payload { id, name, email, role, ... }
   */
  login(email, password) {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const foundUser = DEMO_USERS.find(
      u => u.email.toLowerCase() === trimmedEmail && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid email or password. Please use demo credentials.');
    }

    // Omit raw password from stored session payload
    const { password: _, ...sessionUser } = foundUser;

    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(sessionUser));
    } catch (e) {
      console.error('Failed to save session:', e);
    }

    // Record LOGIN event for student role
    if (sessionUser.role === 'student') {
      recordActivity({
        studentId: sessionUser.id,
        courseId: null,
        moduleId: null,
        activityType: ActivityTypes.LOGIN
      });
    }

    return sessionUser;
  },

  /**
   * Terminate user session.
   */
  logout() {
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch (e) {
      console.error('Failed to clear session:', e);
    }
  },

  /**
   * Retrieve active session user from localStorage.
   */
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_AUTH);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Check if user is authenticated.
   */
  isAuthenticated() {
    return !!this.getCurrentUser();
  }
};
