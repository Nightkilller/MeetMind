'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Video,
  CheckSquare,
  Settings,
  Brain,
  Plus,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/meetings', label: 'Meetings', icon: Video },
  { href: '/action-items', label: 'Action Items', icon: CheckSquare },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-[54px] bottom-0 w-60 bg-white border-r border-[#F2F2F2] flex-col py-6 px-4 z-30">
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
                  isActive 
                    ? 'bg-[#E6F2FB] text-[#0078D4] font-semibold' 
                    : 'text-[#262626] hover:bg-[#F4FAFD] hover:text-[#0078D4]'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* New meeting button */}
        <div className="mt-auto pt-4 border-t border-[#F2F2F2]">
          <Link
            href="/meeting/new"
            className="flex items-center justify-center gap-2 w-full mm-btn mm-btn-primary py-2.5 text-sm"
          >
            <Plus size={16} />
            New Meeting
          </Link>
          <p className="text-center text-[12px] text-[#262626] mt-4">MeetMind v1.0</p>
          <p className="text-center text-[12px] text-[#A0AAB2]">Microsoft Build 2026</p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-white border-t border-[#F2F2F2] flex items-center justify-around z-40 pb-safe">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? 'text-[#0078D4]' : 'text-[#A0AAB2] hover:text-[#262626]'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
