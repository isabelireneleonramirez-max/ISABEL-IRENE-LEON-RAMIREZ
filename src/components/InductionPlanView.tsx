import React, { useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle, Clock, FileCheck, Layers, ShieldCheck, Sparkles, Target, Users } from 'lucide-react';
import { INDUCTION_PLAN, SENA_CORE_VALUES } from '../data/senaRegulationData';

interface InductionPlanViewProps {
  onStartQuiz: () => void;
  onExploreRegulation: () => void;
  onStartSimulator: () => void;
}

export const InductionPlanView: React.FC<InductionPlanViewProps> = ({
  onStartQuiz,
  onExploreRegulation,
  onStartSimulator,
}) => {
  const [selectedPhase, setSelectedPhase] = useState(INDUCTION_PLAN[0]);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section with Institutional SENA Campus Photography */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 text-white shadow-sm">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/sena_campus_modern_1792526597516.jpg"
            alt="Campus de Formación Profesional Integral del SENA"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-3xl px-8 py-12 md:py-16">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-3">
            <span>Servicio Nacional de Aprendizaje</span>
            <span aria-hidden="true">·</span>
            <span>Reglamento Acuerdo 009 de 2024</span>
            <span aria-hidden="true">·</span>
            <span>Inducción Integral</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight text-balance">
            Plan Estructurado de Inducción del Aprendiz SENA
          </h1>

          <p className="text-base md:text-lg text-slate-300 mb-8 leading-relaxed">
            Bienvenido a tu proceso formativo. Esta plataforma te guía paso a paso por la cultura institucional, tus derechos, deberes y el régimen disciplinario actualizado bajo el <strong>Acuerdo 009 de 2024</strong>, culminando en tu evaluación gamificada y certificado digital verificable.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onStartSimulator}
              className="px-5 py-2.5 bg-[#39A900] hover:bg-[#329200] text-white font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              <span>Explorar Simulador de Casos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreRegulation}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-sm rounded-lg backdrop-blur-sm transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Consultar Reglamento 2024</span>
            </button>
          </div>
        </div>
      </section>

      {/* Highlights & Regulation Context */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs transition-colors">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5 text-[#39A900]" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Acuerdo 009 de 2024</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Reemplaza formalmente los acuerdos anteriores (Acuerdos 07 de 2012 y 02 de 2014), fortaleciendo la inclusión, la digitalización en Zajuna y las garantías del debido proceso.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs transition-colors">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-sky-950/50 text-blue-700 dark:text-sky-300 flex items-center justify-center mb-4">
            <Target className="w-5 h-5 text-[#00324D] dark:text-sky-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Evaluación Gamificada</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Dilemas interactivos con situaciones cotidianas de taller, evidencias virtuales y convivencia ciudadana, con retroalimentación instantánea sobre cada artículo.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs transition-colors">
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-4">
            <FileCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Certificación Oficial Digital</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Al alcanzar un puntaje igual o superior al 80% en el desafío normativo, el sistema emite automáticamente tu certificado oficial con código de verificación QR.
          </p>
        </div>
      </section>

      {/* Structured 5-Phase Timeline Explorer */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Metodología SENA</span>
              <span aria-hidden="true">·</span>
              <span>32 Horas Totales</span>
              <span aria-hidden="true">·</span>
              <span>5 Fases Pedagógicas</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Cronograma y Fases del Plan de Inducción
            </h2>
          </div>
          <button
            onClick={onStartQuiz}
            className="self-start md:self-auto px-4 py-2 bg-[#00324D] hover:bg-[#002538] dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            Presentar Evaluación Final
          </button>
        </div>

        {/* Phase selector tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6">
          {INDUCTION_PLAN.map((phase) => {
            const isSelected = selectedPhase.id === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase)}
                className={`p-3 text-left rounded-xl transition-all border ${
                  isSelected
                    ? 'border-[#39A900] bg-emerald-50/70 dark:bg-emerald-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1">Fase {phase.number}</div>
                <div className={`text-xs font-semibold line-clamp-2 ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                  {phase.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{phase.duration.split('·')[1]?.trim() || phase.duration}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Phase Detail Deck */}
        <div className="mt-8 p-6 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-colors">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div>
                <span className="text-xs font-bold tracking-wider text-[#39A900] uppercase">
                  Fase {selectedPhase.number} · {selectedPhase.duration}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{selectedPhase.title}</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">{selectedPhase.objective}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Competencia Clave Desarrollada
                </h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 font-medium">
                  {selectedPhase.competency}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Actividades Principales de la Jornada
                </h4>
                <ul className="space-y-2">
                  {selectedPhase.activities.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#39A900] mt-2 shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="w-full lg:w-80 shrink-0 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">
                  Entregable Oficial
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>{selectedPhase.deliverable}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-2">
                  Acción Recomendada
                </div>
                {selectedPhase.id === 'fase-2' ? (
                  <button
                    onClick={onExploreRegulation}
                    className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#329200] rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Abrir Articulado 009/2024</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : selectedPhase.id === 'fase-4' || selectedPhase.id === 'fase-3' ? (
                  <button
                    onClick={onStartSimulator}
                    className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#00324D] hover:bg-[#002538] dark:bg-emerald-700 dark:hover:bg-emerald-600 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Practicar con Casos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={onStartQuiz}
                    className="w-full py-2 px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Ir a Evaluación de Saberes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SENA Core Values Section */}
      <section className="p-8 bg-slate-900 text-white rounded-2xl">
        <div className="max-w-2xl mb-8">
          <div className="text-xs text-emerald-400 font-semibold mb-1 uppercase tracking-wider">
            Principios Éticos Institucionales
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Valores Fundamentales de la Comunidad SENA
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            La formación profesional integral concibe al aprendiz como un ciudadano ético, libre y comprometido con la convivencia y el desarrollo del país.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SENA_CORE_VALUES.map((val, idx) => (
            <div key={idx} className="p-5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xs">
              <div className="text-emerald-400 text-sm font-bold mb-2">0{idx + 1}.</div>
              <h3 className="text-base font-bold text-white mb-2">{val.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
