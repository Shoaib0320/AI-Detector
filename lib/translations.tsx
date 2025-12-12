'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Translations {
  appName: string;
  enterText: string;
  textPlaceholder: string;
  analyze: string;
  analyzing: string;
  characters: string;
  words: string;
  sentences: string;
  validLength: string;
  invalidLength: string;
  paste: string;
  uploadFile: string;
  copy: string;
  clear: string;
  aiProbability: string;
  humanProbability: string;
  confidence: string;
  indicators: string;
  humanize: string;
  humanizing: string;
  originalText: string;
  humanizedText: string;
  copyToClipboard: string;
  downloadAsFile: string;
  reHumanize: string;
  lightMode: string;
  darkMode: string;
  language: string;
  analysisHistory: string;
  noHistory: string;
  error: string;
  success: string;
  loading: string;
  analysisResults: string;
  hideDetails: string;
  showDetails: string;
  likelyAI: string;
  likelyHuman: string;
  humanizeDescription: string;
}

const translations: Record<string, Translations> = {
  en: {
    appName: 'AI Text Detector',
    enterText: 'Enter Text to Analyze',
    textPlaceholder: 'Paste or type your text here...',
    analyze: 'Analyze Text',
    analyzing: 'Analyzing...',
    characters: 'Characters',
    words: 'Words',
    sentences: 'Sentences',
    validLength: 'Valid length',
    invalidLength: 'Text must be 50-5000 characters',
    paste: 'Paste',
    uploadFile: 'Upload File',
    copy: 'Copy',
    clear: 'Clear',
    aiProbability: 'AI Probability',
    humanProbability: 'Human Probability',
    confidence: 'Confidence',
    indicators: 'Key Indicators',
    humanize: 'Humanize Text',
    humanizing: 'Humanizing...',
    originalText: 'Original Text',
    humanizedText: 'Humanized Text',
    copyToClipboard: 'Copy to Clipboard',
    downloadAsFile: 'Download as File',
    reHumanize: 'Re-Humanize',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    language: 'Language',
    analysisHistory: 'Analysis History',
    noHistory: 'No analysis history yet',
    error: 'Error',
    success: 'Success',
    loading: 'Loading...',
    analysisResults: 'Analysis Results',
    hideDetails: 'Hide Details',
    showDetails: 'Show Details',
    likelyAI: 'Likely AI Generated',
    likelyHuman: 'Likely Human Written',
    humanizeDescription: 'Make this text sound more human-written',
  },
  ur: {
    appName: 'AI متن کا پتہ لگانے والا',
    enterText: 'تجزیہ کرنے کے لیے متن درج کریں',
    textPlaceholder: 'اپنا متن یہاں پیسٹ یا ٹائپ کریں...',
    analyze: 'متن کا تجزیہ کریں',
    analyzing: 'تجزیہ کر رہے ہیں...',
    characters: 'حروف',
    words: 'الفاظ',
    sentences: 'جملے',
    validLength: 'درست لمبائی',
    invalidLength: 'متن 50-5000 حروف کا ہونا چاہیے',
    paste: 'پیسٹ کریں',
    uploadFile: 'فائل اپ لوڈ کریں',
    copy: 'کاپی کریں',
    clear: 'صاف کریں',
    aiProbability: 'AI امکان',
    humanProbability: 'انسانی امکان',
    confidence: 'اعتماد',
    indicators: 'اہم اشاریے',
    humanize: 'متن کو انسانی بنائیں',
    humanizing: 'انسانی بنا رہے ہیں...',
    originalText: 'اصل متن',
    humanizedText: 'انسانی متن',
    copyToClipboard: 'کلپ بورڈ پر کاپی کریں',
    downloadAsFile: 'فائل کے طور پر ڈاؤن لوڈ کریں',
    reHumanize: 'دوبارہ انسانی بنائیں',
    lightMode: 'ہلکی موڈ',
    darkMode: 'گہرا موڈ',
    language: 'زبان',
    analysisHistory: 'تجزیہ کی تاریخ',
    noHistory: 'ابھی تک کوئی تجزیہ کی تاریخ نہیں',
    error: 'خرابی',
    success: 'کامیابی',
    loading: 'لوڈ ہو رہا ہے...',
    analysisResults: 'تجزیہ کے نتائج',
    hideDetails: 'تفصیلات چھپائیں',
    showDetails: 'تفصیلات دکھائیں',
    likelyAI: 'ممکنہ طور پر AI سے تیار کردہ',
    likelyHuman: 'ممکنہ طور پر انسان کے ہاتھوں لکھا ہوا',
    humanizeDescription: 'اس متن کو زیادہ انسانی لکھائی کا بنا دیں',
  },
  ar: {
    appName: 'كاشف النصوص الذكية الاصطناعية',
    enterText: 'أدخل النص للتحليل',
    textPlaceholder: 'الصق أو اكتب نصك هنا...',
    analyze: 'تحليل النص',
    analyzing: 'جاري التحليل...',
    characters: 'الحروف',
    words: 'الكلمات',
    sentences: 'الجمل',
    validLength: 'طول صحيح',
    invalidLength: 'يجب أن يكون النص 50-5000 حرف',
    paste: 'لصق',
    uploadFile: 'رفع ملف',
    copy: 'نسخ',
    clear: 'مسح',
    aiProbability: 'احتمالية الذكاء الاصطناعي',
    humanProbability: 'الاحتمالية البشرية',
    confidence: 'الثقة',
    indicators: 'المؤشرات الرئيسية',
    humanize: 'إنسانية النص',
    humanizing: 'جاري الإنسانية...',
    originalText: 'النص الأصلي',
    humanizedText: 'النص المُنسان',
    copyToClipboard: 'نسخ إلى الحافظة',
    downloadAsFile: 'تحميل كملف',
    reHumanize: 'إعادة الإنسانية',
    lightMode: 'الوضع الفاتح',
    darkMode: 'الوضع المظلم',
    language: 'اللغة',
    analysisHistory: 'تاريخ التحليل',
    noHistory: 'لا يوجد تاريخ تحليل بعد',
    error: 'خطأ',
    success: 'نجح',
    loading: 'جاري التحميل...',
    analysisResults: 'نتائج التحليل',
    hideDetails: 'إخفاء التفاصيل',
    showDetails: 'إظهار التفاصيل',
    likelyAI: 'من المحتمل أنه مولد بالذكاء الاصطناعي',
    likelyHuman: 'من المحتمل أنه مكتوب بخط الإنسان',
    humanizeDescription: 'اجعل هذا النص يبدو أكثر كتابة بشرية',
  },
  es: {
    appName: 'Detector de Texto IA',
    enterText: 'Ingresa el Texto para Analizar',
    textPlaceholder: 'Pega o escribe tu texto aquí...',
    analyze: 'Analizar Texto',
    analyzing: 'Analizando...',
    characters: 'Caracteres',
    words: 'Palabras',
    sentences: 'Oraciones',
    validLength: 'Longitud válida',
    invalidLength: 'El texto debe tener 50-5000 caracteres',
    paste: 'Pegar',
    uploadFile: 'Subir Archivo',
    copy: 'Copiar',
    clear: 'Limpiar',
    aiProbability: 'Probabilidad IA',
    humanProbability: 'Probabilidad Humana',
    confidence: 'Confianza',
    indicators: 'Indicadores Clave',
    humanize: 'Humanizar Texto',
    humanizing: 'Humanizando...',
    originalText: 'Texto Original',
    humanizedText: 'Texto Humanizado',
    copyToClipboard: 'Copiar al Portapapeles',
    downloadAsFile: 'Descargar como Archivo',
    reHumanize: 'Re-Humanizar',
    lightMode: 'Modo Claro',
    darkMode: 'Modo Oscuro',
    language: 'Idioma',
    analysisHistory: 'Historial de Análisis',
    noHistory: 'Aún no hay historial de análisis',
    error: 'Error',
    success: 'Éxito',
    loading: 'Cargando...',
    analysisResults: 'Resultados del Análisis',
    hideDetails: 'Ocultar Detalles',
    showDetails: 'Mostrar Detalles',
    likelyAI: 'Probablemente Generado por IA',
    likelyHuman: 'Probablemente Escrito por Humano',
    humanizeDescription: 'Haz que este texto suene más escrito por humanos',
  },
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: keyof Translations): string => {
    const currentTranslations = translations[language] || translations.en;
    return currentTranslations[key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
