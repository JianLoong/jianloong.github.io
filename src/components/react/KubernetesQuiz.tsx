import React, { useState, useEffect, useRef } from "react";
import questionsJson from '../../data/kubernetes-questions.json';

type Difficulty = 'easy' | 'medium' | 'hard';

type Question = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  difficulty: Difficulty;
};

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const questionsData: (Question & { difficulty: Difficulty })[] = questionsJson as (Question & { difficulty: Difficulty })[];


// Deduplicate questions by text, keeping the highest difficulty if duplicated
const dedupedQuestionsData: Question[] = (() => {
  const seen = new Map<string, Question>();
  const difficultyOrder: Difficulty[] = ['easy', 'medium', 'hard'];
  for (const q of questionsData) {
    const diff = q.difficulty as Difficulty;
    if (!seen.has(q.question)) {
      seen.set(q.question, { ...q, difficulty: diff });
    } else {
      // If duplicate, keep the one with higher difficulty
      const existing = seen.get(q.question)!;
      if (difficultyOrder.indexOf(diff) > difficultyOrder.indexOf(existing.difficulty)) {
        seen.set(q.question, { ...q, difficulty: diff });
      }
    }
  }
  // Sort by difficulty: easy, medium, hard
  return Array.from(seen.values()).sort((a, b) => difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty));
})();

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const KubernetesQuiz: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showDetail, setShowDetail] = useState<number | null>(null);
  const [summaryPage, setSummaryPage] = useState<number>(0);
  const QUESTIONS_PER_PAGE = 5;
  const firstButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (difficulty) {
      const filtered = shuffleArray(dedupedQuestionsData.filter(q => q.difficulty === difficulty));
      setQuestions(filtered);
      setCurrent(0);
      setSelected(null);
      setScore(0);
      setShowScore(false);
      setUserAnswers([]);
      setShowDetail(null);
      setSummaryPage(0);
    }
  }, [difficulty]);

  useEffect(() => {
    if (!showScore && firstButtonRef.current) {
      firstButtonRef.current.focus();
    }
  }, [current, showScore, questions]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showScore || !difficulty) return;
      if (selected === null && e.key >= '1' && e.key <= String(questions[current]?.options.length)) {
        handleAnswer(Number(e.key) - 1);
      }
      if (selected !== null && (e.key === 'Enter' || e.key === ' ')) {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
  }, [selected, current, showScore, questions, difficulty]);

  const handleAnswer = (idx: number) => {
    setSelected(idx);
    setUserAnswers((prev) => [...prev, idx]);
    if (idx === questions[current].answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setSelected(null);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowScore(true);
    }
  };

  const handleRestart = () => {
    setDifficulty(null);
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setShowScore(false);
    setUserAnswers([]);
    setShowDetail(null);
    setSummaryPage(0);
  };

  const totalSummaryPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const progress = ((current + (showScore ? 1 : 0)) / (questions.length || 1)) * 100;

  if (!difficulty) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-background rounded-lg shadow p-10 mt-8 text-center">
        <h2 className="text-xl font-bold text-accent mb-4">Choose Difficulty</h2>
        <div className="flex flex-col gap-3">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              className="px-6 py-3 rounded bg-accent text-white font-semibold text-lg hover:bg-accent/80 transition"
              onClick={() => setDifficulty(d)}
            >
              {DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (difficulty && questions.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-background rounded-lg shadow p-10 mt-8 text-center">
        <h2 className="text-xl font-bold text-accent mb-4">No Questions Available</h2>
        <p className="mb-4">There are no questions for this difficulty. Please choose another difficulty level.</p>
        <button
          className="px-6 py-3 rounded bg-accent text-white font-semibold text-lg hover:bg-accent/80 transition"
          onClick={handleRestart}
        >
          Back to Difficulty Selection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-background rounded-lg shadow p-10 mt-8">
      <div className="mb-4 h-2 bg-muted rounded overflow-hidden">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      {showScore ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-accent mb-2">Quiz Complete!</h2>
          <p className="mb-4">Your score: <span className="font-bold">{score} / {questions.length}</span></p>
          <button
            className="px-4 py-2 bg-accent text-white rounded font-semibold hover:bg-accent/80 transition mb-6"
            onClick={handleRestart}
          >
            Try Again
          </button>
          <div className="text-left mt-6 border border-muted bg-muted/40 rounded-lg p-4 shadow-inner">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Quiz Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-muted/60">
                    <th className="px-2 py-1 text-left">#</th>
                    <th className="px-2 py-1 text-left">Your Answer</th>
                    <th className="px-2 py-1 text-left">Correct Answer</th>
                    <th className="px-2 py-1 text-left">Result</th>
                    <th className="px-2 py-1 text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.slice(summaryPage * QUESTIONS_PER_PAGE, (summaryPage + 1) * QUESTIONS_PER_PAGE).map((q, i) => {
                    const realIdx = summaryPage * QUESTIONS_PER_PAGE + i;
                    return (
                      <React.Fragment key={realIdx}>
                        <tr className="border-b border-muted">
                          <td className="px-2 py-1 font-mono">{realIdx + 1}</td>
                          <td className={userAnswers[realIdx] === q.answer ? 'text-green-700 px-2 py-1' : 'text-red-700 px-2 py-1'}>
                            {q.options[userAnswers[realIdx]] ?? <span className="italic text-muted-foreground">No answer</span>}
                          </td>
                          <td className="text-green-700 px-2 py-1">{q.options[q.answer]}</td>
                          <td className="px-2 py-1">
                            {userAnswers[realIdx] === q.answer ? (
                              <span className="inline-block px-2 py-0.5 bg-green-200 text-green-800 rounded">✔</span>
                            ) : (
                              <span className="inline-block px-2 py-0.5 bg-red-200 text-red-800 rounded">✖</span>
                            )}
                          </td>
                          <td className="px-2 py-1">
                            <button
                              className="text-accent underline text-xs font-medium"
                              onClick={() => setShowDetail(showDetail === realIdx ? null : realIdx)}
                            >
                              {showDetail === realIdx ? 'Hide' : 'Details'}
                            </button>
                          </td>
                        </tr>
                        {showDetail === realIdx && (
                          <tr>
                            <td colSpan={5} className="bg-background p-3 border-l-4 border-accent text-foreground text-sm">
                              <div className="font-semibold mb-1">Q{realIdx + 1}: {q.question}</div>
                              <div>{q.explanation}</div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-3 py-1 rounded bg-muted text-foreground border border-border font-medium disabled:opacity-50"
                onClick={() => setSummaryPage((p) => Math.max(0, p - 1))}
                disabled={summaryPage === 0}
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {summaryPage + 1} of {totalSummaryPages}
              </span>
              <button
                className="px-3 py-1 rounded bg-muted text-foreground border border-border font-medium disabled:opacity-50"
                onClick={() => setSummaryPage((p) => Math.min(totalSummaryPages - 1, p + 1))}
                disabled={summaryPage === totalSummaryPages - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">{questions[current].question}</h3>
          <div className="flex flex-col gap-2 mb-4">
            {questions[current].options.map((opt, idx) => (
              <button
                key={idx}
                ref={idx === 0 ? firstButtonRef : undefined}
                className={`px-4 py-2 rounded border text-left transition font-medium
                  ${selected === idx
                    ? idx === questions[current].answer
                      ? 'bg-green-200 border-green-400 text-green-900'
                      : 'bg-red-200 border-red-400 text-red-900'
                    : selected !== null && idx === questions[current].answer
                      ? 'bg-green-100 border-green-300 text-green-800'
                      : 'bg-muted border-border hover:bg-accent/10'}
                  ${selected !== null ? 'pointer-events-none opacity-80' : ''}`}
                onClick={() => handleAnswer(idx)}
                disabled={selected !== null}
              >
                <span className="font-mono mr-2">{idx + 1}.</span> {opt}
              </button>
            ))}
          </div>
          {selected !== null && (
            <div className="mb-4 p-3 rounded bg-muted/60 border-l-4 border-accent">
              <div className="font-semibold text-accent mb-1">
                Correct answer: {questions[current].options[questions[current].answer]}
              </div>
              <div className="text-foreground text-sm">{questions[current].explanation}</div>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Question {current + 1} of {questions.length}</span>
            <button
              className="ml-2 px-4 py-2 bg-accent text-white rounded font-semibold disabled:opacity-50 transition"
              onClick={handleNext}
              disabled={selected === null}
            >
              {current === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KubernetesQuiz; 