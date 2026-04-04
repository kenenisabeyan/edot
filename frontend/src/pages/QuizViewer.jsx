import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowLeft, ArrowRight, Award, RefreshCcw } from 'lucide-react';

export default function QuizViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quizId = id;
  void quizId;
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0B0E14]">
        <div className="bg-[#0B0E14]/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8 sm:p-12 max-w-lg w-full text-center animate-in zoom-in-95 duration-300 relative overflow-hidden">
          <div className={`absolute inset-0 opacity-10 pointer-events-none ${passed ? 'bg-[#008A32]' : 'bg-[#E30A17]'}`}></div>
          
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] border-4 border-white/10 relative z-10 ${passed ? 'bg-[#008A32]/20 text-[#008A32]' : 'bg-[#E30A17]/20 text-[#E30A17]'}`}>
            {passed ? <Award className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
          </div>
          
          <h2 className="text-3xl font-display font-black text-white mb-2 relative z-10 drop-shadow-md">
            {passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h2>
          <p className="text-slate-400 mb-8 font-medium relative z-10">You scored <span className={`font-black tracking-wider ${passed ? 'text-[#008A32]' : 'text-[#E30A17]'}`}>{score}%</span> on the {quiz.title}.</p>
          
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Passing Score</span>
              <span className="font-black text-white">70%</span>
            </div>
            <div className="flex justify-between items-center p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 mb-8">
              <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Your Score</span>
              <span className={`font-black text-xl shadow-sm ${passed ? 'text-[#008A32]' : 'text-[#E30A17]'}`}>{score}%</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 relative z-10">
            <button 
              onClick={handleRetake}
              className="flex-1 px-6 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 hover:border-[#FFD700]/50 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              <RefreshCcw className="w-4 h-4" /> Retake
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-[#FFD700] to-[#EAB308] text-[#0f172a] font-black rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)] inline-flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              Continue <ArrowRight className="w-4 h-4" />
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
    <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center py-8 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#FFD700]/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Header */}
      <div className="w-full max-w-3xl mb-8 flex justify-between items-center relative z-10">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-slate-400 hover:text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors border border-white/10 bg-white/5 px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Exit
        </button>
        <span className="font-bold text-[#FFD700] bg-[#FFD700]/10 px-4 py-2 rounded-lg border border-[#FFD700]/20 shadow-[0_0_15px_rgba(255,215,0,0.1)] text-xs tracking-widest uppercase">
          {courseName}
        </span>
      </div>

      <div className="w-full max-w-3xl bg-[#0B0E14]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative z-10">
        
        {/* Progress Bar */}
        <div className="p-6 md:px-12 border-b border-white/5 bg-[#11151F]">
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span className="text-[#FFD700]">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-[#FFD700] to-[#EAB308] shadow-[0_0_10px_rgba(255,215,0,0.5)] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Area */}
        <div className="p-8 sm:p-12 relative">
          <div className="absolute inset-0 bg-[#FFD700]/5 opacity-20 pointer-events-none blur-3xl"></div>
          
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-snug mb-10 relative z-10 drop-shadow-md">
            {question.text}
          </h2>
          
          <div className="space-y-4 relative z-10">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  className={`w-full text-left flex items-center p-5 rounded-xl border-2 transition-all ${
                    isSelected 
                      ? 'border-[#FFD700] bg-[#FFD700]/10 shadow-[0_0_15px_rgba(255,215,0,0.15)]' 
                      : 'border-white/5 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'border-[#FFD700]' : 'border-white/20'
                  }`}>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-[#FFD700] shadow-[0_0_5px_rgba(255,215,0,0.8)]"></div>}
                  </div>
                  <span className={`text-lg font-bold ${isSelected ? 'text-[#FFD700]' : 'text-slate-300'}`}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 md:px-12 border-t border-white/5 flex gap-4 justify-between items-center bg-[#11151F]">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="px-6 py-3.5 font-bold uppercase tracking-widest text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-white/10 rounded-xl"
          >
            Previous
          </button>
          
          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="px-8 py-3.5 bg-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white/20 transition-all shadow-sm flex items-center gap-2 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="px-8 py-3.5 bg-gradient-to-r from-[#008A32] to-[#006622] text-white font-black uppercase tracking-widest text-xs rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,138,50,0.4)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <CheckCircle2 className="w-4 h-4" /> Submit
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
}
