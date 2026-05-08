import { NextRequest, NextResponse } from 'next/server';
import groq from '@/lib/groq';
import { EMAIL_DRAFT_PROMPT } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const { summary, actionItems, participants, meetingTitle } = await req.json();

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: EMAIL_DRAFT_PROMPT },
        {
          role: 'user',
          content: `
Meeting: ${meetingTitle}
Participants: ${Array.isArray(participants) ? participants.join(', ') : 'Not specified'}
Summary: ${summary}
Action Items: ${
  Array.isArray(actionItems)
    ? actionItems.map((a: { text: string; owner: string }) => `- ${a.text} (Owner: ${a.owner})`).join('\n')
    : 'None'
}
          `.trim(),
        },
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });

    const emailDraft = response.choices[0].message.content || '';
    return NextResponse.json({ emailDraft });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Email generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
