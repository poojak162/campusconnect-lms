import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { recordEvent, EventTypes } from '../../services/lmsEvents';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Megaphone, 
  CheckCircle, 
  Play, 
  Download, 
  Calendar,
  Clock,
  ArrowLeft,
  Award,
  FolderOpen
} from 'lucide-react';

export default function CourseDetails() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState('modules'); // modules | syllabus | materials | assignments | quizzes | announcements

  useEffect(() => {
    async function loadData() {
      const c = await apiClient.getCourseById(courseId || 'CS101', user.id);
      const m = await apiClient.getModulesByCourse(courseId || 'CS101', user.id);
      const a = await apiClient.getAssignments('STUDENT', user.id);
      const q = await apiClient.getQuizzes('STUDENT', user.id);

      setCourse(c);
      setModules(m);
      setAssignments(a.filter(item => item.courseId === (courseId || 'CS101')));
      setQuizzes(q.filter(item => item.courseId === (courseId || 'CS101')));
    }
    loadData();
  }, [courseId, user.id]);

  const handleMaterialClick = async (mat, mod) => {
    await apiClient.recordMaterialAccess(user.id, course.id, mod.id, mat);
    alert(`Opened resource: ${mat.title}`);
  };

  if (!course) return <div className="p-8 text-center text-xs text-slate-400">Loading course...</div>;

  return (
    <div className="space-y-6">
      
      {/* Back Button & Header */}
      <div>
        <button
          onClick={() => navigate('/student/courses')}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-indigo-600 mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Courses</span>
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                {course.code}
              </span>
              <span className="text-xs text-slate-400 font-medium">{course.department}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{course.title}</h1>
            <p className="text-xs text-slate-500">Faculty: <strong>{course.instructor}</strong> • {course.schedule} ({course.room})</p>
            <p className="text-xs text-slate-600 max-w-2xl pt-1 leading-relaxed">{course.description}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-52 text-right space-y-1.5 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Course Completion</span>
            <div className="text-3xl font-extrabold text-indigo-700">{course.progress}%</div>
            <p className="text-[11px] text-slate-500 font-medium">{course.completedModules} of {course.totalModules} modules completed</p>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden mt-1">
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 sm:space-x-4 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'modules', label: `Learning Modules (${modules.length})`, icon: BookOpen },
          { id: 'materials', label: 'Reading Materials', icon: FolderOpen },
          { id: 'assignments', label: `Assignments (${assignments.length})`, icon: FileText },
          { id: 'quizzes', label: `Quizzes (${quizzes.length})`, icon: HelpCircle },
          { id: 'syllabus', label: 'Syllabus', icon: FileText },
          { id: 'announcements', label: 'Announcements', icon: Megaphone }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-3 px-3 border-b-2 font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'modules' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ordered Learning Modules
              </h2>
              <span className="text-xs text-slate-500">
                Click any module to read objectives, watch video lectures, and access materials.
              </span>
            </div>

            <div className="space-y-3">
              {modules.map((mod) => (
                <div key={mod.id} className="card-clean p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2.5 rounded-xl border mt-0.5 ${
                      mod.isCompleted ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'
                    }`}>
                      {mod.isCompleted ? <CheckCircle className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-sm text-slate-900">{mod.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          mod.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {mod.isCompleted ? 'Completed ✓' : 'Pending'}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {mod.objectives ? mod.objectives[0] : mod.summary}
                      </p>

                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Estimated Time: {mod.duration}</span>
                        </span>
                        <span>•</span>
                        <span>{mod.materials.length} Resource files</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/student/courses/${course.id}/module/${mod.id}`)}
                    className={`px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap cursor-pointer shadow-xs self-end sm:self-center transition-all ${
                      mod.isCompleted ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {mod.isCompleted ? 'Review Module' : 'Continue Learning'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="card-clean p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Module Learning Materials & Attachments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.flatMap(m => m.materials.map(mat => ({ ...mat, moduleTitle: m.title, moduleId: m.id }))).map((mat) => (
                <div key={mat.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-800">{mat.title}</h4>
                    <p className="text-[11px] text-slate-400">{mat.moduleTitle}</p>
                    <span className="text-[10px] text-slate-400">{mat.size}</span>
                  </div>
                  <button
                    onClick={() => handleMaterialClick(mat, { id: mat.moduleId })}
                    className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 cursor-pointer"
                  >
                    Access Resource
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-4">
            {assignments.map((asn) => (
              <div key={asn.id} className="card-clean p-5 flex items-center justify-between text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{asn.title}</h3>
                  <p className="text-slate-500 mt-0.5">{asn.description}</p>
                  <p className="text-slate-400 text-[11px] mt-1">Due: {new Date(asn.dueDate).toLocaleDateString()} • Max Marks: {asn.totalPoints}</p>
                </div>
                <button
                  onClick={() => navigate('/student/assignments')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold cursor-pointer"
                >
                  {asn.status === 'Submitted' || asn.status === 'Graded' ? 'View Submission' : 'Start Assignment'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="space-y-4">
            {quizzes.map((qz) => (
              <div key={qz.id} className="card-clean p-5 flex items-center justify-between text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{qz.title}</h3>
                  <p className="text-slate-500 mt-0.5">Duration: {qz.durationMinutes} mins • Total Points: {qz.totalPoints}</p>
                  {qz.userScore !== null && <p className="text-emerald-600 font-bold mt-1">Score: {qz.userScore} / {qz.totalPoints}</p>}
                </div>
                <button
                  onClick={() => navigate('/student/quizzes')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold cursor-pointer"
                >
                  {qz.status === 'Completed' ? 'Retake Quiz' : 'Start Quiz'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'syllabus' && (
          <div className="card-clean p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Course Syllabus</h2>
            <div className="space-y-3">
              {course.syllabus.map((item) => (
                <div key={item.unit} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                    U{item.unit}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500">Core Academic Unit Requirements</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="space-y-4">
            {course.announcements.map((ann) => (
              <div key={ann.id} className="card-clean p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">{ann.title}</h3>
                  <span className="text-xs text-slate-400">{ann.date}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">Posted by {ann.author}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
