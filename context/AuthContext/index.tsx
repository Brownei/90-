'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSolanaWallets } from '@privy-io/react-auth/solana'
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useCreateWallet } from '@privy-io/react-auth';
import { trpc } from '@/trpc/client';

interface AuthContextType {
  user: { privy_id: string; email: string | undefined; wallet_addr: string | undefined } | null;
  isAuthenticated: boolean;
  isAuthLoaded: boolean;
  isOnboarded: boolean;
  login: () => void;
  logout: () => void;
  onboardUser: (username: string, image_id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { createWallet } = useCreateWallet();
  const loginMutation = trpc.users.login.useMutation()
  const getUserFromDB = trpc.users.getCurrentUser.useMutation()
  const { wallets, ready: solanaWalletsReady } = useSolanaWallets()
  const { authenticated, ready, login, logout, linkWallet, user } = usePrivy();
  const router = useRouter();
  const [userData, setUserData] = useState<AuthContextType['user'] | null>(
    null
  );
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [isAuthLoaded, setIsAuthLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!ready || !solanaWalletsReady) {
      console.log("No wallet or ready privy")
    } else {
      console.log({ wallets })
    }
  }, [ready, solanaWalletsReady])

  const handleAuthentication = async (privyUser: typeof user) => {
    if (!privyUser) return;

    if (!privyUser) {
      console.error(
        'User data is incomplete, skipping authentication request.'
      );
      console.log("Logging out....")
      logout()
      return;
    }

    const existingUser = await getUserFromDB.mutateAsync({
      email: privyUser.google?.email as string
    })

    if (existingUser) {
      setUserData({
        email: existingUser?.email as string,
        privy_id: privyUser.id,
        wallet_addr: existingUser.wallet as string
      })
    } else {
      if (privyUser.wallet?.address) {
        await loginMutation.mutateAsync({
          email: privyUser.google?.email as string,
          name: privyUser.google?.name as string,
          balance: 0,
          publicKey: privyUser.wallet?.address as string,
          profileImage: '',
          email_verified: true,
        })

        const formData = {
          privy_id: privyUser.id,
          email: privyUser.google?.email,
          wallet_addr: privyUser.wallet?.address as string,
        };

        setUserData(formData);

      } else {
        const wallet = await createWallet()

        if (wallet) {
          await loginMutation.mutateAsync({
            email: privyUser.google?.email as string,
            name: privyUser.google?.name as string,
            balance: 0,
            publicKey: wallet.address,
            profileImage: '',
            email_verified: true,
          })

          const formData = {
            privy_id: privyUser.id,
            email: privyUser.google?.email,
            wallet_addr: wallet.address,
          };

          setUserData(formData);
        }
      }
    }

    try {
      // check if user is authenticated or not
    } catch (error) {
      console.error('Error sending user data:', error);
    } finally {
      linkWallet()
      setIsAuthLoaded(true);
    }
  };

  const onboardUser = async (username: string) => {
    if (!userData?.privy_id) return;

    try {
      // check if user is onboarded or not
      setIsOnboarded(true);
      router.replace('/');
    } catch (error) {
      console.error('Error onboarding user:', error);
    }
  };

  const userId = user?.id;

  useEffect(() => {
    if (!ready) return;
    if (!authenticated && !user) return;

    handleAuthentication(user);
  }, [authenticated, ready, userId]);

  function logoutUser() {
    logout()
    setUserData(null);
  }

  function loginUser() {
    if (user) {
      handleAuthentication(user)
    } else {
      login()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user: userData,
        isAuthenticated: authenticated,
        isAuthLoaded,
        isOnboarded,
        login: loginUser,
        logout: logoutUser,
        onboardUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthState = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }
  return context;
};
