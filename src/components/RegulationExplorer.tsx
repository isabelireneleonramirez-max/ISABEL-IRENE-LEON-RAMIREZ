import React, { useState } from 'react';
import { BookOpen, CheckCircle, ChevronDown, ChevronUp, FileText, Info, Search, ShieldAlert, ShieldCheck } from 'lucide-react';
import { RegulationItem, SENA_REGULATION_ARTICLES } from '../data/senaRegulationData';

export const RegulationExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  const categories = [
    { id: 'todos', label: 'Todos los Artículos' },
    { id: 'derecho', label: 'Derechos del Aprendiz' },
    { id: 'deber', label: 'Deberes Institucionales' },
    { id: 'prohibicion', label: 'Prohibiciones' },
    { id: 'falta', label: 'Faltas Disciplinarias' },
    { id: 'medida', label: 'Medidas Formativas' },
    { id: 'novedad', label: 'Novedades de Matrícula' },
    { id: 'etapa_productiva', label: 'Etapa Productiva' },
  ];

  const filteredArticles = SENA_REGULATION_ARTICLES.filter((item) => {
    const matchesCategory = activeCategory === 'todos' || item.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.article.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q)) ||
      item.practicalExample.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const getCategoryBadgeColor = (category: RegulationItem['category']) => {
    switch (category) {
      case 'derecho':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'deber':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'prohibicion':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'falta':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'medida':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'novedad':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'etapa_productiva':
        return 'text-teal-700 bg-teal-50 border-teal-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title & Context Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xs transition-colors">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-[#39A900] font-semibold mb-2">
            <span>Marco Jurídico Institucional</span>
            <span aria-hidden="true">·</span>
            <span>Acuerdo 009 de 2024</span>
            <span aria-hidden="true">·</span>
            <span>Vigente</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Compendio Normativo del Aprendiz SENA
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Explora los derechos, deberes y protocolos de convivencia que garantizan tu desarrollo integral. Este articulado incorpora las disposiciones del Acuerdo 009 de 2024, haciendo énfasis en la cultura del respeto, la equidad, el debido proceso y la honestidad académica.
          </p>
        </div>

        {/* Search bar */}
        <div className="mt-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por palabra clave (ej. carné, inasistencia, EPP, plagio, aplazamiento, Zajuna)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl font-medium transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Interactive Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-5 scrollbar-thin">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Unboxed Metadata */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
        <div>
          <span>Mostrando {filteredArticles.length} artículos encontrados</span>
          <span aria-hidden="true" className="mx-2">·</span>
          <span>Acuerdo 009 de 2024</span>
        </div>
        <span>Haz clic en cada artículo para ver el texto reglamentario completo</span>
      </div>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredArticles.map((item) => {
          const isExpanded = expandedArticleId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Clean unboxed header metadata with dot separators (Zero-Pill compliant) */}
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="font-semibold text-[#00324D] dark:text-emerald-400">{item.article}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{item.category.replace('_', ' ')}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] uppercase">Prioridad {item.importance}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {item.summary}
                </p>

                {/* Practical Example Box */}
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg p-3 text-xs text-slate-700 dark:text-slate-300 mb-4">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">
                    Aplicación práctica en tu vida de aprendiz:
                  </span>
                  <span>{item.practicalExample}</span>
                </div>

                {/* Expanded text */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2 bg-emerald-50/40 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 block">Texto Jurídico Completo:</span>
                    <p className="leading-relaxed italic">{item.fullText}</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs mt-3">
                {/* Clean unboxed tags */}
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[11px]">
                  {item.tags.map((tag, i) => (
                    <React.Fragment key={tag}>
                      <span>#{tag}</span>
                      {i < item.tags.length - 1 && <span aria-hidden="true">·</span>}
                    </React.Fragment>
                  ))}
                </div>

                <button
                  onClick={() => setExpandedArticleId(isExpanded ? null : item.id)}
                  className="flex items-center gap-1 text-[#39A900] hover:text-[#2d8500] dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold text-xs transition-colors"
                >
                  <span>{isExpanded ? 'Ver menos' : 'Ver articulado'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredArticles.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <p className="text-base font-semibold text-slate-800 dark:text-white">No se encontraron artículos con esa búsqueda</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Prueba con términos como: carné, inasistencia, EPP, plagio o aplazamiento.</p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('todos'); }}
            className="mt-4 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Restablecer Filtros
          </button>
        </div>
      )}
    </div>
  );
};
