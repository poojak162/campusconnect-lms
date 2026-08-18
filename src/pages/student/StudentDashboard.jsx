import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import LearningActivityTimeline from '../../components/common/LearningActivityTimeline';
import { apiClient } from '../../services/apiClient';
import { getRecentActivities } from '../../services/activityLogger';
import { 
  BookOpen, 
  Clock, 
  FileText, 
  Award, 
  ArrowRight, 
  AlertCircle,
  Calendar,
  HelpCircle,
  Activity,
  FolderOpen
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [recentMaterials, setRecentMaterials] = useState([]);
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [courseData, asnData, quizData, materialsData, overallStats] = await Promise.all([
          apiClient.getCourses('STUDENT', user.id),
          apiClient.getAssignments('STUDENT', user.id),
          apiClient.getQuizzes('STUDENT', user.id),
          apiClient.getRecentlyAccessedMaterials(user.id),
          apiClient.getStudentOverallStats(user.id)
        ]);

        setCourses(courseData);
        setAssignments(asnData);
        setQuizzes(quizData);
        setRecentMaterials(materialsData);
        setStats(overallStats);
        setRecentActivities(getRecentActivities(user.id, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user.id]);

  const pendingAssignments = assignments.filter(a => a.status === 'Not Submitted' || a.status === 'Pending');

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              {user.semester} • {user.department}
            </span>
            <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              ID: {user.id}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-indigo-100 text-xs sm:text-sm max-w-xl">
            You have completed {stats?.completedModulesCount || 5} modules. Your average learning progress is {stats?.avgProgress || 57}%. Keep up the momentum!
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Enrolled Courses"
          value={courses.length}
          subtitle="Active Semester"
          icon={BookOpen}
          color="indigo"
        />
        <StatCard
          title="Overall Progress"
          value={`${stats?.avgProgress || 57}%`}
          subtitle="Across all subjects"
          icon={Clock}
          color="emerald"
        />
        <StatCard
          title="Upcoming Tasks"
          value={pendingAssignments.length}
          subtitle="Assignments due soon"
          icon={FileText}
          color="amber"
        />
        <StatCard
          title="Cumulative GPA"
          value={user.overallGpa}
          subtitle={`${user.completedCredits} Credits Earned`}
          icon={Award}
          color="purple"
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Enrolled Courses & Progress Cards */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">My Enrolled Courses & Next Activity</h2>
              <button
                onClick={() => navigate('/student/courses')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 cursor-pointer"
              >
                <span>View All Courses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="card-clean p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {course.code}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{course.credits} Credits</span>
                    </div>
                    <h3 className="font-bold text-slate-900 line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{course.instructor}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium">Course Completion</span>
                      <span className="font-bold text-slate-900">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next Up:</span>
                    <p className="font-semibold text-slate-800 line-clamp-1">{course.nextActivity?.title}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => navigate(`/student/courses/${course.id}`)}
                      className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                    >
                      View Course
                    </button>
                    <button
                      onClick={() => {
                        if (course.nextActivity?.type === 'module') {
                          navigate(`/student/courses/${course.id}/module/${course.nextActivity.id}`);
                        } else if (course.nextActivity?.type === 'assignment') {
                          navigate('/student/assignments');
                        } else if (course.nextActivity?.type === 'quiz') {
                          navigate('/student/quizzes');
                        } else {
                          navigate(`/student/courses/${course.id}`);
                        }
                      }}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-bold flex items-center space-x-1 cursor-pointer shadow-xs"
                    >
                      <span>Continue Learning</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Accessed Materials Section */}
          <div className="card-clean p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <FolderOpen className="w-4 h-4 text-indigo-600" />
              <span>Recently Accessed Learning Materials</span>
            </h3>

            {recentMaterials.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No learning materials opened yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recentMaterials.map((mat) => (
                  <div key={mat.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 line-clamp-1">{mat.title}</h4>
                      <span className="text-[10px] text-slate-400">Course: {mat.courseId}</span>
                    </div>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full uppercase">
                      {mat.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Col: Deadlines, Quizzes & Recent Learning Activity */}
        <div className="space-y-6">
          
          {/* Upcoming Assignments */}
          <div className="card-clean p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Upcoming Assignments</span>
              </h3>
              <button
                onClick={() => navigate('/student/assignments')}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {assignments.slice(0, 3).map((asn) => (
                <div key={asn.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{asn.courseName}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      asn.status === 'Graded' ? 'bg-emerald-100 text-emerald-800' :
                      asn.status === 'Submitted' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {asn.status}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium line-clamp-1">{asn.title}</p>
                  <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Due: {new Date(asn.dueDate).toLocaleDateString()}</span>
                    </span>
                    {asn.status === 'Not Submitted' && (
                      <button
                        onClick={() => navigate('/student/assignments')}
                        className="font-bold text-indigo-600 hover:underline cursor-pointer"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Activity Timeline Card */}
          <div className="card-clean p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Learning Activity</span>
            </h3>

            <LearningActivityTimeline events={recentActivities} />
          </div>

        </div>

      </div>

    </div>
  );
}
