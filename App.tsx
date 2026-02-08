import React, { useState, useEffect, useRef } from 'react';
import { useGeminiLive } from './hooks/useGeminiLive';
import { LANGUAGE_PROFILES, THEMES, TRANSLATIONS } from './constants';
import { ConnectionState, LanguageProfile, Theme } from './types';
import { AvatarVisualizer } from './components/AvatarVisualizer';
import { ThemeSelector } from './components/ThemeSelector';
import { PracticeLanguageSelector } from './components/PracticeLanguageSelector';
import { Mic, Square, AlertCircle, MessageSquare, Globe } from 'lucide-react';

export default function App() {
  const { 
    connect, 
    disconnect, 
    connectionState, 
    volumeState, 
    transcripts, 
    error 
  } = useGeminiLive();
  
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageProfile>(LANGUAGE_PROFILES[0]);
  const [currentVoice, setCurrentVoice] = useState<string>(LANGUAGE_PROFILES[0].voiceName);
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
  const [interfaceLang, setInterfaceLang] = useState<string>('spanish');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Translations helper
  const t = TRANSLATIONS[interfaceLang] || TRANSLATIONS['english'];

  // Auto-scroll transcript
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  const handleLanguageSelect = (profile: LanguageProfile) => {
    if (connectionState === ConnectionState.CONNECTED || connectionState === ConnectionState.CONNECTING) return;
    setSelectedLanguage(profile);
    setCurrentVoice(profile.voiceName);
  };

  const handleToggleConnection = () => {
    if (connectionState === ConnectionState.CONNECTED || connectionState === ConnectionState.CONNECTING) {
      disconnect();
    } else {
      connect(selectedLanguage, currentVoice);
    }
  };

  const isConnected = connectionState === ConnectionState.CONNECTED;
  const isConnecting = connectionState === ConnectionState.CONNECTING;

  return (
    <div className={`min-h-screen ${currentTheme.colors.bg} transition-colors duration-300 flex flex-col items-center font-sans`}>
      {/* Header */}
      <header className={`w-full ${currentTheme.colors.card} border-b ${currentTheme.colors.border} py-3 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between sticky top-0 z-40 shadow-sm gap-4 md:gap-0`}>
        
        {/* Logo Area */}
        <div className="flex items-center gap-2">
            <div className={`${currentTheme.colors.primary} p-2 rounded-lg text-white shadow-md`}>
                <MessageSquare size={20} />
            </div>
            <h1 className={`text-xl font-bold ${currentTheme.colors.text} tracking-tight hidden sm:block`}>
                {t.header_title}
            </h1>
        </div>
        
        {/* Center: Main Language Selector */}
        <div className="flex-1 flex justify-center w-full md:w-auto order-3 md:order-2">
           <PracticeLanguageSelector 
              selectedLanguage={selectedLanguage}
              onSelect={handleLanguageSelect}
              theme={currentTheme}
           />
        </div>

        {/* Right: Settings */}
        <div className="flex items-center gap-3 order-2 md:order-3">
            {/* Interface Language Selector */}
            <div className="relative group">
                <button className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${currentTheme.colors.border} ${currentTheme.colors.text} ${currentTheme.colors.card} hover:opacity-80 transition-colors`}>
                    <Globe size={18} />
                    <span className="text-sm font-medium uppercase">{interfaceLang.slice(0, 2)}</span>
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 hidden group-hover:block p-2 max-h-64 overflow-y-auto z-50">
                    {LANGUAGE_PROFILES.map(lang => (
                        <button 
                            key={lang.id}
                            onClick={() => setInterfaceLang(lang.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-50 flex items-center gap-2 ${interfaceLang === lang.id ? 'font-bold text-indigo-600' : 'text-slate-700'}`}
                        >
                            <span>{lang.flag}</span>
                            {lang.nativeName}
                        </button>
                    ))}
                </div>
            </div>

            {/* Theme Selector */}
            <ThemeSelector 
                currentTheme={currentTheme} 
                onSelectTheme={setCurrentTheme} 
                theme={currentTheme}
            />
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-80px)]">
        
        {/* Left Column: Controls & Visualizer */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full justify-center">
            
            {/* Status Card / Avatar */}
            <div className={`${currentTheme.colors.card} rounded-[2rem] shadow-2xl border ${currentTheme.colors.border} p-8 flex flex-col items-center justify-center min-h-[500px] transition-colors duration-300 relative overflow-hidden bg-opacity-50`}>
                
                <AvatarVisualizer 
                    profile={selectedLanguage}
                    inputVolume={volumeState.input} 
                    outputVolume={volumeState.output} 
                    isActive={isConnected}
                    theme={currentTheme}
                />
                
                <div className="mt-8 flex flex-col items-center gap-2 z-10">
                    <h2 className={`text-3xl font-bold ${currentTheme.colors.text} text-center`}>
                        {isConnected ? `${t.status_speaking} ${selectedLanguage.name}` : t.status_ready}
                    </h2>
                    <p className={`${currentTheme.colors.subText} text-center max-w-xs text-sm`}>
                        {isConnected ? t.desc_connected : t.desc_ready}
                    </p>
                </div>

                <button
                    onClick={handleToggleConnection}
                    disabled={isConnecting}
                    className={`mt-10 px-10 py-5 rounded-full font-bold text-xl flex items-center gap-4 transition-all transform hover:scale-105 active:scale-95 shadow-xl z-10
                        ${isConnected 
                            ? 'bg-red-500 text-white hover:bg-red-600 ring-4 ring-red-100 shadow-red-500/30' 
                            : `${currentTheme.colors.primary} ${currentTheme.colors.primaryText} hover:opacity-90 ring-4 ring-white/20 shadow-lg`
                        } ${isConnecting ? 'opacity-70 cursor-wait' : ''}`}
                >
                    {isConnecting ? (
                        <>
                           <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t.btn_connecting}
                        </>
                    ) : isConnected ? (
                        <>
                            <Square size={24} fill="currentColor" />
                            {t.btn_disconnect}
                        </>
                    ) : (
                        <>
                            <Mic size={24} />
                            {t.btn_connect}
                        </>
                    )}
                </button>

                 {error && (
                    <div className="absolute bottom-4 left-4 right-4 p-3 bg-red-50/90 border border-red-100 text-red-600 rounded-xl text-sm flex items-center justify-center gap-2 backdrop-blur-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}
            </div>
        </div>

        {/* Right Column: Transcript */}
        <div className={`lg:col-span-7 ${currentTheme.colors.card} rounded-[2rem] shadow-xl border ${currentTheme.colors.border} flex flex-col h-[500px] lg:h-full overflow-hidden transition-colors duration-300`}>
            <div className={`p-5 border-b ${currentTheme.colors.border} ${currentTheme.colors.bg} bg-opacity-50 flex justify-between items-center backdrop-blur-md`}>
                <h3 className={`font-semibold ${currentTheme.colors.text} text-lg`}>{t.lbl_transcript}</h3>
                <span className={`text-xs font-medium ${currentTheme.colors.subText} bg-black/5 px-3 py-1.5 rounded-full`}>
                    {transcripts.length > 0 ? (isConnected ? t.status_listening : 'Finished') : 'Waiting...'}
                </span>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                {transcripts.length === 0 && (
                    <div className={`h-full flex flex-col items-center justify-center ${currentTheme.colors.subText} opacity-30`}>
                         <MessageSquare size={64} className="mb-6" />
                         <p className="text-lg font-medium">{t.desc_ready}</p>
                    </div>
                )}
                
                {transcripts.map((item) => (
                    <div 
                        key={item.id} 
                        className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-sm ${
                            item.role === 'user' 
                                ? `${currentTheme.colors.primary} ${currentTheme.colors.primaryText} rounded-tr-none` 
                                : `${currentTheme.colors.bg} ${currentTheme.colors.text} border ${currentTheme.colors.border} rounded-tl-none`
                        }`}>
                             <div className="text-base leading-relaxed whitespace-pre-wrap">
                                 {item.text}
                                 {item.isPartial && (
                                     <span className="inline-block w-2 h-4 ml-1 bg-current opacity-60 animate-pulse"/>
                                 )}
                             </div>
                             <div className={`text-[10px] mt-2 opacity-60 font-medium ${item.role === 'user' ? 'text-white/80' : currentTheme.colors.subText} text-right`}>
                                 {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </main>
    </div>
  );
}