import { NextRequest, NextResponse } from 'next/server';
import groq from '@/lib/groq';
import { ANALYSIS_PROMPT } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const { transcript, meetingTitle } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'No transcript' }, { status: 400 });
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: ANALYSIS_PROMPT },
        {
          role: 'user',
          content: `Meeting Title: ${meetingTitle}\n\nTranscript:\n${transcript}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
