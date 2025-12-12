'use client';

import { useState, useEffect } from 'react';
import Header from './components/Header';
import TextInput from './components/TextInput';
import ResultsDisplay from './components/ResultsDisplay';
import HumanizeSection from './components/HumanizeSection';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';
import { LanguageProvider } from '@/lib/translations';
import { AnalysisResult } from '@/lib/gemini';

export default function Home() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [humanizedText, setHumanizedText] = useState('');
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim() || text.length < 50 || text.length > 5000) return;

    setIsAnalyzing(true);
    setError('');
    setAnalysisResult(null);
    setHumanizedText('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      setError('Failed to analyze text. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHumanize = async () => {
    if (!analysisResult) return;

    setIsHumanizing(true);
    setError('');

    try {
      const response = await fetch('/api/humanize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) {
        throw new Error('Humanization failed');
      }

      const result = await response.json();
      setHumanizedText(result.humanizedText);
    } catch (err) {
      setError('Failed to humanize text. Please try again.');
      console.error('Humanization error:', err);
    } finally {
      setIsHumanizing(false);
    }
  };

  return (
    <LanguageProvider>
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <Header
          onLanguageChange={setLanguage}
          onThemeToggle={handleThemeToggle}
          isDarkMode={isDarkMode}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Text Input Section */}
            <TextInput
              text={text}
              onTextChange={setText}
              language={language}
              onLanguageChange={setLanguage}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />

            {/* Loading Spinner */}
            {isAnalyzing && (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* Results Display */}
            {analysisResult && !isAnalyzing && (
              <ResultsDisplay
                result={analysisResult}
                onHumanize={handleHumanize}
                isHumanizing={isHumanizing}
              />
            )}

            {/* Humanize Section */}
            {humanizedText && (
              <HumanizeSection
                originalText={text}
                humanizedText={humanizedText}
                onReHumanize={handleHumanize}
                isReHumanizing={isHumanizing}
              />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </LanguageProvider>
  );
}
