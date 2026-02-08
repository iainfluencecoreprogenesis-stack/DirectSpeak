import React, { useEffect, useState, useRef } from 'react';
import { LanguageProfile, Theme } from '../types';

interface AvatarVisualizerProps {
  profile: LanguageProfile;
  inputVolume: number;
  outputVolume: number;
  isActive: boolean;
  theme: Theme;
}

export const AvatarVisualizer: React.FC<AvatarVisualizerProps> = ({ 
  profile, 
  inputVolume, 
  outputVolume, 
  isActive,
  theme 
}) => {
  const [blink, setBlink] = useState(false);
  const [lookDir, setLookDir] = useState({ x: 0, y: 0 });
  const [smoothVol, setSmoothVol] = useState(0);
  const animationRef = useRef<number>(0);

  // Smooth volume for fluid animation
  useEffect(() => {
    const animate = () => {
      setSmoothVol(prev => prev + (outputVolume - prev) * 0.15); // Interpolate volume
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [outputVolume]);

  const isSpeaking = smoothVol > 0.02;
  const isListening = inputVolume > 0.01;

  // Random Blinking Logic
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const triggerBlink = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
      timeout = setTimeout(triggerBlink, 3000 + Math.random() * 5000);
    };
    timeout = setTimeout(triggerBlink, 3000);
    return () => clearTimeout(timeout);
  }, []);

  // Idle Looking Animation
  useEffect(() => {
    if (isSpeaking) {
       // Focus on user (camera) when speaking
       setLookDir({ x: 0, y: 0 });
       return;
    }
    
    if (isListening) {
        // Slight tilt when listening, but mostly focused
        setLookDir({ x: 0, y: 2 }); // Look slightly down/focused
        return;
    }

    // Idle behavior: Look around randomly
    const interval = setInterval(() => {
      const x = (Math.random() - 0.5) * 30; 
      const y = (Math.random() - 0.5) * 15;
      setLookDir({ x, y });
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isSpeaking, isListening]);

  // Dynamic Styles based on state
  const mouthHeight = Math.max(4, smoothVol * 150); 
  const mouthWidth = 40 + smoothVol * 50; 
  
  const glowColorClass = theme.colors.primary.replace('bg-', 'text-');
  const bgGlowClass = theme.colors.primary;

  // Calculate 3D rotations based on lookDir
  const rotX = isListening ? -5 : -lookDir.y * 0.8; 
  const rotY = isListening ? 0 : lookDir.x * 0.8;
  const rotZ = isListening ? 3 : (lookDir.x * 0.1); 

  return (
    <div className="relative w-80 h-80 flex items-center justify-center perspective-1000">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
      
      {/* 1. Holographic Rings (Background) */}
      <div className={`absolute inset-0 border border-slate-200/20 rounded-full animate-[spin_10s_linear_infinite]`} style={{ transform: 'rotateX(70deg)' }}></div>
      <div className={`absolute inset-4 border border-slate-200/10 rounded-full animate-[spin_15s_linear_infinite_reverse]`} style={{ transform: 'rotateY(60deg)' }}></div>
      
      {/* 2. Ambient Aura */}
      <div 
        className={`absolute inset-10 rounded-full blur-3xl opacity-20 transition-all duration-500 ${bgGlowClass}`}
        style={{ transform: `scale(${isActive ? 1.2 + smoothVol : 0.8})` }}
      />

      {/* 3. The Main 3D Sphere Body Wrapper (Float & Breathe) */}
      <div 
        className="relative w-48 h-48"
        style={{ 
            animation: 'float 6s ease-in-out infinite' 
        }}
      >
        <div 
            className="w-full h-full"
            style={{
                animation: isSpeaking ? 'none' : 'breathe 5s ease-in-out infinite' 
            }}
        >
            {/* The Actual Sphere with Rotation */}
            <div 
                className="w-full h-full rounded-full shadow-2xl transition-transform duration-1000 ease-out will-change-transform"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.8) 50%, rgba(200,210,220,0.8) 100%)',
                    boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.1), inset 10px 10px 20px rgba(255,255,255,1), 0 20px 40px rgba(0,0,0,0.2)',
                    transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`
                }}
            >
                {/* Reflection/Gloss */}
                <div className="absolute top-4 left-8 w-16 h-8 bg-white opacity-60 blur-md rounded-full transform -rotate-12"></div>
                <div className="absolute bottom-6 right-8 w-24 h-24 bg-blue-100 opacity-30 blur-xl rounded-full"></div>

                {/* 4. The Digital Face Screen */}
                <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-28 bg-black rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,1)] ring-2 ring-black/10 transition-transform duration-500"
                style={{
                    // Parallax effect on the face
                    transform: `translate(-50%, -50%) translate(${lookDir.x * 0.2}px, ${lookDir.y * 0.2}px)`
                }}
                >
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none"></div>
                    
                    {/* Eyes Container */}
                    <div 
                        className="flex gap-6 mb-4 transition-all duration-300"
                        style={{ transform: `translate(${lookDir.x * 0.5}px, ${lookDir.y * 0.5}px)` }}
                    >
                        <Eye isListening={isListening} isSpeaking={isSpeaking} blink={blink} theme={theme} />
                        <Eye isListening={isListening} isSpeaking={isSpeaking} blink={blink} theme={theme} />
                    </div>

                    {/* Mouth Visualization */}
                    <div className="relative h-8 flex items-center justify-center">
                        {isSpeaking ? (
                        // Talking Mouth: Dynamic Pill Shape
                        <div 
                            className={`rounded-full transition-all duration-75 ease-out shadow-[0_0_10px_currentColor] ${glowColorClass}`}
                            style={{
                                height: `${mouthHeight}px`,
                                width: `${mouthWidth}px`,
                                backgroundColor: 'currentColor'
                            }}
                        />
                        ) : isListening ? (
                        // Listening: Loading Dots
                        <div className={`flex gap-1.5 ${glowColorClass}`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-current animate-[bounce_1s_infinite_0ms]"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-current animate-[bounce_1s_infinite_200ms]"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-current animate-[bounce_1s_infinite_400ms]"></div>
                        </div>
                        ) : (
                        // Idle: Small Smile
                        <div className={`w-6 h-1 rounded-full opacity-50 ${glowColorClass} bg-current transition-all duration-500`}
                             style={{ transform: `rotate(${lookDir.x * 0.5}deg)` }}
                        ></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 5. Status Ring (Activity Indicator) */}
      <div 
        className={`absolute w-56 h-56 rounded-full border-2 border-dashed transition-all duration-500 ${
           isActive ? (isListening ? 'border-green-400 animate-[spin_4s_linear_infinite]' : 'border-indigo-400 animate-[spin_10s_linear_infinite]') : 'border-slate-300 opacity-20'
        }`}
      />
    </div>
  );
};

// Sub-component for Eyes
const Eye = ({ isListening, isSpeaking, blink, theme }: { isListening: boolean, isSpeaking: boolean, blink: boolean, theme: Theme }) => {
    const baseColor = isListening ? 'bg-green-400' : (isSpeaking ? theme.colors.primary.replace('bg-', 'bg-') : 'bg-blue-400');
    const shadowColor = isListening ? 'shadow-green-400' : (isSpeaking ? theme.colors.primary.replace('bg-', 'shadow-') : 'shadow-blue-400');
    
    let height = 'h-10';
    if (blink) height = 'h-1';
    else if (isListening) height = 'h-11';
    else if (isSpeaking) height = 'h-9';
    
    return (
        <div className={`relative w-8 ${height} ${baseColor} rounded-full transition-all duration-150 shadow-[0_0_15px] ${shadowColor}`}>
            <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full opacity-80 blur-[1px]"></div>
        </div>
    );
};