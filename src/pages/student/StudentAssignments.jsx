import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import { FileText, Upload, CheckCircle, Clock, AlertCircle, X, Activity } from 'lucide-react';

export default function StudentAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedAsnModal, setSelectedAsnModal] = useState(null);
  const [uploadFileName, setUploadFileName] = useState('');

  useEffect(() => {
    apiClient.getAssignments('STUDENT', user.id).then(setAssignments);
  }, [user.id]);

  const handleOpenModal = (asn) => {
    setSelectedAsnModal(asn);
    setUploadFileName(`submission_${asn.id.toLowerCase()}.zip`);
    apiClient.recordAssignmentStarted(user.id, asn.courseId, asn.id);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFileName || !selectedAsnModal) return;

    await apiClient.submitAssignment(selectedAsnModal.id, user.id, selectedAsnModal.courseId, uploadFileName);
    const updated = await apiClient.getAssignments('STUDENT', user.id);
    setAssignments(updated);
    setSelectedAsnModal(null);
    setUploadFileName('');
  };

  const filtered = assignments.filter(a => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Not Submitted') return a.status === 'Not Submitted' || a.status === 'Pending';
    return a.status === activeFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Course Assignments</h1>
          <p className="text-xs sm:text-sm text-slate-500">Track deadlines, submit coursework, and view submission timestamps.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 text-xs">
          {['All', 'Not Submitted', 'Submitted', 'Graded'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeFilter === status ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {filtered.map((asn) => (
          <div key={asn.id} className="card-clean p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {asn.courseName}
                </span>
                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                  asn.status === 'Graded' ? 'bg-emerald-100 text-emerald-800' :
                  asn.status === 'Submitted' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {asn.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{asn.title}</h3>
              <p className="text-xs text-slate-600">{asn.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span>Due Date: {new Date(asn.dueDate).toLocaleString()}</span>
                <span>•</span>
                <span>Max Marks: {asn.totalPoints}</span>
                {asn.score !== null && (
                  <>
                    <span>•</span>
                    <strong className="text-emerald-600 font-bold">Grade: {asn.score} / {asn.totalPoints}</strong>
                  </>
                )}
              </div>

              {asn.submittedDate && (
                <p className="text-[11px] text-slate-500 font-mono">
                  Submitted at: {new Date(asn.submittedDate).toLocaleString()} ({asn.submissionFileName})
                </p>
              )}

              {asn.feedback && (
                <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                  <strong>Faculty Feedback:</strong> {asn.feedback}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 self-end md:self-center">
              {asn.status === 'Not Submitted' || asn.status === 'Pending' ? (
                <button
                  onClick={() => handleOpenModal(asn)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Upload className="w-4 h-4" />
                  <span>Start Submission</span>
                </button>
              ) : (
                <div className="text-right text-xs">
                  <span className="text-emerald-600 font-bold block">✓ Submitted</span>
                  <span className="text-[10px] text-slate-400">{asn.submissionFileName}</span>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Submission Modal */}
      {selectedAsnModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Simulate Assignment Submission</h3>
              <button 
                onClick={() => setSelectedAsnModal(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-900">{selectedAsnModal.title}</p>
              <p>{selectedAsnModal.instructions}</p>
              <p className="text-slate-400">Accepted formats: {selectedAsnModal.fileTypes}</p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Submission File Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. aarav_sharma_assignment1.zip"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAsnModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer shadow-xs"
                >
                  Confirm & Submit Work
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
