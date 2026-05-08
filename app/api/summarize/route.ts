import { NextRequest, NextResponse } from 'next/server';
import groq from '@/lib/groq';
import { SUMMARY_PROMPT } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 });
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SUMMARY_PROMPT },
        { role: 'user', content: transcript },
      ],
      temperature: 0.4,
      max_tokens: 800,
    });

    const summary = response.choices[0].message.content || '';
    return NextResponse.json({ summary });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Summarization failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
