"use client"
import { useAtom } from 'jotai';
import { useAuthStore } from '@/stores/authStore';
import { CHAIN_NAMESPACES, IAdapter, IProvider, WEB3AUTH_NETWORK, getEvmChainConfig } from "@web3auth/base";
import { useEffect } from 'react'
import { scrolledAtom, providerAtom, loggedInAtom, web3authAtom, isWeb3AuthInitializedAtom } from '@/stores/navStore';
import { signIn, useSession } from 'next-auth/react';
import { useAuth } from '@/utils/useAuth';
import { useWallet, } from '@solana/wallet-adapter-react';
import { Web3Auth } from "@web3auth/modal";
import { usePathname, useRouter } from 'next/navigation';
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: "0x2", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
  rpcTarget: "https://api.testnet.solana.com",
  displayName: "Solana Testnet",
  blockExplorerUrl: "https://explorer.solana.com",
  ticker: "SOL",
  tickerName: "Solana",
  logo: "https://images.toruswallet.io/solana.svg"
};

const privateKeyProvider = new SolanaPrivateKeyProvider({
  config: { chainConfig: chainConfig },
});

export const useAuthLogin = () => {
  const pathname = usePathname()
  const session = useSession()
  const router = useRouter();
  const [scrolled, setScrolled] = useAtom(scrolledAtom);
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const { connected, connect } = useWallet();
  const [provider, setProvider] = useAtom(providerAtom);
  const [loggedIn, setLoggedIn] = useAtom(loggedInAtom);
  const [web3auth, setWeb3auth] = useAtom(web3authAtom);
  const [isWeb3AuthInitialized, setIsWeb3AuthInitialized] = useAtom(isWeb3AuthInitializedAtom);

  console.log({ session })

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        const web3authInstance = new Web3Auth({
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID as string,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider: privateKeyProvider,
        });

        await web3authInstance.initModal();
        setWeb3auth(web3authInstance);
        setIsWeb3AuthInitialized(true);
        setProvider(web3authInstance.provider);

        if (web3authInstance.connected || session.status === "authenticated") {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error("Failed to initialize Web3Auth:", error);
      }
    };

    initWeb3Auth();

    // Cleanup function
    return () => {
      // Add any cleanup if needed
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setScrolled]);

  const getUserInfo = async () => {
    if (!web3auth) {
      console.error("Web3Auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
  };
  const login = async () => {
    try {
      // await signIn("twitter")
      // setLoggedIn(true)

      if (!web3auth) {
        console.error("Web3Auth not initialized yet");
        return;
      }

      if (!isWeb3AuthInitialized) {
        console.error("Web3Auth modal not initialized yet");
        return;
      }

      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);

      if (web3auth.connected) {
        setLoggedIn(true);

        // Get user info and save to database
        try {
          const userInfo = await web3auth.getUserInfo();

          // Store user data in database
          const response = await fetch('/api/users/store', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userInfo.email || '',
              name: userInfo.name || '',
              profileImage: userInfo.profileImage || '',
              verifier: userInfo.verifier || '',
              verifierId: userInfo.verifierId || '',
              publicKey: web3auth.provider ?
                (await web3auth.provider.request({ method: 'eth_accounts' }) as string[])[0] : null,
              // Add any other user information you need
            }),
          });

          if (!response.ok) {
            console.error("Failed to store user data:", await response.text());
          }
        } catch (error) {
          console.error("Failed to get or store user info:", error);
        }
      }

    } catch (error) {
      console.error("Login error:", error);
    }
  };
  const webAuthLogout = async () => {
    try {
      if (web3auth) {
        await web3auth.logout();
        setLoggedIn(false);
        setProvider(null);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Combine both logout methods
  const combinedLogout = async () => {
    await webAuthLogout();
    logout(); // This is the NextAuth logout
  };

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      // Use the logout function from useAuthLogin
      logout();
    } else if (isWeb3AuthInitialized) {
      try {
        await login();

        // Check if we successfully logged in
        if (loggedIn) {
          // Use authStore to update authentication state if not already handled
          if (!isAuthenticated && web3auth && web3auth.connected) {
            const userInfo = await web3auth.getUserInfo();
            useAuthStore.getState().setIsAuthenticated(true);
            useAuthStore.getState().setUser({
              id: userInfo.verifierId || undefined,
              name: userInfo.name || undefined,
              image: userInfo.profileImage || undefined,
              username: userInfo.name || undefined,
            });
          }

          // Navigate to profile page after successful login
          router.push('/profile');
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
    } else {
      console.error("Web3Auth is not initialized yet");
    }
  };

  return {
    scrolled,
    setScrolled,
    isAuthenticated,
    isLoading,
    user,
    logout: combinedLogout, // Return the combined logout function
    connected,
    connect,
    provider,
    loggedIn,
    web3auth,
    isWeb3AuthInitialized,
    login
  }
}
