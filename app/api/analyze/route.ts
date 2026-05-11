import { NextRequest, NextResponse } from 'next/server';
import groq from '@/lib/groq';
import { ANALYSIS_PROMPT } from '@/lib/prompts';
import { analyzeSentiment } from "@/lib/github-ai";

export async function POST(req: NextRequest) {
  try {
    const { transcript, meetingTitle, meetingType } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'No transcript' }, { status: 400 });
    }

    const MEETING_TYPE_PROMPTS: Record<string, string> = {
      standup: 'Focus on: what was done yesterday, what is planned today, any blockers.',
      planning: 'Focus on: goals, timelines, resource allocation, risks.',
      client: 'Focus on: commitments made to client, client concerns, next steps promised.',
      brainstorm: 'Focus on: ideas generated, ideas shortlisted, next validation steps.',
    };

    const typePrompt = meetingType && MEETING_TYPE_PROMPTS[meetingType as string] 
      ? `\n\nCRITICAL CONTEXT: This is a ${meetingType} meeting. ${MEETING_TYPE_PROMPTS[meetingType as string]}` 
      : '';

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: ANALYSIS_PROMPT + typePrompt },
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

    // After Groq analysis:
    const azureSentiment = await analyzeSentiment(transcript);
    result.sentiment = azureSentiment;

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
