import React from 'react';

interface VisualizerProps {
  inputVolume: number;
  outputVolume: number;
  isActive: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ inputVolume, outputVolume, isActive }) => {
  // We'll use a CSS-based approach for smooth animation
  // Determine who is "speaking" more
  const isUserSpeaking = inputVolume > 0.05;
  const isAgentSpeaking = outputVolume > 0.05;

  const getScale = (vol: number) => 1 + Math.min(vol * 2, 0.5);

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Outer Glow - Agent */}
        <div 
            className={`absolute inset-0 rounded-full bg-blue-400 opacity-20 transition-all duration-100 ease-out`}
            style={{ 
                transform: `scale(${isAgentSpeaking ? getScale(outputVolume) * 1.5 : 1})`,
                opacity: isAgentSpeaking ? 0.3 : 0.1
            }}
        />
        
        {/* Inner Glow - User */}
         <div 
            className={`absolute inset-4 rounded-full bg-green-400 opacity-20 transition-all duration-100 ease-out`}
            style={{ 
                transform: `scale(${isUserSpeaking ? getScale(inputVolume) * 1.2 : 1})`,
                opacity: isUserSpeaking ? 0.3 : 0.1
            }}
        />

        {/* Core Circle */}
        <div className={`relative z-10 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl flex items-center justify-center transition-all duration-300 ${isActive ? 'shadow-indigo-500/50' : ''}`}>
            {isActive ? (
                <div className="flex gap-1 items-center justify-center h-8">
                    {/* Fake waveform animation */}
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                            key={i}
                            className="w-1 bg-white/80 rounded-full transition-all duration-75"
                            style={{
                                height: `${Math.max(4, Math.random() * (isAgentSpeaking ? outputVolume * 100 : 10) + (isUserSpeaking ? inputVolume * 80 : 0) + 10)}px`
                            }}
                        />
                    ))}
                </div>
            ) : (
                 <svg className="w-12 h-12 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            )}
        </div>
        
        {/* Status Text */}
        <div className="absolute -bottom-10 text-xs font-medium text-slate-500 uppercase tracking-wider">
            {isActive ? (isAgentSpeaking ? 'AI Speaking' : (isUserSpeaking ? 'Listening' : 'Connected')) : 'Ready'}
        </div>
    </div>
  );
};