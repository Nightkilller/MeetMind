import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'MeetMind — AI Meeting Intelligence',
  description:
    'MeetMind records your meetings, transcribes with Groq Whisper, and generates structured summaries, action items, and follow-up emails using Groq Llama 3.3 70B.',
  keywords: ['meeting ai', 'groq', 'transcription', 'action items', 'meeting summary'],
  openGraph: {
    title: 'MeetMind — AI Meeting Intelligence',
    description: 'Your meetings. Finally understood.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#FFFFFF',
                color: '#17253D',
                border: '1px solid #F2F2F2',
                borderRadius: '8px',
                fontSize: '15px',
                fontFamily: '"Segoe UI", system-ui, sans-serif',
                boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.16)',
              },
              success: { iconTheme: { primary: '#00FF26', secondary: '#17253D' } },
              error: { iconTheme: { primary: '#D13438', secondary: '#FFFFFF' } },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
