import React, { useState } from 'react';
import { THEMES } from '../constants';
import { Theme } from '../types';
import { Palette } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onSelectTheme: (theme: Theme) => void;
  theme: Theme; // For styling the button itself
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onSelectTheme, theme }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${theme.colors.card} ${theme.colors.border} border shadow-sm ${theme.colors.text} hover:opacity-80`}
      >
        <Palette size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-64 grid grid-cols-2 gap-3 animate-fadeIn">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                onSelectTheme(t);
                setIsOpen(false);
              }}
              className={`flex flex-col items-center gap-2 p-2 rounded-lg border transition-all
                ${currentTheme.id === t.id ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-slate-100 hover:bg-slate-50'}
              `}
            >
              {/* Miniature Preview */}
              <div className={`w-full h-12 rounded-md ${t.colors.bg} flex items-center justify-center relative overflow-hidden border ${t.colors.border}`}>
                 <div className={`w-8 h-8 rounded-full ${t.colors.card} shadow-sm flex items-center justify-center`}>
                    <div className={`w-4 h-4 rounded-full ${t.colors.primary}`}></div>
                 </div>
              </div>
              <span className="text-xs font-medium text-slate-700">{t.name}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* Overlay to close */}
      {isOpen && (
        <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)}></div>
      )}
    </div>
  );
};