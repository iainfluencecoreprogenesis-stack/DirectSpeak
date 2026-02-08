import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { ConnectionState, LanguageProfile, TranscriptItem } from '../types';
import { MODEL_NAME, SAMPLE_RATE_INPUT, SAMPLE_RATE_OUTPUT } from '../constants';
import { base64ToBytes, decodeAudioData, createPcmBlob } from '../utils/audioUtils';

export function useGeminiLive() {
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [volumeState, setVolumeState] = useState({ input: 0, output: 0 });
  const [error, setError] = useState<string | null>(null);

  // Refs for audio contexts and processing to avoid re-renders
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  
  // Ref for transcript building (handling partials)
  const currentTurnRef = useRef<{ input: string; output: string }>({ input: '', output: '' });

  const connect = useCallback(async (profile: LanguageProfile, selectedVoiceName: string) => {
    try {
      setConnectionState(ConnectionState.CONNECTING);
      setError(null);

      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API key is missing. Please check your configuration.");
      }

      // Initialize Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error("Your browser does not support the Web Audio API.");
      }

      const inputCtx = new AudioContextClass({ sampleRate: SAMPLE_RATE_INPUT });
      const outputCtx = new AudioContextClass({ sampleRate: SAMPLE_RATE_OUTPUT });
      
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      // Get Microphone Stream
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e: any) {
        let msg = "Microphone permission denied.";
        if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
            msg = "Microphone access denied. Please allow permissions in your browser settings.";
        } else if (e.name === 'NotFoundError') {
            msg = "No microphone device found.";
        } else if (e.name === 'NotReadableError') {
            msg = "Microphone is currently busy or not readable.";
        }
        throw new Error(msg);
      }
      mediaStreamRef.current = stream;

      // Initialize Gemini Client
      const ai = new GoogleGenAI({ apiKey });

      const config = {
        // Use string 'AUDIO' to avoid potential enum resolution issues
        responseModalities: ['AUDIO' as Modality],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoiceName } },
        },
        systemInstruction: profile.systemInstruction,
        inputAudioTranscription: { }, // Enable transcription for user input
        outputAudioTranscription: { }, // Enable transcription for model output
      };

      const sessionPromise = ai.live.connect({
        model: MODEL_NAME,
        config,
        callbacks: {
          onopen: () => {
            setConnectionState(ConnectionState.CONNECTED);
            
            // Setup Input Processing
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Simple volume calculation for visualization
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              const rms = Math.sqrt(sum / inputData.length);
              setVolumeState(prev => ({ ...prev, input: Math.min(rms * 5, 1) })); // Amplify a bit for visual

              const pcmBlob = createPcmBlob(inputData);
              
              // Send to Gemini
              if (sessionPromiseRef.current) {
                sessionPromiseRef.current.then(session => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              }
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             // Handle Audio Output
             const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (base64Audio) {
               if (outputCtx.state === 'suspended') {
                  await outputCtx.resume();
               }

               const audioBuffer = await decodeAudioData(
                 base64ToBytes(base64Audio),
                 outputCtx,
                 SAMPLE_RATE_OUTPUT,
                 1
               );

               // Calculate output volume for visualization
               const pcmData = audioBuffer.getChannelData(0);
               let sum = 0;
               // Sample a few points for efficiency
               for(let i=0; i<pcmData.length; i+=10) sum += pcmData[i] * pcmData[i];
               const rms = Math.sqrt(sum / (pcmData.length/10));
               setVolumeState(prev => ({ ...prev, output: Math.min(rms * 3, 1) }));

               const source = outputCtx.createBufferSource();
               source.buffer = audioBuffer;
               source.connect(outputCtx.destination);
               
               source.addEventListener('ended', () => {
                 audioSourcesRef.current.delete(source);
                 // Decay volume
                 setVolumeState(prev => ({ ...prev, output: 0 }));
               });

               // Ensure smooth playback
               nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
               source.start(nextStartTimeRef.current);
               nextStartTimeRef.current += audioBuffer.duration;
               
               audioSourcesRef.current.add(source);
             }

             // Handle Interruption
             if (message.serverContent?.interrupted) {
               audioSourcesRef.current.forEach(src => src.stop());
               audioSourcesRef.current.clear();
               nextStartTimeRef.current = 0;
               currentTurnRef.current.output = ''; // Reset partial output
             }

             // Handle Transcriptions
             const outputText = message.serverContent?.outputTranscription?.text;
             const inputText = message.serverContent?.inputTranscription?.text;
             
             if (outputText) {
                currentTurnRef.current.output += outputText;
                updateTranscript('model', currentTurnRef.current.output, false);
             }
             if (inputText) {
                currentTurnRef.current.input += inputText;
                updateTranscript('user', currentTurnRef.current.input, false);
             }

             if (message.serverContent?.turnComplete) {
                // Finalize the turn
                if (currentTurnRef.current.input) {
                    updateTranscript('user', currentTurnRef.current.input, true);
                }
                if (currentTurnRef.current.output) {
                    updateTranscript('model', currentTurnRef.current.output, true);
                }
                // Reset for next turn
                currentTurnRef.current = { input: '', output: '' };
             }
          },
          onclose: (event: CloseEvent) => {
            console.log("Gemini session closed:", event);
            setConnectionState(ConnectionState.DISCONNECTED);
          },
          onerror: (err: any) => {
            console.error("Gemini Live Error:", err);
            let errorMessage = "An unexpected connection error occurred.";

            // Attempt to extract message
            const rawMessage = err instanceof Error ? err.message : (err?.message || String(err));
            
            if (rawMessage.includes("401") || rawMessage.includes("Unauthenticated")) {
                errorMessage = "Authentication failed. Please check your API key.";
            } else if (rawMessage.includes("403")) {
                errorMessage = "Access denied. Your API key may lack permissions.";
            } else if (rawMessage.includes("429")) {
                errorMessage = "Usage limit exceeded. Please try again later.";
            } else if (rawMessage.includes("503") || rawMessage.includes("500")) {
                errorMessage = "Service unavailable. Google Gemini is experiencing issues.";
            } else if (rawMessage.includes("not found")) {
                errorMessage = "Model not found or not supported in your region.";
            } else if (rawMessage) {
                errorMessage = rawMessage;
            }

            setError(errorMessage);
            setConnectionState(ConnectionState.ERROR);
          }
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect");
      setConnectionState(ConnectionState.ERROR);
    }
  }, []);

  const disconnect = useCallback(async () => {
    // Stop audio tracks
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
    }

    // Close Audio Contexts
    if (inputAudioContextRef.current) {
        await inputAudioContextRef.current.close();
        inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
        await outputAudioContextRef.current.close();
        outputAudioContextRef.current = null;
    }

    // Stop all playing sources
    audioSourcesRef.current.forEach(source => source.stop());
    audioSourcesRef.current.clear();

    // Close the Gemini Session to prevent "Service Unavailable" errors on reconnect
    if (sessionPromiseRef.current) {
        try {
            const session = await sessionPromiseRef.current;
            session.close();
        } catch (e) {
            console.error("Error closing session:", e);
        }
        sessionPromiseRef.current = null;
    }

    setConnectionState(ConnectionState.DISCONNECTED);
    setTranscripts([]);
    setVolumeState({ input: 0, output: 0 });
  }, []);

  const updateTranscript = (role: 'user' | 'model', text: string, isFinal: boolean) => {
    setTranscripts(prev => {
        const last = prev[prev.length - 1];
        if (last && last.role === role && last.isPartial) {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = {
                ...last,
                text: text,
                isPartial: !isFinal
            };
            return newHistory;
        } else {
            return [...prev, {
                id: Date.now().toString(),
                role,
                text,
                timestamp: new Date(),
                isPartial: !isFinal
            }];
        }
    });
  };

  return {
    connect,
    disconnect,
    connectionState,
    volumeState,
    transcripts,
    error
  };
}