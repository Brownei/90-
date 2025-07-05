'use client';

import { ReactNode } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

const PrivyAuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
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
