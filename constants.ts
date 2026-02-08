import { LanguageProfile, Theme } from "./types";

const ALL_VOICES = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];

export const LANGUAGE_PROFILES: LanguageProfile[] = [
  {
    id: "spanish",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    voiceName: "Kore",
    availableVoices: ALL_VOICES,
    avatarNeutral: "👩",
    avatarTalking: "👩‍🏫",
    systemInstruction: "You are a friendly Spanish tutor named Maria. Help the user practice. Speak primarily in Spanish."
  },
  {
    id: "french",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    voiceName: "Fenrir",
    availableVoices: ALL_VOICES,
    avatarNeutral: "👨",
    avatarTalking: "👨‍🎨",
    systemInstruction: "You are a French companion named Pierre. Engage in daily conversations in French."
  },
  {
    id: "japanese",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    voiceName: "Puck",
    availableVoices: ALL_VOICES,
    avatarNeutral: "👱‍♂️",
    avatarTalking: "🙇‍♂️",
    systemInstruction: "You are a polite Japanese teacher named Kenji. Speak in polite Japanese (Desu/Masu)."
  },
  {
    id: "english",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    voiceName: "Zephyr",
    availableVoices: ALL_VOICES,
    avatarNeutral: "👩",
    avatarTalking: "👩‍🎤",
    systemInstruction: "You are an English coach named Sarah. Help with accent and fluency."
  },
  {
    id: "german",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    voiceName: "Charon",
    availableVoices: ALL_VOICES,
    avatarNeutral: "🧔",
    avatarTalking: "🍻",
    systemInstruction: "You are a German friend named Hans. Chat about hobbies and travel in German."
  },
  {
    id: "korean",
    name: "Korean",
    nativeName: "한국어",
    flag: "🇰🇷",
    voiceName: "Kore",
    availableVoices: ALL_VOICES,
    avatarNeutral: "👩",
    avatarTalking: "🙆‍♀️",
    systemInstruction: "You are a friendly Korean tutor named Ji-Min. Help the user practice Korean. Be encouraging and polite."
  },
  {
    id: "chinese",
    name: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
    voiceName: "Fenrir",
    availableVoices: ALL_VOICES,
    avatarNeutral: "🐼",
    avatarTalking: "🐲",
    systemInstruction: "You are a Mandarin Chinese practice partner named Wei. Speak clearly and help with tones."
  },
  {
    id: "russian",
    name: "Russian",
    nativeName: "Русский",
    flag: "🇷🇺",
    voiceName: "Charon",
    availableVoices: ALL_VOICES,
    avatarNeutral: "👱",
    avatarTalking: "🐻",
    systemInstruction: "You are a Russian language guide named Dmitry. Teach common phrases and culture."
  }
];

export const THEMES: Theme[] = [
  {
    id: "light",
    name: "Modern Light",
    colors: {
      bg: "bg-slate-50",
      card: "bg-white",
      text: "text-slate-900",
      subText: "text-slate-500",
      primary: "bg-indigo-600",
      primaryText: "text-white",
      accent: "text-indigo-600",
      border: "border-slate-200"
    }
  },
  {
    id: "dark",
    name: "Midnight",
    colors: {
      bg: "bg-slate-900",
      card: "bg-slate-800",
      text: "text-slate-100",
      subText: "text-slate-400",
      primary: "bg-indigo-500",
      primaryText: "text-white",
      accent: "text-indigo-400",
      border: "border-slate-700"
    }
  },
  {
    id: "cyber",
    name: "Cyber Yellow",
    colors: {
      bg: "bg-zinc-950",
      card: "bg-black",
      text: "text-zinc-100",
      subText: "text-zinc-500",
      primary: "bg-yellow-400",
      primaryText: "text-black",
      accent: "text-yellow-400",
      border: "border-yellow-400/20"
    }
  },
  {
    id: "crimson",
    name: "Crimson Red",
    colors: {
      bg: "bg-neutral-950",
      card: "bg-black",
      text: "text-neutral-100",
      subText: "text-neutral-500",
      primary: "bg-red-600",
      primaryText: "text-white",
      accent: "text-red-600",
      border: "border-red-900/40"
    }
  }
];

export const TRANSLATIONS: Record<string, any> = {
  spanish: {
    header_title: "LinguaLive AI",
    status_ready: "¿Listo para practicar?",
    status_listening: "Escuchando...",
    status_speaking: "Hablando",
    status_connected: "Conectado",
    desc_ready: "Selecciona un compañero y empieza.",
    desc_connected: "Escucha atentamente. La IA te está escuchando.",
    btn_connect: "Empezar Conversación",
    btn_disconnect: "Terminar Sesión",
    btn_connecting: "Conectando...",
    lbl_select_lang: "Elige tu compañero",
    lbl_transcript: "Transcripción en vivo",
    lbl_voice: "Voz",
    lbl_default_voice: "Voz por defecto",
    lbl_select_voice: "SELECCIONAR VOZ"
  },
  english: {
    header_title: "LinguaLive AI",
    status_ready: "Ready to Practice?",
    status_listening: "Listening...",
    status_speaking: "Speaking",
    status_connected: "Connected",
    desc_ready: "Select a language partner below and start.",
    desc_connected: "Listen carefully. The AI is listening.",
    btn_connect: "Start Conversation",
    btn_disconnect: "End Session",
    btn_connecting: "Connecting...",
    lbl_select_lang: "Select Language Partner",
    lbl_transcript: "Live Transcript",
    lbl_voice: "Voice",
    lbl_default_voice: "Default Voice",
    lbl_select_voice: "SELECT VOICE"
  },
  french: {
    header_title: "LinguaLive AI",
    status_ready: "Prêt à pratiquer ?",
    status_listening: "Écoute...",
    status_speaking: "Parle",
    status_connected: "Connecté",
    desc_ready: "Sélectionnez un partenaire ci-dessous.",
    desc_connected: "Écoutez attentivement. L'IA vous écoute.",
    btn_connect: "Commencer",
    btn_disconnect: "Terminer",
    btn_connecting: "Connexion...",
    lbl_select_lang: "Choisissez votre partenaire",
    lbl_transcript: "Transcription en direct",
    lbl_voice: "Voix",
    lbl_default_voice: "Voix par défaut",
    lbl_select_voice: "SÉLECTIONNER VOIX"
  },
  japanese: {
    header_title: "LinguaLive AI",
    status_ready: "練習の準備はいいですか？",
    status_listening: "聞いています...",
    status_speaking: "話しています",
    status_connected: "接続済み",
    desc_ready: "パートナーを選んでください。",
    desc_connected: "よく聞いてください。AIが聞いています。",
    btn_connect: "会話を始める",
    btn_disconnect: "終了する",
    btn_connecting: "接続中...",
    lbl_select_lang: "パートナーを選択",
    lbl_transcript: "ライブ文字起こし",
    lbl_voice: "声",
    lbl_default_voice: "デフォルトの声",
    lbl_select_voice: "声を選択"
  },
  german: {
    header_title: "LinguaLive AI",
    status_ready: "Bereit zum Üben?",
    status_listening: "Hört zu...",
    status_speaking: "Spricht",
    status_connected: "Verbunden",
    desc_ready: "Wähle einen Partner aus.",
    desc_connected: "Hör gut zu. Die KI hört dir zu.",
    btn_connect: "Gespräch beginnen",
    btn_disconnect: "Sitzung beenden",
    btn_connecting: "Verbinden...",
    lbl_select_lang: "Sprachpartner wählen",
    lbl_transcript: "Live-Transkript",
    lbl_voice: "Stimme",
    lbl_default_voice: "Standardstimme",
    lbl_select_voice: "STIMME WÄHLEN"
  },
  korean: {
    header_title: "LinguaLive AI",
    status_ready: "연습할 준비 되셨나요?",
    status_listening: "듣고 있어요...",
    status_speaking: "말하는 중",
    status_connected: "연결됨",
    desc_ready: "아래에서 파트너를 선택하세요.",
    desc_connected: "잘 들어보세요. AI가 듣고 있습니다.",
    btn_connect: "대화 시작",
    btn_disconnect: "세션 종료",
    btn_connecting: "연결 중...",
    lbl_select_lang: "언어 파트너 선택",
    lbl_transcript: "실시간 대본",
    lbl_voice: "목소리",
    lbl_default_voice: "기본 목소리",
    lbl_select_voice: "목소리 선택"
  },
  chinese: {
    header_title: "LinguaLive AI",
    status_ready: "准备好练习了吗？",
    status_listening: "正在聆听...",
    status_speaking: "正在说话",
    status_connected: "已连接",
    desc_ready: "在下方选择一个语言伙伴。",
    desc_connected: "请仔细听。AI正在听你说话。",
    btn_connect: "开始对话",
    btn_disconnect: "结束会话",
    btn_connecting: "正在连接...",
    lbl_select_lang: "选择语言伙伴",
    lbl_transcript: "实时字幕",
    lbl_voice: "声音",
    lbl_default_voice: "默认声音",
    lbl_select_voice: "选择声音"
  },
  russian: {
    header_title: "LinguaLive AI",
    status_ready: "Готовы практиковаться?",
    status_listening: "Слушаю...",
    status_speaking: "Говорю",
    status_connected: "Подключено",
    desc_ready: "Выберите партнера ниже.",
    desc_connected: "Слушайте внимательно. ИИ слушает вас.",
    btn_connect: "Начать разговор",
    btn_disconnect: "Завершить сеанс",
    btn_connecting: "Подключение...",
    lbl_select_lang: "Выберите партнера",
    lbl_transcript: "Транскрипция",
    lbl_voice: "Голос",
    lbl_default_voice: "Голос по умолчанию",
    lbl_select_voice: "ВЫБРАТЬ ГОЛОС"
  }
};

export const MODEL_NAME = 'gemini-2.5-flash-native-audio-preview-12-2025';
export const SAMPLE_RATE_INPUT = 16000;
export const SAMPLE_RATE_OUTPUT = 24000;