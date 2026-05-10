import { NextRequest, NextResponse } from 'next/server';
import groq from '@/lib/groq';
import { TITLE_PROMPT } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 });
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: TITLE_PROMPT },
        { role: 'user', content: transcript.slice(0, 800) },
      ],
      temperature: 0.3,
      max_tokens: 30,
    });

    const autoTitle = response.choices[0].message.content?.trim() || 'Untitled Meeting';
    // Remove surrounding quotes if Groq adds them
    const cleanTitle = autoTitle.replace(/^["']|["']$/g, '');

    return NextResponse.json({ title: cleanTitle });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Title generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
