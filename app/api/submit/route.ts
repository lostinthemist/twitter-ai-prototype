import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const API_KEY = process.env.GEMINI_AI_API_KEY ?? "";

export async function POST(req: Request) {
  const { description } = await req.json();

  if (!description) {
    return NextResponse.json(
      { error: 'Description is required.' },
      { status: 400 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Generate twitter tweet on the basis of this description: ${description}`;
    const result = await model.generateContent([prompt]);

    if (result && result.response) {
      const generatedText = await result.response.text();
      return NextResponse.json({ tweet: generatedText });
    } else {
      throw new Error('No response received from model.');
    }
  } catch (error) {
    console.error('Error generating tweet:', error);
    return NextResponse.json({ error: 'Failed to generate tweet' }, { status: 500 });
  }
}