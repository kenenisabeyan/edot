import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function QuizBuilder({ quiz, setQuiz, title = "Mini-Quiz Questions" }) {
  
  const addQuestion = () => {
    setQuiz([
      ...quiz, 
      { question: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
  };

  const removeQuestion = (index) => {
    const newQuiz = [...quiz];
    newQuiz.splice(index, 1);
    setQuiz(newQuiz);
  };

  const updateQuestion = (index, field, value) => {
    const newQuiz = [...quiz];
    newQuiz[index][field] = value;
    setQuiz(newQuiz);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuiz = [...quiz];
    newQuiz[qIndex].options[oIndex] = value;
    setQuiz(newQuiz);
  };

  return (
    <div className="bg-[#11151F]/5 border border-white/10 rounded-2xl p-6 mt-6 shadow-inner backdrop-blur-md">
      <h4 className="font-bold text-white text-lg mb-5 flex items-center gap-2">
        <div className="w-2 h-6 bg-[#FFD700] rounded-full"></div>
        {title}
      </h4>
      
      {quiz.map((q, qIndex) => (
        <div key={qIndex} className="bg-[#0B0E14] p-5 rounded-xl border border-white/10 mb-5 relative shadow-sm group hover:border-white/20 transition-all">
          <button 
            type="button"
            onClick={() => removeQuestion(qIndex)}
            className="absolute top-4 right-4 text-slate-300 hover:text-[#E30A17] bg-[#11151F]/5 hover:bg-[#E30A17]/10 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          <div className="mb-5 pr-10">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Question {qIndex + 1}</label>
            <input 
              type="text" 
              required
              value={q.question}
              onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
              className="w-full px-4 py-3 bg-[#0B0E14] border border-white/10 text-white rounded-xl focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 outline-none font-semibold placeholder:text-slate-300 transition-all"
              placeholder="e.g., What is the primary purpose of React?"
            />
          </div>
          
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Options & Correct Answer</label>
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex items-center gap-3">
                <input 
                  type="radio" 
                  name={`correct-${qIndex}`}
                  checked={q.correctAnswer === oIndex}
                  onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                  className="w-4 h-4 text-[#008A32] focus:ring-[#008A32] bg-[#0B0E14] border-white/20 focus:ring-offset-[#0B0E14]"
                />
                <input 
                  type="text" 
                  required
                  value={opt}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  className={`flex-1 px-4 py-2.5 rounded-xl border outline-none font-medium transition-all ${q.correctAnswer === oIndex ? ' border-[#008A32] bg-[#008A32]/10 text-white shadow-[0_0_10px_rgba(0,138,50,0.1)]' : 'border-white/10 bg-[#0B0E14] text-slate-300 focus:border-white/30'}`}
                  placeholder={`Option ${oIndex + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button 
        type="button"
        onClick={addQuestion}
        className="text-sm font-bold text-[#FFD700] hover:text-[#EAB308] border border-[#FFD700]/20 hover:border-[#FFD700]/50 bg-[#FFD700]/5 hover:bg-[#FFD700]/10 px-4 py-2 rounded-xl flex items-center justify-center gap-2 w-full mt-2 transition-colors"
      >
        <PlusCircle className="w-4 h-4" /> Add Question
      </button>
    </div>
  );
}
