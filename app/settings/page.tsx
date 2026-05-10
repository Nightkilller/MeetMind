'use client';

import PageWrapper from '@/components/layout/PageWrapper';
import { useUser, UserProfile } from '@clerk/nextjs';
import Spinner from '@/components/ui/Spinner';

export default function SettingsPage() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p>Please sign in to view settings.</p>
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-[1200px] mx-auto pt-[48px] pb-[72px]">
        <div className="mb-8">
          <h1 className="text-h2 text-[#17253D]">Settings</h1>
          <p className="text-body text-[#262626] mt-1">Manage your account preferences</p>
        </div>

        <div className="md:bg-white md:p-6 rounded-[16px] md:shadow-sm md:border border-[#E6E6E6] w-full overflow-hidden">
          <UserProfile 
            routing="hash" 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "w-full shadow-none md:shadow-sm border-0 md:border m-0",
                navbar: "hidden md:block",
              }
            }} 
          />
        </div>
      </div>
    </PageWrapper>
  );
}
