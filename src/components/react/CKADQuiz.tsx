import React, { useState, useEffect } from 'react';
import ckadQuestions from '../../data/ckad-questions.json';

interface CKADQuestion {
  id: number;
  question: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  solution: string;
  explanation: string;
}

const CKADQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredQuestions, setFilteredQuestions] = useState<CKADQuestion[]>(ckadQuestions as CKADQuestion[]);

  useEffect(() => {
    let filtered = ckadQuestions as CKADQuestion[];
    
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }
    
    setFilteredQuestions(filtered);
    setCurrentQuestionIndex(0);
    setShowSolution(false);
  }, [selectedDifficulty, selectedCategory]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const totalQuestions = filteredQuestions.length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      'text-blue-600 bg-blue-100',
      'text-purple-600 bg-purple-100',
      'text-indigo-600 bg-indigo-100',
      'text-pink-600 bg-pink-100',
      'text-teal-600 bg-teal-100',
      'text-orange-600 bg-orange-100'
    ];
    const index = category.length % colors.length;
    return colors[index];
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowSolution(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowSolution(false);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowSolution(false);
  };

  const getUniqueCategories = () => {
    return Array.from(new Set(ckadQuestions.map(q => q.category)));
  };

  if (totalQuestions === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            CKAD Practice Quiz
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            No questions match the current filters. Try adjusting your selection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 md:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 sm:p-4 md:p-8 overflow-x-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          CKAD Practice Quiz
        </h2>
        
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-auto min-w-[180px] flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty:
              </label>
              <div className="relative">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                  className="block w-full appearance-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all pr-8"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
                  ▼
                </span>
              </div>
            </div>
            <div className="w-full sm:w-auto min-w-[180px] flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category:
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full appearance-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all pr-8"
                >
                  <option value="all">All Categories</option>
                  {getUniqueCategories().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
                  ▼
                </span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Showing {totalQuestions} of {ckadQuestions.length} questions
          </div>
        </div>

        {/* Question Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap w-full justify-center gap-2 mb-4">
            {filteredQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`w-10 h-10 flex items-center justify-center px-0 py-0 rounded-md text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Current Question */}
        {currentQuestion && (
          <div className="space-y-6">
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium break-words max-w-[70vw] xs:max-w-none ${getDifficultyColor(currentQuestion.difficulty)}`}>
                {currentQuestion.difficulty}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium break-words max-w-[70vw] xs:max-w-none ${getCategoryColor(currentQuestion.category)}`}>
                {currentQuestion.category}
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 sm:p-4 md:p-6 overflow-x-auto">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {currentQuestion.question}
              </h3>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <strong>Type:</strong> {currentQuestion.type}
              </div>
            </div>

            {/* Solution Toggle */}
            <div className="text-center">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </button>
            </div>

            {/* Solution */}
            {showSolution && (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2 sm:p-4 md:p-6 overflow-x-auto">
                  <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                    Solution:
                  </h4>
                  <div className="bg-gray-900 text-green-400 p-2 sm:p-4 rounded-md font-mono text-sm overflow-x-auto break-words whitespace-pre-wrap max-w-full">
                    <code>{currentQuestion.solution}</code>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2 sm:p-4 md:p-6 overflow-x-auto">
                  <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                    Explanation:
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 break-words whitespace-pre-wrap max-w-full">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          
          <button
            onClick={nextQuestion}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            Next
          </button>
        </div>

        {/* Quiz Info */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            About this CKAD Quiz:
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>• Based on the official CKAD exam domains and practical exercises</li>
            <li>• Questions focus on hands-on kubectl commands and YAML configurations</li>
            <li>• Covers all CKAD domains: Application Design, Deployment, Services, Observability, and more</li>
            <li>• Solutions include actual kubectl commands you can run in a real cluster</li>
            <li>• Perfect for practicing the practical aspects of the CKAD exam</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CKADQuiz; 