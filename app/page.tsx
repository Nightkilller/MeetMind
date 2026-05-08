'use client';

import Link from 'next/link';
import { useUser, SignInButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  Brain,
  Mic,
  Zap,
  CheckSquare,
  Mail,
  Search,
  ArrowRight,
  Clock,
  Users,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: 'Real-time Transcription',
    description: 'Groq Whisper Large V3 captures every word with 95%+ accuracy across accents and speakers. No bot needed.',
  },
  {
    icon: Brain,
    title: 'Llama 3.3 Analysis',
    description: 'Groq Llama 3.3 70B extracts structured summaries, key decisions, and action items in seconds.',
  },
  {
    icon: CheckSquare,
    title: 'Action Items',
    description: 'Automatically assigns tasks to owners with priorities and due dates. No more lost follow-ups.',
  },
  {
    icon: Mail,
    title: 'Follow-up Emails',
    description: 'One click generates a professional follow-up email ready to send to all attendees.',
  },
  {
    icon: Search,
    title: 'Searchable History',
    description: 'Every meeting is stored and fully searchable. Find any decision or action item instantly.',
  },
  {
    icon: Zap,
    title: 'Instant Insights',
    description: 'Sentiment analysis, meeting type detection, and follow-up flags — automatically.',
  },
];

const stats = [
  { value: '31h', label: 'avg hours/month wasted in meetings', icon: Clock },
  { value: '70%', label: 'of action items never followed up', icon: CheckSquare },
  { value: '45min', label: 'saved per meeting with MeetMind', icon: TrendingUp },
  { value: '95%', label: 'transcription accuracy (Groq Whisper)', icon: Users },
];

const steps = [
  { step: '01', title: 'Record', desc: 'Click mic → join your meeting → speak naturally', icon: Mic },
  { step: '02', title: 'Analyze', desc: 'Groq Whisper + Llama 3.3 processes your transcript', icon: Brain },
  { step: '03', title: 'Act', desc: 'Get summary, action items & email draft instantly', icon: Zap },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function LandingPage() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden pt-[54px]">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white border-b border-[#F2F2F2] h-[54px] flex items-center px-6">
        <div className="max-w-[1200px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Brain size={24} color="#0078D4" />
            <span className="text-[18px] font-semibold text-[#17253D]" style={{ fontFamily: 'var(--font-display)' }}>MeetMind</span>
          </div>
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <Link href="/dashboard" className="mm-btn mm-btn-primary" style={{ height: '40px', padding: '0 16px' }}>
                Go to Dashboard
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button className="mm-btn mm-btn-primary" style={{ height: '40px', padding: '0 16px' }}>
                  Get Started Free
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-20 px-6 text-center border-b border-[#F2F2F2] overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(to right, rgba(0, 120, 212, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 120, 212, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 50%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 50%, transparent 100%)',
        }}></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[4px] bg-[#E6F2FB] border border-[#CBE6F4] text-[#0078D4] text-[12px] font-bold tracking-widest uppercase mb-12"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0078D4]" />
            AI-POWERED MEETING INTELLIGENCE
          </motion.div>

          {/* Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[64px] sm:text-[80px] md:text-[100px] font-bold text-[#17253D] leading-[1.05] tracking-tight mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Record. <span className="text-[#0078D4]">Analyze.</span>
            <br />
            Get Action Items.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[13px] sm:text-[15px] text-[#A0AAB2] font-mono uppercase tracking-widest leading-relaxed max-w-2xl mx-auto mb-4"
          >
            A voice-powered AI meeting platform with real-time transcription and intelligent analysis.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[15px] text-[#A0AAB2] max-w-xl mx-auto mb-10"
          >
            Unlimited meeting summaries. AI-powered insights. No BS.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 mm-btn mm-btn-primary px-10"
                style={{ height: '48px', fontSize: '16px' }}
              >
                Go to Dashboard
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 mm-btn mm-btn-primary px-10"
                  style={{ height: '48px', fontSize: '16px' }}
                >
                  Start your first meeting
                </button>
              </SignInButton>
            )}
          </motion.div>

          {/* Validation text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 text-[12px] text-[#A0AAB2] uppercase tracking-wider font-mono"
          >
            ✓ Setup takes less than 60 seconds. Start recording now.
          </motion.div>
        </div>
      </section>


      {/* ── Stats ── */}
      <section className="py-[48px] px-6 border-b border-[#F2F2F2] bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center"
              >
                <Icon size={24} className="text-[#0078D4] mx-auto mb-4" />
                <p className="text-[40px] font-bold text-[#17253D] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{value}</p>
                <p className="text-small text-[#262626]">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="bg-container pt-[72px] pb-[72px] px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-h2 text-[#17253D] mb-4">How it works</h2>
            <p className="text-body text-[#262626] max-w-xl mx-auto">Three steps from meeting to insights.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {steps.map(({ step, title, desc, icon: Icon }, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="card-elevated p-8 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-[#E6F2FB] flex items-center justify-center mx-auto mb-6">
                  <Icon size={24} className="text-[#0078D4]" />
                </div>
                <span className="text-[13px] font-bold text-[#0078D4] tracking-wider uppercase">{step}</span>
                <h3 className="text-h3 text-[#17253D] my-3">{title}</h3>
                <p className="text-body text-[#262626]">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-[72px] px-6 bg-white border-t border-[#F2F2F2]">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-h2 text-[#17253D] mb-4">Everything you need</h2>
            <p className="text-body text-[#262626] max-w-xl mx-auto">
              Powered by Groq LPU™ Inference Engine for blazingly fast AI capabilities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="p-6 border border-[#F2F2F2] rounded-lg hover:border-[#0078D4] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded bg-[#F4FAFD] flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#0078D4]" />
                </div>
                <h3 className="text-h6 text-[#17253D] mb-2">{title}</h3>
                <p className="text-body text-[#262626]">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-container py-[72px] px-6 text-center border-t border-[#F2F2F2]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-h2 text-[#17253D] mb-6">
            Ready to reclaim your time?
          </h2>
          <p className="text-body text-[#262626] mb-10">
            Start your first meeting free. No credit card required.
          </p>
          {isSignedIn ? (
            <Link href="/dashboard" className="mm-btn mm-btn-primary px-10">
              Open Dashboard
              <ArrowRight size={18} />
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="mm-btn mm-btn-primary px-10">
                Get started — it&#39;s free
                <ArrowRight size={18} />
              </button>
            </SignInButton>
          )}
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#F2F2F2] py-8 px-6 text-center text-small text-[#262626] bg-white">
        <p>© 2026 MeetMind · Microsoft Build AI Hackathon</p>
      </footer>
    </div>
  );
}
