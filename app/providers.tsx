"use client";

import { SessionProvider } from "next-auth/react";
import { TRPCProvider } from "@/trpc/client";
import { HydrateClient } from "@/trpc/server";
import dynamic from "next/dynamic";
import HomeProvider from "@/components/providers/home-provider";
import SolanaWalletProvider from "./providers/SolanaWalletProvider";

// Dynamically import SolanaWalletProvider to avoid SSR issues
// const SolanaWalletProvider = dynamic(
//   () => import('./providers/SolanaWalletProvider'),
//   { ssr: false }
// );

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children, }: ProvidersProps) {
  return (
      <SessionProvider>
      <TRPCProvider>
        {/* <HydrateClient> */}
          <SolanaWalletProvider>
            {children}
          </SolanaWalletProvider>
        {/* </HydrateClient> */}
      </TRPCProvider>
    </SessionProvider>
  );
} 
