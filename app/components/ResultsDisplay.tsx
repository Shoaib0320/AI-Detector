'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Info, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/lib/translations';
import { AnalysisResult } from '@/lib/gemini';

interface ResultsDisplayProps {
  result: AnalysisResult;
  onHumanize: () => void;
  isHumanizing: boolean;
}

export default function ResultsDisplay({ result, onHumanize, isHumanizing }: ResultsDisplayProps) {
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);

  const aiPercentage = Math.round(result.aiPercentage);
  const humanPercentage = Math.round(result.humanPercentage);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          {t('analysisResults')}
        </h2>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          {showDetails ? t('hideDetails') : t('showDetails')}
        </button>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 mb-6">
        {/* AI Probability */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('aiProbability')}
            </span>
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
              {aiPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-red-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${aiPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Human Probability */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('humanProbability')}
            </span>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
              {humanPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${humanPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Confidence Score */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('confidence')}
            </span>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {Math.round(result.confidence)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${result.confidence}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Overall Result */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
          aiPercentage > humanPercentage
            ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
        }`}>
          {aiPercentage > humanPercentage ? (
            <>
              <TrendingUp className="h-4 w-4 mr-2" />
              {t('likelyAI')}
            </>
          ) : (
            <>
              <TrendingDown className="h-4 w-4 mr-2" />
              {t('likelyHuman')}
            </>
          )}
        </div>
      </div>

      {/* Key Indicators */}
      {showDetails && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            {t('indicators')}
          </h3>
          <ul className="space-y-2">
            {result.indicators.map((indicator, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 shrink-0"></span>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {indicator}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Humanize Button */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
        <div className="text-center">
          <button
            onClick={onHumanize}
            disabled={isHumanizing}
            className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isHumanizing ? t('humanizing') : t('humanize')}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {t('humanizeDescription')}
          </p>
        </div>
      </div>
    </div>
  );
}
