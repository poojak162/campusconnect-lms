import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import { HelpCircle, Clock, CheckCircle, Award, Play, X, AlertCircle, Check, HelpCircle as QuestionIcon } from 'lucide-react';

export default function StudentQuizzes() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuizRunner, setActiveQuizRunner] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    apiClient.getQuizzes('STUDENT', user.id).then(setQuizzes);
  }, [user.id]);

  const handleStartQuiz = (qz) => {
    setActiveQuizRunner(qz);
    setUserAnswers({});
    setQuizResult(null);

    // Record Telemetry: QUIZ_STARTED
    apiClient.recordQuizStarted(user.id, qz.courseId, qz.id);
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    if (!activeQuizRunner) return;

    let pointsEarned = 0;
    const questionsBreakdown = activeQuizRunner.questions.map(q => {
      const selected = userAnswers[q.id];
      const isCorrect = selected === q.correctIndex;
      const questionVal = activeQuizRunner.totalPoints / activeQuizRunner.questions.length;
      if (isCorrect) pointsEarned += questionVal;

      return {
        ...q,
        selected,
        isCorrect
      };
    });

    const finalScore = Math.round(pointsEarned);

    await apiClient.submitQuizAttempt(activeQuizRunner.id, user.id, activeQuizRunner.courseId, finalScore, activeQuizRunner.totalPoints);
    
    setQuizResult({
      score: finalScore,
      total: activeQuizRunner.totalPoints,
      breakdown: questionsBreakdown
    });

    const updated = await apiClient.getQuizzes('STUDENT', user.id);
    setQuizzes(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Course Quizzes & Assessments</h1>
        <p className="text-xs sm:text-sm text-slate-500">Test your understanding with auto-graded interactive quizzes.</p>
      </div>

      {/* Quiz List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((qz) => (
          <div key={qz.id} className="card-clean p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {qz.courseName}
                </span>
                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                  qz.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {qz.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{qz.title}</h3>
              
              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Time: {qz.durationMinutes} Mins</span>
                </span>
                <span>•</span>
                <span>{qz.questions.length} Questions</span>
                <span>•</span>
                <span>Max Points: {qz.totalPoints}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {qz.status === 'Completed' ? (
                <div className="text-xs">
                  <span className="text-slate-500">Previous Score: </span>
                  <strong className="text-emerald-600 font-extrabold text-sm">{qz.userScore} / {qz.totalPoints}</strong>
                </div>
              ) : (
                <span className="text-xs text-slate-400">Attempts Used: {qz.attemptsUsed} / {qz.attemptsAllowed}</span>
              )}

              <button
                onClick={() => handleStartQuiz(qz)}
                className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs ${
                  qz.status === 'Completed'
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>{qz.status === 'Completed' ? 'Retake Quiz' : 'Start Quiz'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quiz Runner Modal */}
      {activeQuizRunner && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl space-y-6 border border-slate-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-indigo-600">{activeQuizRunner.courseName}</span>
                <h3 className="font-bold text-slate-900 text-lg">{activeQuizRunner.title}</h3>
              </div>
              <button 
                onClick={() => setActiveQuizRunner(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quiz Result State with Answer Breakdown */}
            {quizResult ? (
              <div className="space-y-6">
                <div className="text-center py-4 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Quiz Submitted & Scored!</h3>
                  <p className="text-sm text-slate-600">
                    Your Score: <strong className="text-indigo-600 text-lg">{quizResult.score} / {quizResult.total}</strong>
                  </p>
                </div>

                {/* Answer Review Breakdown */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-900">Answer Review</h4>
                  {quizResult.breakdown.map((q, idx) => (
                    <div key={q.id} className={`p-4 rounded-xl border text-xs space-y-2 ${
                      q.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                    }`}>
                      <div className="flex items-start justify-between font-bold text-slate-900">
                        <span>Q{idx + 1}: {q.question}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          q.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {q.isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                        </span>
                      </div>

                      <div className="space-y-1 pt-1 text-slate-700">
                        <p>Your Answer: <strong>{q.selected !== undefined ? q.options[q.selected] : 'Not Answered'}</strong></p>
                        {!q.isCorrect && (
                          <p className="text-emerald-700">Correct Answer: <strong>{q.options[q.correctIndex]}</strong></p>
                        )}
                        <p className="text-[11px] text-slate-500 italic pt-1">{q.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => setActiveQuizRunner(null)}
                    className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 cursor-pointer shadow-md"
                  >
                    Close Runner
                  </button>
                </div>
              </div>
            ) : (
              /* Quiz Questions Form */
              <form onSubmit={handleSubmitQuiz} className="space-y-6">
                {activeQuizRunner.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <h4 className="font-bold text-sm text-slate-900">
                      Q{idx + 1}: {q.question}
                    </h4>
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => (
                        <label
                          key={oIdx}
                          className={`flex items-center space-x-3 p-3 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                            userAnswers[q.id] === oIdx
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            checked={userAnswers[q.id] === oIdx}
                            onChange={() => handleAnswerSelect(q.id, oIdx)}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-400">Select an option for each question before submitting.</span>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 cursor-pointer shadow-md"
                  >
                    Submit Quiz Answers
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
