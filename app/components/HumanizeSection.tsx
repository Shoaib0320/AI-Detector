'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/translations';
import { Copy, Download, RotateCcw } from 'lucide-react';

interface HumanizeSectionProps {
  originalText: string;
  humanizedText: string;
  onReHumanize: () => void;
  isReHumanizing: boolean;
}

export default function HumanizeSection({
  originalText,
  humanizedText,
  onReHumanize,
  isReHumanizing
}: HumanizeSectionProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(humanizedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([humanizedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'humanized-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('humanizedText')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onReHumanize}
            disabled={isReHumanizing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors"
          >
            <RotateCcw className={`w-4 h-4 ${isReHumanizing ? 'animate-spin' : ''}`} />
            {isReHumanizing ? t('humanizing') : t('reHumanize')}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Original Text */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {t('originalText') || 'Original Text'}
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 max-h-64 overflow-y-auto">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm">
              {originalText}
            </p>
          </div>
        </div>

        {/* Humanized Text */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {t('humanizedText') || 'Humanized Text'}
          </h3>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-md p-4 max-h-64 overflow-y-auto border border-green-200 dark:border-green-800">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm">
              {humanizedText}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
        >
          <Copy className="w-4 h-4" />
          {copied ? t('success') : t('copy')}
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
        >
          <Download className="w-4 h-4" />
          {t('downloadAsFile')}
        </button>
      </div>
    </div>
  );
}
