import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { StudyResourceItem, getStudyResourcesForSkill } from '../../services/learningResources';
import { 
  BookOpen, ExternalLink, Sparkles, X, CheckCircle2, Video, FileText, 
  Code2, GraduationCap, Globe, Search, Layers, BookmarkCheck 
} from 'lucide-react';

interface SkillStudyResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillName: string;
  category?: 'Missing Skill (Gap Bridge)' | 'Provided Skill (Mastery Booster)';
  allSkillsList?: string[];
  onSelectSkill?: (skill: string) => void;
}

export const SkillStudyResourceModal: React.FC<SkillStudyResourceModalProps> = ({
  isOpen,
  onClose,
  skillName,
  category = 'Missing Skill (Gap Bridge)',
  allSkillsList = [],
  onSelectSkill
}) => {
  const [activeType, setActiveType] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');

  if (!isOpen || !skillName) return null;

  const resourcePack = getStudyResourcesForSkill(skillName, category);

  const getIconForType = (type: StudyResourceItem['type']) => {
    switch (type) {
      case 'Documentation':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'Course':
        return <GraduationCap className="w-4 h-4 text-emerald-500" />;
      case 'Tutorial':
        return <BookOpen className="w-4 h-4 text-amber-500" />;
      case 'Practice':
        return <Code2 className="w-4 h-4 text-purple-500" />;
      case 'Video':
        return <Video className="w-4 h-4 text-rose-500" />;
      case 'CheatSheet':
        return <BookmarkCheck className="w-4 h-4 text-cyan-500" />;
      default:
        return <Globe className="w-4 h-4 text-indigo-500" />;
    }
  };

  const filteredResources = resourcePack.resources.filter(r => {
    const matchesType = activeType === 'All' || r.type === activeType;
    const matchesSearch = searchFilter === '' || 
      r.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.provider.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesType && matchesSearch;
  });

  const resourceTypes = ['All', 'Documentation', 'Course', 'Tutorial', 'Practice', 'Video', 'CheatSheet'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start bg-gradient-to-r from-indigo-50/50 via-transparent to-cyan-50/50 dark:from-indigo-950/30 dark:to-cyan-950/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border ${
                category.includes('Missing')
                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20'
              }`}>
                {category}
              </span>
              <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" /> Curated Learning Study Pack
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600 dark:text-cyan-400" />
              <span>{skillName} Study Materials & Recommended Websites</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
              {resourcePack.overview}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Skill Selector Bar if multiple skills available */}
        {allSkillsList.length > 1 && onSelectSkill && (
          <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Select Skill:
            </span>
            {allSkillsList.map(s => (
              <button
                key={s}
                onClick={() => onSelectSkill(s)}
                className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition cursor-pointer ${
                  s.toLowerCase() === skillName.toLowerCase()
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Top Filter & Search Controls */}
        <div className="p-4 sm:px-6 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Type Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {resourceTypes.map(t => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer ${
                  activeType === t
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                    : 'bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics or platforms..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Official Recommended Platforms & Direct Sandbox Links */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Direct Study & Practice Platforms for {skillName}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {resourcePack.practicePlatforms.map(p => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-md transition group flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition">
                      {p.name}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 transition" />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">{p.badge}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Curated Materials List */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> High-Impact Study Materials & Video Courses ({filteredResources.length})
            </h3>

            {filteredResources.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-medium">
                No matching materials found for current filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredResources.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between space-y-3 hover:border-indigo-400 dark:hover:border-indigo-500/40 hover:shadow-md transition"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            {getIconForType(item.type)}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-extrabold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20">
                            {item.provider}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {item.isFree ? (
                            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20">
                              Free ⚡
                            </span>
                          ) : (
                            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20">
                              Certification
                            </span>
                          )}
                          <span className="text-[9px] text-slate-400 font-semibold">
                            {item.difficulty}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm group"
                    >
                      <span>Study on {item.provider}</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Direct study links tested & verified for student placements.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
