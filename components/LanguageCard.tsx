import React from 'react';
import { LanguageProfile, Theme } from '../types';
import { TRANSLATIONS } from '../constants';

interface LanguageCardProps {
  profile: LanguageProfile;
  isSelected: boolean;
  onSelect: (profile: LanguageProfile) => void;
  selectedVoice: string;
  onVoiceSelect: (voice: string) => void;
  theme: Theme;
  interfaceLang: string;
}

export const LanguageCard: React.FC<LanguageCardProps> = ({ 
  profile, 
  isSelected, 
  onSelect, 
  selectedVoice, 
  onVoiceSelect,
  theme,
  interfaceLang
}) => {
  const t = TRANSLATIONS[interfaceLang] || TRANSLATIONS['english'];

  return (
    <div 
      onClick={() => onSelect(profile)}
      className={`relative flex flex-col p-4 rounded-xl border transition-all duration-200 cursor-pointer
        ${isSelected 
            ? `${theme.colors.primary.replace('bg-', 'bg-opacity-10 bg-')} ${theme.colors.border} shadow-md ring-1 ring-opacity-50` 
            : `${theme.colors.card} ${theme.colors.border} hover:opacity-80 hover:shadow-sm`
        }`}
      style={{
          borderColor: isSelected ? undefined : undefined // Let tailwind handle it via theme classes
      }}
    >
      <div className="flex items-center w-full">
        <div className="text-3xl mr-4">{profile.flag}</div>
        <div className="flex-1">
          <h3 className={`font-semibold ${isSelected ? theme.colors.accent : theme.colors.text}`}>
              {profile.name} <span className="text-xs opacity-60 font-normal">({profile.nativeName})</span>
          </h3>
          {!isSelected && (
            <p className={`text-xs ${theme.colors.subText}`}>
                {t.lbl_default_voice}: {profile.voiceName}
            </p>
          )}
        </div>
        {isSelected && (
            <div className={`${theme.colors.accent}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
        )}
      </div>

      {isSelected && (
        <div className={`mt-4 pt-3 border-t ${theme.colors.border} animate-fadeIn`}>
          <p className={`text-xs font-medium ${theme.colors.accent} mb-2 uppercase tracking-wide`}>{t.lbl_select_voice}</p>
          <div className="flex flex-wrap gap-2">
            {profile.availableVoices.map(voice => (
              <button
                key={voice}
                onClick={(e) => {
                  e.stopPropagation();
                  onVoiceSelect(voice);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border
                  ${selectedVoice === voice 
                    ? `${theme.colors.primary} ${theme.colors.primaryText} shadow-sm border-transparent` 
                    : `${theme.colors.card} ${theme.colors.subText} ${theme.colors.border} hover:border-current`
                  }`}
              >
                {voice}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};