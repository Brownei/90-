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
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets',
          }
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};

export default PrivyAuthProvider;
