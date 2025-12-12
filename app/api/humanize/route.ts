import { NextRequest, NextResponse } from 'next/server';
import { humanizeText } from '@/lib/gemini';

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
    if (text.length < 10 || text.length > 5000) {
      return NextResponse.json(
        { error: 'Text must be between 10 and 5000 characters' },
        { status: 400 }
      );
    }

    const humanized = await humanizeText(text, language);
    return NextResponse.json({ humanized });
  } catch (error) {
    console.error('Humanize API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
