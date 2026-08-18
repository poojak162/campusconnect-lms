import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockModules } from '../../data/mockModules';
import { apiClient } from '../../services/apiClient';
import { recordEvent, EventTypes } from '../../services/lmsEvents';
import { useAuth } from '../../context/AuthContext';
import { 
  Play, 
  CheckCircle, 
  FileText, 
  Download, 
  ArrowLeft, 
  ArrowRight,
  Clock, 
  Activity,
  CheckSquare,
  BookOpen
} from 'lucide-react';

export default function LearningModulePage() {
  const { courseId, moduleId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [moduleData, setModuleData] = useState(null);
  const [courseModules, setCourseModules] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeSignalNotice, setActiveSignalNotice] = useState(null);

  useEffect(() => {
    async function loadModule() {
      const allMods = await apiClient.getModulesByCourse(courseId || 'CS101', user.id);
      setCourseModules(allMods);

      const target = allMods.find(m => m.id === moduleId) || allMods[0];
      setModuleData(target);
      setIsCompleted(target.isCompleted);

      // Telemetry Signal Event: MODULE_VIEWED
      recordEvent(EventTypes.MODULE_VIEWED, {
        studentId: user.id,
        courseId: courseId || target.courseId,
        moduleId: target.id,
        details: { title: target.title }
      });
    }
    loadModule();
  }, [moduleId, courseId, user.id]);

  const triggerSignalNotice = (msg) => {
    setActiveSignalNotice(msg);
    setTimeout(() => setActiveSignalNotice(null), 3000);
  };

  const handleToggleComplete = async () => {
    const res = await apiClient.toggleModuleCompletion(user.id, courseId || moduleData.courseId, moduleData.id);
    setIsCompleted(res.isCompleted);
    triggerSignalNotice(res.isCompleted ? 'Progress Updated: MODULE_COMPLETED logged' : 'Module state updated');
  };

  const handleVideoStart = () => {
    setIsPlaying(true);
    recordEvent('VIDEO_STARTED', {
      studentId: user.id,
      courseId: courseId || moduleData.courseId,
      moduleId: moduleData.id,
      details: { title: moduleData.title, duration: moduleData.videoDuration }
    });
    triggerSignalNotice('Signal Tracked: VIDEO_STARTED logged');
  };

  const handleMaterialClick = async (material) => {
    await apiClient.recordMaterialAccess(user.id, courseId || moduleData.courseId, moduleData.id, material);
    triggerSignalNotice(`Signal Tracked: MATERIAL_ACCESSED (${material.title})`);
  };

  if (!moduleData) return <div className="p-8 text-center text-xs text-slate-400">Loading module...</div>;

  const currentIdx = courseModules.findIndex(m => m.id === moduleData.id);
  const prevMod = currentIdx > 0 ? courseModules[currentIdx - 1] : null;
  const nextMod = currentIdx < courseModules.length - 1 ? courseModules[currentIdx + 1] : null;

  return (
    <div className="space-y-6">
      
      {/* Live Signal Notification Toast */}
      {activeSignalNotice && (
        <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-lg flex items-center justify-between text-xs font-semibold animate-bounce">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>{activeSignalNotice}</span>
          </div>
          <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded-full">Telemetry Signal Recorded</span>
        </div>
      )}

      {/* Back button & Header */}
      <div>
        <button
          onClick={() => navigate(`/student/courses/${courseId || moduleData.courseId}`)}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-indigo-600 mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Course View</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              Course: {courseId || moduleData.courseId}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{moduleData.title}</h1>
            <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Estimated Time: {moduleData.duration}</span>
              </span>
              <span>•</span>
              <span className="font-semibold text-slate-700">Status: {isCompleted ? 'Completed ✓' : 'In Progress'}</span>
            </div>
          </div>

          <button
            onClick={handleToggleComplete}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-xs ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isCompleted ? 'Mark Complete ✓' : 'Mark as Complete'}</span>
          </button>
        </div>
      </div>

      {/* Video / Resource Embed Area */}
      <div className="card-clean overflow-hidden">
        <div className="aspect-video w-full bg-slate-900 relative flex items-center justify-center">
          {!isPlaying ? (
            <div className="text-center space-y-4 p-6">
              <div 
                className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl hover:scale-105 transition-transform cursor-pointer"
                onClick={handleVideoStart}
              >
                <Play className="w-8 h-8 ml-1" />
              </div>
              <h3 className="text-white font-bold text-base">{moduleData.title}</h3>
              <p className="text-xs text-slate-400">Duration: {moduleData.videoDuration} • Click to play lecture & log telemetry signal</p>
            </div>
          ) : (
            <iframe
              src={`${moduleData.videoUrl}?autoplay=1`}
              title={moduleData.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>

      {/* Module Objectives & Reading Material */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Objectives & Reading Material */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Learning Objectives */}
          {moduleData.objectives && (
            <div className="card-clean p-6 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                <span>Learning Objectives</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {moduleData.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reading Material */}
          <div className="card-clean p-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Module Reading Material</span>
            </h3>
            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
              {moduleData.readingMaterial || moduleData.summary}
            </div>
          </div>

        </div>

        {/* Learning Resources Sidebar */}
        <div className="card-clean p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Resource Downloads</span>
          </h3>

          <div className="space-y-2">
            {moduleData.materials.map((mat) => (
              <a
                key={mat.id}
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  handleMaterialClick(mat);
                }}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-indigo-50 hover:border-indigo-200 transition-all text-xs group cursor-pointer"
              >
                <div>
                  <h4 className="font-semibold text-slate-800 group-hover:text-indigo-700">{mat.title}</h4>
                  <span className="text-[10px] text-slate-400">{mat.size}</span>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Previous / Next Module Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        {prevMod ? (
          <button
            onClick={() => navigate(`/student/courses/${courseId}/module/${prevMod.id}`)}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-semibold text-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous: {prevMod.title}</span>
          </button>
        ) : <div></div>}

        {nextMod ? (
          <button
            onClick={() => navigate(`/student/courses/${courseId}/module/${nextMod.id}`)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <span>Next: {nextMod.title}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : <div></div>}
      </div>

    </div>
  );
}
