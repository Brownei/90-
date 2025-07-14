'use client';

import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { ReactNode } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

const PrivyAuthProvider = ({ children }: { children: ReactNode }) => {
  const { } = useSmartWallets()
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        //solanaClusters: [{ name: 'mainnet-beta', rpcUrl: 'https://api.mainnet-beta.solana.com' }],
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets',
          }
        },
        appearance: {
          theme: 'dark',
          accentColor: '#512da8',
          logo: 'https://solana.com/src/img/branding/solanaLogoMark.svg',
          walletChainType: 'solana-only',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};

export default PrivyAuthProvider;
