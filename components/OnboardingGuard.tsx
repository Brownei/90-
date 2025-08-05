'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { usePrivy } from "@privy-io/react-auth";

const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const { user: privyUser } = usePrivy();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If user is authenticated but doesn't have a name (not onboarded)
    // and they're not already on the onboarding page, redirect them
    if (privyUser === null && pathname !== '/') {
      router.push('/');
    }
  }, [pathname, router]);

  return <>{children}</>;
};

export default OnboardingGuard; 
