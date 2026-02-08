import React, { useState } from 'react';
import { LanguageProfile, Theme } from '../types';
import { LANGUAGE_PROFILES } from '../constants';
import { ChevronDown, Check } from 'lucide-react';

interface PracticeLanguageSelectorProps {
  selectedLanguage: LanguageProfile;
  onSelect: (profile: LanguageProfile) => void;
  theme: Theme;
}

export const PracticeLanguageSelector: React.FC<PracticeLanguageSelectorProps> = ({
  selectedLanguage,
  onSelect,
  theme,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-5 py-2.5 rounded-full font-bold text-base shadow-lg transition-all transform hover:scale-105 active:scale-95 border border-transparent
          ${theme.colors.primary} ${theme.colors.primaryText} ring-2 ring-white/20`}
      >
        <span className="text-2xl">{selectedLanguage.flag}</span>
        <span className="hidden sm:inline">{selectedLanguage.name}</span>
        <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className={`absolute top-full mt-3 left-1/2 -translate-x-1/2 w-72 max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl border ${theme.colors.border} ${theme.colors.card} z-50 p-2 animate-fadeIn`}>
            <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${theme.colors.subText}`}>
              Select Language
            </div>
            <div className="space-y-1">
              {LANGUAGE_PROFILES.map((profile) => {
                const isSelected = selectedLanguage.id === profile.id;
                return (
                  <button
                    key={profile.id}
                    onClick={() => {
                      onSelect(profile);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors text-left
                      ${isSelected 
                        ? `${theme.colors.primary.replace('bg-', 'bg-opacity-10 bg-')} ${theme.colors.accent}` 
                        : `hover:bg-slate-100 dark:hover:bg-slate-800 ${theme.colors.text}`
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{profile.flag}</span>
                      <div>
                        <div className="font-semibold text-sm">{profile.name}</div>
                        <div className={`text-xs ${theme.colors.subText} font-normal`}>{profile.nativeName}</div>
                      </div>
                    </div>
                    {isSelected && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};