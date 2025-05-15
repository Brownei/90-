"use client";

import { SessionProvider } from "next-auth/react";
import { TRPCProvider } from "@/trpc/client";
// import { HydrateClient } from "@/trpc/server";
import dynamic from "next/dynamic";
import HomeProvider from "@/components/providers/home-provider";
import {PrivyProvider} from '@privy-io/react-auth';

// Dynamically import SolanaWalletProvider to avoid SSR issues
const SolanaWalletProvider = dynamic(
  () => import('./providers/SolanaWalletProvider'),
  { ssr: false }
);

interface ProvidersProps {
  children: React.ReactNode;
  token: string;
}

export function Providers({ children, token }: ProvidersProps) {
  const app_id = process.env.NEXT_PUBLIC_PRIVY_APP_ID as string ;
  const client_id = process.env.NEXT_PUBLIC_CLIENT_ID as string ;
  return (
    <PrivyProvider
      appId={app_id}
      clientId={client_id}
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        }
      }}
    >
      <SessionProvider>
      <TRPCProvider>
        {/* <HydrateClient> */}
          <SolanaWalletProvider>
          <HomeProvider token={token}>
            {children}
          </HomeProvider>
          </SolanaWalletProvider>
        {/* </HydrateClient> */}
      </TRPCProvider>
    </SessionProvider>
    </PrivyProvider>
    
  );
} 
