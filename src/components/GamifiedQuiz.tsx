import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  HelpCircle,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../data/senaRegulationData';

interface GamifiedQuizProps {
  onQuizCompleted: (scorePercentage: number, passed: boolean) => void;
  onViewCertificate: () => void;
}

export const GamifiedQuiz: React.FC<GamifiedQuizProps> = ({
  onQuizCompleted,
  onViewCertificate,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIndex];
  const hasAnsweredCurrent = selectedAnswers[currentIndex] !== undefined;
  const currentAnswer = selectedAnswers[currentIndex];
  const isCurrentCorrect = hasAnsweredCurrent && currentAnswer === currentQ.correctIndex;

  // Timer effect for challenge mode
  useEffect(() => {
    if (!timerEnabled || isCompleted || hasAnsweredCurrent) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timeout, mark as wrong
          handleSelectAnswer(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerEnabled, isCompleted, hasAnsweredCurrent, currentIndex]);

  const handleSelectAnswer = (optionIdx: number) => {
    if (hasAnsweredCurrent) return;

    const isCorrect = optionIdx === currentQ.correctIndex;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optionIdx }));
    setShowExplanation(true);

    if (isCorrect) {
      const addedPoints = 100 + streak * 20;
      setScore((prev) => prev + addedPoints);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setShowExplanation(false);
    setTimeLeft(30);

    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate final results
      let correctCount = 0;
      QUIZ_QUESTIONS.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correctCount++;
        }
      });

      const percentage = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
      const passed = percentage >= 80;
      setIsCompleted(true);
      onQuizCompleted(percentage, passed);

      if (passed) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#39A900', '#00324D', '#F59E0B', '#10B981'],
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setScore(0);
    setStreak(0);
    setIsCompleted(false);
    setShowExplanation(false);
    setTimeLeft(30);
  };

  // Summary calculation when completed
  const correctTotal = QUIZ_QUESTIONS.filter(
    (q, i) => selectedAnswers[i] === q.correctIndex
  ).length;
  const finalPercentage = Math.round((correctTotal / QUIZ_QUESTIONS.length) * 100);
  const hasPassed = finalPercentage >= 80;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner and Scoreboard */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#39A900] font-semibold mb-1">
            <span>Evaluación Oficial de Inducción</span>
            <span aria-hidden="true">·</span>
            <span>Reglamento Acuerdo 009 de 2024</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
            Desafío del Saber SENA
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Umbral mínimo de aprobación: <strong>80% (8 de 10 preguntas)</strong> para emitir el certificado oficial.
          </p>
        </div>

        {/* Live gamified counters */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">SENAPoints</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">{score}</div>
          </div>

          <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Racha</div>
            <div className="text-lg font-bold text-[#39A900] dark:text-emerald-400 font-mono tabular-nums">
              {streak}x
            </div>
          </div>

          <button
            onClick={() => setTimerEnabled(!timerEnabled)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 ${
              timerEnabled
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Activar o desactivar temporizador de 30s por pregunta"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timerEnabled ? `30s (${timeLeft}s)` : 'Modo Relax'}</span>
          </button>
        </div>
      </div>

      {!isCompleted ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xs transition-colors">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span>Pregunta {currentIndex + 1} de {QUIZ_QUESTIONS.length}</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{currentQ.category}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#39A900] transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((optionText, optIdx) => {
              const isSelected = currentAnswer === optIdx;
              const isCorrectAnswer = optIdx === currentQ.correctIndex;

              let optionClass = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-[#39A900] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';

              if (hasAnsweredCurrent) {
                if (isCorrectAnswer) {
                  optionClass = 'border-emerald-500 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-medium';
                } else if (isSelected && !isCorrectAnswer) {
                  optionClass = 'border-rose-400 dark:border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200';
                } else {
                  optionClass = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  disabled={hasAnsweredCurrent}
                  onClick={() => handleSelectAnswer(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start gap-3.5 ${optionClass}`}
                >
                  <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <div className="flex-1 leading-relaxed">{optionText}</div>
                  {hasAnsweredCurrent && (
                    <div className="shrink-0 pt-0.5">
                      {isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                      {isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-rose-500 dark:text-rose-400" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Feedback Card */}
          {hasAnsweredCurrent && (
            <div
              className={`mt-6 p-5 rounded-xl border ${
                isCurrentCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {isCurrentCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">
                      {isCurrentCorrect ? '¡Respuesta Correcta!' : 'Respuesta Incorrecta'}
                    </span>
                    <span className="text-xs font-mono font-semibold">
                      {isCurrentCorrect ? '+100 pts' : '0 pts'}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {currentQ.explanation}
                  </p>
                  <div className="pt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span>Fundamento: </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{currentQ.articleReference}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-current/10 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados Finales'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Final Results Summary Card */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xs text-center max-w-2xl mx-auto space-y-6 transition-colors">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/60 text-[#39A900] dark:text-emerald-400">
            {hasPassed ? <Trophy className="w-8 h-8" /> : <AlertCircle className="w-8 h-8 text-amber-500" />}
          </div>

          <div>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span>Resultado de Inducción</span>
              <span aria-hidden="true">·</span>
              <span>Acuerdo 009 de 2024</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              {hasPassed ? '¡Felicitaciones! Has Aprobado la Inducción' : 'Casi lo logras. Refuerza tus conocimientos'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              {hasPassed
                ? 'Has superado el umbral del 80% exigido por la coordinación académica del SENA. Tu certificado oficial digital ya se encuentra generado y habilitado.'
                : 'Obtuviste un porcentaje inferior al 80%. Puedes repasar los artículos en el compendio normativo y reintentar la prueba inmediatamente.'}
            </p>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl">
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Aciertos</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {correctTotal} / {QUIZ_QUESTIONS.length}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Porcentaje</div>
              <div className={`text-xl font-bold font-mono tabular-nums ${hasPassed ? 'text-[#39A900] dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {finalPercentage}%
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">SENAPoints</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {score}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reintentar Evaluación</span>
            </button>

            {hasPassed && (
              <button
                onClick={onViewCertificate}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#39A900] hover:bg-[#329200] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Ver y Descargar Certificado Oficial</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
