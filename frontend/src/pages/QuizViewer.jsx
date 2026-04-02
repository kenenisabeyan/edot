import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowLeft, ArrowRight, Award, RefreshCcw } from 'lucide-react';

export default function QuizViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Mock Quiz Data
  const courseName = "Modern JavaScript Complete Guide";
  const quiz = {
    title: "Core Concepts Assessment",
    questions: [
      {
        id: 1,
        text: "What keyword is used to declare a block-scoped variable in modern JavaScript?",
        options: ["var", "let", "def", "dim"],
        correctOption: 1
      },
      {
        id: 2,
        text: "Which of the following is NOT a primitive data type in JavaScript?",
        options: ["String", "Number", "Object", "Boolean"],
        correctOption: 2
      },
      {
        id: 3,
        text: "What does the 'typeof' operator return for an array?",
        options: ["array", "object", "undefined", "list"],
        correctOption: 1
      }
    ]
  };

  const handleSelectOption = (optionIndex) => {
    if (showResults) return;
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctOption) {
        score++;
      }
    });
    return Math.round((score / quiz.questions.length) * 100);
  };

  if (showResults) {
    const score = calculateScore();
    const passed = score >= 70;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
        <div className="glass-card rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12 max-w-lg w-full text-center animate-in zoom-in-95 duration-300">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-white ${passed ? 'bg-emerald-100 text-emerald-500' : 'bg-red-100 text-red-500'}`}>
            {passed ? <Award className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
          </div>
          
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
            {passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h2>
          <p className="text-slate-500 mb-8">You scored <span className={`font-bold ${passed ? 'text-emerald-600' : 'text-red-500'}`}>{score}%</span> on the {quiz.title}.</p>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-transparent rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700">Passing Score</span>
              <span className="font-bold text-slate-900">70%</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-transparent rounded-xl border border-slate-100 mb-8">
              <span className="font-semibold text-slate-700">Your Score</span>
              <span className={`font-bold ${passed ? 'text-emerald-600' : 'text-red-600'}`}>{score}%</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button 
              onClick={handleRetake}
              className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-5 h-5" /> Retake Quiz
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const isAnswered = selectedAnswers[currentQuestion] !== undefined;
  
  // Check if all questions are answered to enable submit
  const allAnswered = quiz.questions.length === Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center py-8 px-4 sm:px-6">
      
      {/* Header */}
      <div className="w-full max-w-3xl mb-8 flex justify-between items-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-slate-500 hover:text-slate-900 font-semibold text-sm flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Quiz
        </button>
        <span className="font-bold text-slate-400 glass-card px-3 py-1 rounded-lg border border-slate-200 shadow-sm text-sm tracking-wider">
          {courseName}
        </span>
      </div>

      <div className="w-full max-w-3xl glass-card rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Progress Bar */}
        <div className="bg-transparent p-6 border-b border-slate-200">
          <div className="flex justify-between text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Area */}
        <div className="p-8 sm:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug mb-10">
            {question.text}
          </h2>
          
          <div className="space-y-4">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  className={`w-full text-left flex items-center p-5 rounded-xl border-2 transition-all ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm' 
                      : 'border-slate-200 hover:border-blue-300 hover:bg-transparent'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full glass-card"></div>}
                  </div>
                  <span className={`text-lg font-medium ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-transparent p-6 md:px-12 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="px-6 py-3 font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 hover:-translate-y-0.5 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <CheckCircle2 className="w-5 h-5" /> Submit Quiz
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
}
