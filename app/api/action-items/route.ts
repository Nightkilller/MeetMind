import { NextRequest, NextResponse } from 'next/server';
import groq from '@/lib/groq';

const ACTION_ITEMS_PROMPT = `
Extract all action items from the meeting transcript. Return a JSON array of action items:
[
  {
    "id": "ai_001",
    "text": "Clear description of what needs to be done",
    "owner": "Person responsible or 'Unassigned'",
    "dueDate": "YYYY-MM-DD or 'Not specified'",
    "priority": "high | medium | low",
    "completed": false
  }
]
Return ONLY the JSON array, no other text.
`;

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 });
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: ACTION_ITEMS_PROMPT },
        { role: 'user', content: transcript },
      ],
      temperature: 0.2,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content || '[]';
    const actionItems = JSON.parse(content);
    return NextResponse.json({ actionItems });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Action item extraction failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
