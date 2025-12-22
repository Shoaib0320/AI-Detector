import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface AnalysisResult {
  aiPercentage: number;
  humanPercentage: number;
  confidence: number;
  indicators: string[];
  language: string;
}

// Helper function for retry logic with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error?.status === 400 || error?.status === 401 || error?.status === 403) {
        throw error;
      }
      
      // Retry on 503 (overloaded) or 429 (rate limit) or network errors
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i); // Exponential backoff
        console.log(`Retry attempt ${i + 1} after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

export async function analyzeText(text: string, language: string): Promise<AnalysisResult> {
  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY) {
    // Return demo data
    return {
      aiPercentage: Math.floor(Math.random() * 40) + 30, // 30-70%
      humanPercentage: 100 - (Math.floor(Math.random() * 40) + 30),
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
      indicators: [
        "Consistent sentence structure",
        "Formal vocabulary usage",
        "Predictable paragraph flow",
        "Limited personal anecdotes"
      ],
      language: language
    };
  }

  try {
  // Use the correct model name for Gemini API (update as per ListModels response)
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Analyze the following ${language} text and determine:
      1. Percentage probability that it was written by AI (0-100%)
      2. Percentage that it was written by a human (0-100%)
      3. Confidence score (0-100)
      4. Key indicators that suggest AI or human writing

      Text: "${text}"

      Return in JSON format: {
        aiPercentage: number,
        humanPercentage: number,
        confidence: number,
        indicators: string[],
        language: string
      }
    `;

    // Use retry logic for API calls
    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    });
    
    const response = await result.response;
    const textResponse = response.text();

    // Parse the JSON response
    try {
      const parsed = JSON.parse(textResponse);
      return {
        aiPercentage: Math.max(0, Math.min(100, parsed.aiPercentage || 0)),
        humanPercentage: Math.max(0, Math.min(100, parsed.humanPercentage || 0)),
        confidence: Math.max(0, Math.min(100, parsed.confidence || 0)),
        indicators: Array.isArray(parsed.indicators) ? parsed.indicators : [],
        language: parsed.language || language
      };
    } catch (parseError) {
      // If parsing fails, return demo data
      console.error('Failed to parse Gemini response:', parseError);
      return {
        aiPercentage: 50,
        humanPercentage: 50,
        confidence: 50,
        indicators: ["Unable to analyze text"],
        language: language
      };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    // Return demo data on error
    return {
      aiPercentage: Math.floor(Math.random() * 40) + 30,
      humanPercentage: 100 - (Math.floor(Math.random() * 40) + 30),
      confidence: Math.floor(Math.random() * 30) + 70,
      indicators: [
        "API temporarily unavailable",
        "Using demo analysis"
      ],
      language: language
    };
  }
}

export async function humanizeText(text: string, language: string): Promise<string> {

  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY) {
    // Demo: Add more human-like variation, contractions, and idioms
    let demo = text
      .replace(/\b(the|a|an)\b/gi, (match) => Math.random() > 0.5 ? match : '')
      .replace(/\bis not\b/gi, "isn't")
      .replace(/\bare not\b/gi, "aren't")
      .replace(/\bdo not\b/gi, "don't")
      .replace(/\bdoes not\b/gi, "doesn't")
      .replace(/\bcan not\b/gi, "can't")
      .replace(/\bwill not\b/gi, "won't")
      .replace(/\bI am\b/gi, "I'm")
      .replace(/\bwe are\b/gi, "we're")
      .replace(/\bthey are\b/gi, "they're")
      .replace(/\bis\b/gi, () => Math.random() > 0.7 ? 'is kinda' : 'is')
      .replace(/\bare\b/gi, () => Math.random() > 0.7 ? 'are sort of' : 'are')
      .replace(/\bvery\b/gi, () => Math.random() > 0.5 ? 'super' : 'very')
      .replace(/\bimportant\b/gi, () => Math.random() > 0.5 ? 'crucial' : 'important')
      .replace(/\bfor example\b/gi, () => Math.random() > 0.5 ? 'say,' : 'for example')
      .replace(/\s+/g, ' ')
      .trim();
    // Add a little human touch at the end
    if (demo.length > 0 && Math.random() > 0.7) {
      demo += ' (Just my two cents!)';
    }
    return demo;
  }

  try {
  // Use the correct model name for Gemini API (update as per ListModels response)
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert human writer. Rewrite the following ${language} text so it sounds perfectly natural, idiomatic, and emotionally nuanced, as if written by a real person. Use contractions, natural phrasing, idioms, and a conversational tone. Vary sentence structure, add subtle personal touches, and avoid robotic or repetitive patterns. Do not change the meaning or facts.

      Original text:
      """
      ${text}
      """

      Return ONLY the rewritten text, with no explanations, no quotes, and no extra formatting.
    `;

    // Use retry logic for API calls
    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    });

    const response = await result.response;
    return response.text().replace(/^"|"$/g, '').trim();
  } catch (error: any) {
    console.error('Gemini API error for humanization:', error);

    // Better fallback: apply basic humanization instead of returning original text
    console.log('Applying fallback humanization...');
    let fallback = text
      .replace(/\bis not\b/gi, "isn't")
      .replace(/\bare not\b/gi, "aren't")
      .replace(/\bdo not\b/gi, "don't")
      .replace(/\bdoes not\b/gi, "doesn't")
      .replace(/\bcan not\b/gi, "can't")
      .replace(/\bcannot\b/gi, "can't")
      .replace(/\bwill not\b/gi, "won't")
      .replace(/\bshould not\b/gi, "shouldn't")
      .replace(/\bwould not\b/gi, "wouldn't")
      .replace(/\bcould not\b/gi, "couldn't")
      .replace(/\bI am\b/gi, "I'm")
      .replace(/\byou are\b/gi, "you're")
      .replace(/\bwe are\b/gi, "we're")
      .replace(/\bthey are\b/gi, "they're")
      .replace(/\bhe is\b/gi, "he's")
      .replace(/\bshe is\b/gi, "she's")
      .replace(/\bit is\b/gi, "it's")
      .replace(/\bthat is\b/gi, "that's")
      .replace(/\bwhat is\b/gi, "what's")
      .replace(/\bwho is\b/gi, "who's")
      .replace(/\s+/g, ' ')
      .trim();
    
    return fallback;
  }
}








