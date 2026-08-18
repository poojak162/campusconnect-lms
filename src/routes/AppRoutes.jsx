import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/auth/Login';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentCourses from '../pages/student/StudentCourses';
import CourseDetails from '../pages/student/CourseDetails';
import LearningModulePage from '../pages/student/LearningModulePage';
import StudentAssignments from '../pages/student/StudentAssignments';
import StudentQuizzes from '../pages/student/StudentQuizzes';
import StudentProgress from '../pages/student/StudentProgress';

// Faculty Pages
import FacultyDashboard from '../pages/faculty/FacultyDashboard';
import FacultyCourses from '../pages/faculty/FacultyCourses';
import FacultyCourseManage from '../pages/faculty/FacultyCourseManage';
import FacultyAssignments from '../pages/faculty/FacultyAssignments';
import FacultyQuizzes from '../pages/faculty/FacultyQuizzes';
import FacultyPerformance from '../pages/faculty/FacultyPerformance';
import FacultyEngagement from '../pages/faculty/FacultyEngagement';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Authentication Login Route */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Protected Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route path="courses/:courseId/module/:moduleId" element={<LearningModulePage />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="quizzes" element={<StudentQuizzes />} />
        <Route path="progress" element={<StudentProgress />} />
      </Route>

      {/* Protected Faculty Routes */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/faculty/dashboard" replace />} />
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="courses" element={<FacultyCourses />} />
        <Route path="courses/:courseId/manage" element={<FacultyCourseManage />} />
        <Route path="assignments" element={<FacultyAssignments />} />
        <Route path="quizzes" element={<FacultyQuizzes />} />
        <Route path="performance" element={<FacultyPerformance />} />
        <Route path="engagement" element={<FacultyEngagement />} />
      </Route>

      {/* Fallback redirect to Login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
