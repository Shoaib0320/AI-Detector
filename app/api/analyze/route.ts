import { NextRequest, NextResponse } from 'next/server';
import { analyzeText } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { text, language } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    if (!language || typeof language !== 'string') {
      return NextResponse.json(
        { error: 'Language is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate text length
    if (text.length < 50 || text.length > 5000) {
      return NextResponse.json(
        { error: 'Text must be between 50 and 5000 characters' },
        { status: 400 }
      );
    }

    const analysis = await analyzeText(text, language);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
