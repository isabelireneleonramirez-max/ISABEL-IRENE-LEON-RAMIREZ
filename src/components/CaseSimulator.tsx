import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, HelpCircle, RefreshCw, ShieldAlert, Sparkles, UserCheck, XCircle } from 'lucide-react';
import { CaseDilemma, SIMULATION_CASES } from '../data/senaRegulationData';

interface CaseSimulatorProps {
  onCompleteAllCases?: () => void;
  onGoToQuiz?: () => void;
}

export const CaseSimulator: React.FC<CaseSimulatorProps> = ({ onGoToQuiz }) => {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [simulatorPoints, setSimulatorPoints] = useState<number>(0);

  const currentCase = SIMULATION_CASES[currentCaseIndex];
  const chosenOptionId = selectedOptions[currentCase.id];
  const chosenOption = currentCase.options.find((opt) => opt.id === chosenOptionId);

  const handleSelectOption = (optId: string) => {
    if (selectedOptions[currentCase.id]) return; // already chosen for this case

    const option = currentCase.options.find((opt) => opt.id === optId);
    if (!option) return;

    setSelectedOptions((prev) => ({ ...prev, [currentCase.id]: optId }));
    if (option.isCorrect) {
      setSimulatorPoints((prev) => prev + option.points);
    }
  };

  const handleResetCase = () => {
    const currentOptId = selectedOptions[currentCase.id];
    const option = currentCase.options.find((opt) => opt.id === currentOptId);
    if (option && option.isCorrect) {
      setSimulatorPoints((prev) => Math.max(0, prev - option.points));
    }
    setSelectedOptions((prev) => {
      const copy = { ...prev };
      delete copy[currentCase.id];
      return copy;
    });
  };

  const allCompleted = SIMULATION_CASES.every((c) => selectedOptions[c.id]);

  return (
    <div className="space-y-8 pb-16">
      {/* Visual Header with Apprentices Photo */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 text-white shadow-xs">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/sena_apprentices_team_1792526598081.jpg"
            alt="Aprendices SENA en taller técnico colaborativo"
            className="w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        </div>

        <div className="relative z-10 p-6 md:p-8 max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-2">
            <span>Simulador Interactivo de Convivencia</span>
            <span aria-hidden="true">·</span>
            <span>Casos de la Vida Real SENA</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
            Laboratorio de Dilemas Éticos y Convivencia
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Ponte en los zapatos de aprendices en situaciones cotidianas de taller, plataformas virtuales y trámites académicos. Tus decisiones tendrán consecuencias reales basadas en el Reglamento (Acuerdo 009 de 2024).
          </p>

          <div className="mt-4 flex items-center gap-4 text-xs font-mono text-emerald-300">
            <span>Puntaje acumulado: <strong className="text-white text-sm">{simulatorPoints} pts</strong></span>
            <span aria-hidden="true">·</span>
            <span>Casos resueltos: {Object.keys(selectedOptions).length}/{SIMULATION_CASES.length}</span>
          </div>
        </div>
      </div>

      {/* Case Navigator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {SIMULATION_CASES.map((dilemma, idx) => {
          const isCurrent = idx === currentCaseIndex;
          const isAnswered = !!selectedOptions[dilemma.id];
          const isCorrect = selectedOptions[dilemma.id] &&
            dilemma.options.find((o) => o.id === selectedOptions[dilemma.id])?.isCorrect;

          return (
            <button
              key={dilemma.id}
              onClick={() => setCurrentCaseIndex(idx)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                isCurrent
                  ? 'bg-white dark:bg-slate-800 border-[#39A900] text-slate-900 dark:text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>Caso 0{idx + 1}</span>
              {isAnswered && (
                isCorrect ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                )
              )}
            </button>
          );
        })}
      </div>

      {/* Main Dilemma Interactive Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">{currentCase.character}</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>{currentCase.program}</span>
          </div>
          <span className="text-slate-400 dark:text-slate-500">Caso {currentCaseIndex + 1} de {SIMULATION_CASES.length}</span>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{currentCase.title}</h2>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className="font-semibold text-slate-900 dark:text-white block mb-1">Situación planteada:</span>
            {currentCase.context}
          </div>
        </div>

        {/* Options List */}
        <div className="mt-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            ¿Qué decisión debería tomar el aprendiz según el reglamento?
          </h3>

          {currentCase.options.map((option, optIdx) => {
            const isChosen = chosenOptionId === option.id;
            const hasChosenAny = !!chosenOptionId;

            let cardStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:border-[#39A900]/60 hover:bg-emerald-50/20 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';
            if (hasChosenAny) {
              if (option.isCorrect) {
                cardStyle = 'border-emerald-500 dark:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-medium';
              } else if (isChosen && !option.isCorrect) {
                cardStyle = 'border-rose-400 dark:border-rose-600 bg-rose-50/50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200';
              } else {
                cardStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 opacity-50 text-slate-400 dark:text-slate-500';
              }
            }

            return (
              <button
                key={option.id}
                disabled={hasChosenAny}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start gap-3 ${cardStyle}`}
              >
                <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  {String.fromCharCode(65 + optIdx)}
                </div>
                <div className="flex-1">
                  <span>{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Consequence Feedback Deck */}
        {chosenOption && (
          <div
            className={`mt-6 p-5 rounded-xl border ${
              chosenOption.isCorrect
                ? 'bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                : 'bg-rose-50/80 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {chosenOption.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">
                    {chosenOption.isCorrect ? '¡Decisión Correcta!' : 'Decisión Contradictoria al Reglamento'}
                  </span>
                  <span className="text-xs font-mono font-semibold">
                    {chosenOption.isCorrect ? `+${chosenOption.points} pts` : '0 pts'}
                  </span>
                </div>
                <p className="text-xs md:text-sm leading-relaxed">{chosenOption.consequence}</p>
                <div className="pt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500 dark:text-slate-400">Fundamento Normativo: </span>
                  <span>{chosenOption.regulationReference}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between">
              <button
                onClick={handleResetCase}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reintentar este caso</span>
              </button>

              {currentCaseIndex < SIMULATION_CASES.length - 1 ? (
                <button
                  onClick={() => setCurrentCaseIndex((prev) => prev + 1)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Siguiente Caso</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                onGoToQuiz && (
                  <button
                    onClick={onGoToQuiz}
                    className="px-4 py-2 bg-[#39A900] text-white text-xs font-bold rounded-lg hover:bg-[#329200] transition-colors flex items-center gap-1.5"
                  >
                    <span>Ir a la Evaluación Gamificada</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Completion Banner */}
      {allCompleted && (
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <div>
            <h4 className="text-base font-bold text-emerald-950 dark:text-emerald-200">
              ¡Completaste todos los dilemas éticos!
            </h4>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
              Has demostrado un criterio sólido frente a las situaciones reales del SENA. Ahora estás listo para presentar la evaluación oficial y obtener tu certificado.
            </p>
          </div>
          {onGoToQuiz && (
            <button
              onClick={onGoToQuiz}
              className="px-5 py-2.5 bg-[#39A900] hover:bg-[#329200] text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-xs"
            >
              Comenzar Examen de Certificación
            </button>
          )}
        </div>
      )}
    </div>
  );
};
