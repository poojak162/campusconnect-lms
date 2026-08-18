import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { mockModules } from '../../data/mockModules';
import { BookOpen, Plus, ArrowLeft, Trash2, Edit3, Video, FileText, CheckCircle } from 'lucide-react';

export default function FacultyCourseManage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New module form state
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState('45 mins');
  const [newSummary, setNewSummary] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('https://www.youtube.com/embed/g2o22C3CRfU');

  useEffect(() => {
    async function load() {
      const c = await apiClient.getCourseById(courseId || 'CS101');
      const m = await apiClient.getModulesByCourse(courseId || 'CS101');
      setCourse(c);
      setModules(m);
    }
    load();
  }, [courseId]);

  const handleAddModule = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    const created = {
      id: 'MOD-' + Date.now(),
      courseId: courseId || 'CS101',
      title: newTitle,
      duration: newDuration,
      order: modules.length + 1,
      isCompleted: false,
      summary: newSummary,
      videoUrl: newVideoUrl,
      videoDuration: '15:00',
      materials: [
        { id: 'mat-new', title: 'Lecture Notes (PDF)', type: 'pdf', size: '1.0 MB', url: '#' }
      ]
    };

    mockModules.push(created);
    setModules([...modules, created]);
    setShowAddModal(false);
    setNewTitle('');
    setNewSummary('');
  };

  if (!course) return <div className="p-8 text-center text-xs text-slate-400">Loading management view...</div>;

  return (
    <div className="space-y-6">
      
      {/* Back button & Header */}
      <div>
        <button
          onClick={() => navigate('/faculty/courses')}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-indigo-600 mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Course Listing</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 bg-purple-50 text-purple-700 rounded-md border border-purple-100">
                {course.code}
              </span>
              <span className="text-xs text-slate-400">{course.schedule}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{course.title} — Course Content</h1>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Module</span>
          </button>
        </div>
      </div>

      {/* Module Management List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">
          Published Modules ({modules.length})
        </h2>

        {modules.map((mod, idx) => (
          <div key={mod.id} className="card-clean p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                #{idx + 1}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{mod.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{mod.summary}</p>
                <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2">
                  <span>Duration: {mod.duration}</span>
                  <span>•</span>
                  <span>Video: {mod.videoDuration}</span>
                  <span>•</span>
                  <span>{mod.materials.length} Attachments</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-center text-xs">
              <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer font-medium">
                Edit
              </button>
              <button className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Module Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base">Publish New Learning Module</h3>
            
            <form onSubmit={handleAddModule} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Module Title</label>
                <input
                  type="text"
                  placeholder="e.g. Module 6: Advanced Graph Traversal Algorithms"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estimated Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 60 mins"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Video Embed URL</label>
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Module Summary</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of learning objectives..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 cursor-pointer shadow-xs"
                >
                  Publish Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
