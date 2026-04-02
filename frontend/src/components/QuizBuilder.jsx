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
    <div className="bg-transparent border border-slate-200 rounded-xl p-6 mt-4">
      <h4 className="font-bold text-slate-800 mb-4">{title}</h4>
      
      {quiz.map((q, qIndex) => (
        <div key={qIndex} className="glass-card p-4 rounded-lg border border-slate-200 mb-4 relative">
          <button 
            type="button"
            onClick={() => removeQuestion(qIndex)}
            className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          <div className="mb-4 pr-8">
            <label className="block text-sm font-medium text-slate-700 mb-1">Question {qIndex + 1}</label>
            <input 
              type="text" 
              required
              value={q.question}
              onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., What is the primary purpose of React?"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Options & Correct Answer</label>
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex items-center gap-3">
                <input 
                  type="radio" 
                  name={`correct-${qIndex}`}
                  checked={q.correctAnswer === oIndex}
                  onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <input 
                  type="text" 
                  required
                  value={opt}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-lg border outline-none ${q.correctAnswer === oIndex ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300'}`}
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
        className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 mt-2"
      >
        <PlusCircle className="w-4 h-4" /> Add Question
      </button>
    </div>
  );
}
