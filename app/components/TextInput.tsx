'use client';

import { useState, useRef } from 'react';
import { Copy, Trash2, FileText, Languages } from 'lucide-react';
import { useLanguage } from '@/lib/translations';

interface TextInputProps {
  text: string;
  onTextChange: (text: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export default function TextInput({
  text,
  onTextChange,
  language,
  onLanguageChange,
  onAnalyze,
  isAnalyzing
}: TextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  ];

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      onTextChange(clipboardText);
    } catch (error) {
      console.error('Failed to paste from clipboard:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onTextChange(content);
      };
      reader.readAsText(file);
    }
  };

  const clearText = () => {
    onTextChange('');
    textareaRef.current?.focus();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const sentenceCount = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
  const charCount = text.length;

  const isValidLength = charCount >= 50 && charCount <= 5000;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t('enterText')}
        </h2>

        {/* Language Selector */}
        <div className="flex items-center space-x-2 mb-4">
          <Languages className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={t('textPlaceholder')}
          className={`w-full h-48 p-4 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            language === 'ar' || language === 'ur'
              ? 'text-right'
              : 'text-left'
          } ${
            charCount > 5000
              ? 'border-red-300 dark:border-red-600'
              : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
          dir={language === 'ar' || language === 'ur' ? 'rtl' : 'ltr'}
        />

        {/* Character Count and Stats */}
        <div className="flex justify-between items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex space-x-4">
            <span>{t('characters')}: {charCount}/5000</span>
            <span>{t('words')}: {wordCount}</span>
            <span>{t('sentences')}: {sentenceCount}</span>
          </div>
          <div className={`text-xs ${isValidLength ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isValidLength ? t('validLength') : t('invalidLength')}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={handlePaste}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Copy className="h-4 w-4" />
            <span>{t('paste')}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>{t('uploadFile')}</span>
          </button>

          <button
            onClick={copyToClipboard}
            disabled={!text}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Copy className="h-4 w-4" />
            <span>{t('copy')}</span>
          </button>

          <button
            onClick={clearText}
            disabled={!text}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
            <span>{t('clear')}</span>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Analyze Button */}
      <div className="flex justify-center">
        <button
          onClick={onAnalyze}
          disabled={!text || !isValidLength || isAnalyzing}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isAnalyzing ? t('analyzing') : t('analyze')}
        </button>
      </div>
    </div>
  );
}
