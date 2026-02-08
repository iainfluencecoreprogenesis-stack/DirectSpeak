export interface LanguageProfile {
  id: string;
  name: string;
  nativeName: string; // For the language selector
  flag: string;
  voiceName: string; // Default voice
  availableVoices: string[]; // Options
  systemInstruction: string;
  avatarNeutral: string; // Emoji when silent
  avatarTalking: string; // Emoji when talking
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    bg: string;
    card: string;
    text: string;
    subText: string;
    primary: string;
    primaryText: string;
    accent: string;
    border: string;
  };
}

export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR',
}

export interface TranscriptItem {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isPartial?: boolean;
}

export interface AudioVolumeState {
  inputVolume: number; // 0-1
  outputVolume: number; // 0-1
}