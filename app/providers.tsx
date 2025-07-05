'use client';
import { SessionProvider } from 'next-auth/react';
import { TRPCProvider } from '@/trpc/client';
import { HydrateClient } from '@/trpc/server';
import SolanaWalletProvider from './providers/SolanaWalletProvider';
import PrivyAuthProvider from '@/components/providers/privy-provider/privy-provider';
import { AuthProvider } from '@/context';
import OnboardingGuard from '@/components/OnboardingGuard';

// Dynamically import SolanaWalletProvider to avoid SSR issues
// const SolanaWalletProvider = dynamic(
//   () => import('./providers/SolanaWalletProvider'),
//   { ssr: false }
// );

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    // <SessionProvider>
    <TRPCProvider>
      <PrivyAuthProvider>
        <AuthProvider>
          <SolanaWalletProvider>
            <OnboardingGuard>
              {children}
            </OnboardingGuard>
          </SolanaWalletProvider>
        </AuthProvider>
      </PrivyAuthProvider>
    </TRPCProvider>
    // </SessionProvider>
  );
}
