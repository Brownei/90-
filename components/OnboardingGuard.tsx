'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSessionStore } from '@/stores/use-session-store';

const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const { session: user } = useSessionStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If user is authenticated but doesn't have a name (not onboarded)
    // and they're not already on the onboarding page, redirect them
    if (user && !user.name && pathname !== '/onboarding') {
      router.push('/onboarding');
    }
  }, [user, pathname, router]);

  return <>{children}</>;
};

export default OnboardingGuard; 