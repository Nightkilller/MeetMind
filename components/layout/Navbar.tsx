'use client';

import Link from 'next/link';
import { useUser, useClerk, SignInButton } from '@clerk/nextjs';
import { Brain, LogOut, Plus } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export default function Navbar() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-[54px] bg-white border-b border-[#F2F2F2] flex items-center px-6">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mr-8" style={{ textDecoration: 'none' }}>
        <div className="w-8 h-8 flex items-center justify-center">
          <Brain size={24} color="#0078D4" />
        </div>
        <span className="text-[18px] font-semibold text-[#17253D] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>MeetMind</span>
      </Link>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-3">
        {isSignedIn ? (
          <>
            <Link
              href="/meeting/new"
              className="mm-btn mm-btn-primary"
              style={{ height: '40px', padding: '0 16px', fontSize: '14px' }}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Meeting</span>
            </Link>

            {/* Avatar */}
            <div className="flex items-center gap-3 pl-3 border-l border-[#F2F2F2] h-8">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName || 'User'}
                  className="w-8 h-8 rounded-full border border-[#F2F2F2]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#0078D4] flex items-center justify-center text-xs font-semibold text-white">
                  {getInitials(user?.fullName || user?.primaryEmailAddress?.emailAddress || 'U')}
                </div>
              )}
              <button
                onClick={() => signOut({ redirectUrl: '/' })}
                className="p-1.5 rounded-lg text-[#262626] hover:text-[#0078D4] hover:bg-[#F4FAFD] transition-all"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : (
          <SignInButton mode="modal">
            <button 
              className="mm-btn mm-btn-primary" 
              style={{ height: '40px', padding: '0 16px', fontSize: '14px' }}
            >
              Sign In
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
}
