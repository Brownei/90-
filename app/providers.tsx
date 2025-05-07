"use client";

import { SessionProvider } from "next-auth/react";
import { TRPCProvider } from "@/trpc/client";
// import { HydrateClient } from "@/trpc/server";
import dynamic from "next/dynamic";
import HomeProvider from "@/components/providers/home-provider";

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
  return (
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
  );
} 
