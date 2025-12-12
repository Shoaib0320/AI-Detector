'use client';

import { Heart } from 'lucide-react';
import { useLanguage } from '@/lib/translations';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t('appName')} - {new Date().getFullYear()}
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-2 flex items-center justify-center">
            Made with <Heart className="h-3 w-3 mx-1 text-red-500 fill-current" /> for content creators
          </p>
          <div className="mt-4 text-xs text-gray-400 dark:text-gray-600">
            <p>Powered by Google Gemini AI</p>
            <p className="mt-1">Built with Next.js 14 & TypeScript</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
