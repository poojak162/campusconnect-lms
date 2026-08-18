import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import { FileText, Plus, CheckCircle, Clock, Award, X } from 'lucide-react';

export default function FacultyAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState(90);
  const [feedbackInput, setFeedbackInput] = useState('');

  useEffect(() => {
    apiClient.getAssignments('FACULTY').then(setAssignments);
  }, []);

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    selectedSubmission.status = 'Graded';
    selectedSubmission.score = parseInt(gradeInput, 10);
    selectedSubmission.feedback = feedbackInput || 'Good work!';

    setSelectedSubmission(null);
    setGradeInput(90);
    setFeedbackInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Assignment Management & Grading</h1>
          <p className="text-xs sm:text-sm text-slate-500">Review student submissions, assign grades, and provide feedback.</p>
        </div>

        <button className="px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition-all flex items-center space-x-2 cursor-pointer shadow-xs self-start sm:self-center">
          <Plus className="w-4 h-4" />
          <span>Create New Assignment</span>
        </button>
      </div>

      {/* Assignment Submissions List */}
      <div className="space-y-4">
        {assignments.map((asn) => (
          <div key={asn.id} className="card-clean p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
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
              
              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <span>Due Date: {new Date(asn.dueDate).toLocaleDateString()}</span>
                <span>•</span>
                <span>Max Marks: {asn.totalPoints}</span>
                {asn.submittedDate && (
                  <>
                    <span>•</span>
                    <span>Submitted on: {new Date(asn.submittedDate).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end md:self-center">
              {asn.status === 'Submitted' ? (
                <button
                  onClick={() => setSelectedSubmission(asn)}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg text-xs hover:bg-indigo-700 cursor-pointer shadow-xs"
                >
                  Grade Submission
                </button>
              ) : asn.status === 'Graded' ? (
                <div className="text-right text-xs">
                  <span className="text-emerald-600 font-bold block">Graded ({asn.score} / {asn.totalPoints})</span>
                  <span className="text-slate-400 text-[10px]">Feedback recorded</span>
                </div>
              ) : (
                <span className="text-xs text-slate-400">Pending Student Submission</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Grade Submission Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Grade Student Work</h3>
              <button onClick={() => setSelectedSubmission(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-900">{selectedSubmission.title}</p>
              <p>Submitted File: <span className="font-mono text-indigo-600">{selectedSubmission.submissionFileName}</span></p>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4 text-xs pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Assign Score (Out of {selectedSubmission.totalPoints})
                </label>
                <input
                  type="number"
                  max={selectedSubmission.totalPoints}
                  min={0}
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Faculty Feedback & Recommendations</label>
                <textarea
                  rows={3}
                  placeholder="Enter constructive feedback..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 cursor-pointer shadow-xs"
                >
                  Save Grade & Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
