'use client';

interface SpeakerTagProps {
  name: string;
  index?: number;
}

const colors = [
  { bg: 'rgba(96, 165, 250, 0.15)', text: '#60a5fa', border: 'rgba(96, 165, 250, 0.3)' },
  { bg: 'rgba(167, 139, 250, 0.15)', text: '#a78bfa', border: 'rgba(167, 139, 250, 0.3)' },
  { bg: 'rgba(52, 211, 153, 0.15)', text: '#34d399', border: 'rgba(52, 211, 153, 0.3)' },
  { bg: 'rgba(251, 146, 60, 0.15)', text: '#fb923c', border: 'rgba(251, 146, 60, 0.3)' },
  { bg: 'rgba(244, 114, 182, 0.15)', text: '#f472b6', border: 'rgba(244, 114, 182, 0.3)' },
];

export default function SpeakerTag({ name, index = 0 }: SpeakerTagProps) {
  const color = colors[index % colors.length];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold"
      style={{ background: color.bg, color: color.text, border: `1px solid ${color.border}` }}
    >
      {name}
    </span>
  );
}
