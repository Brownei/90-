"use client"
import { useAtom } from 'jotai';
import { useAuthStore } from '@/stores/authStore';
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, } from "@web3auth/base";
import { useEffect, } from 'react'
import { scrolledAtom, providerAtom, loggedInAtom, web3authAtom, isWeb3AuthInitializedAtom, userAtom } from '@/stores/navStore';
import { useWallet, } from '@solana/wallet-adapter-react';
import { Web3Auth } from "@web3auth/modal";
import { useRouter } from 'next/navigation';
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { trpc } from '@/trpc/client';

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
  const [scrolled, setScrolled] = useAtom(scrolledAtom);
  const {
    setIsAuthenticated,
    setIsLoading,
    isAuthenticated,
    isLoading
  } = useAuthStore();
  const { connected, connect } = useWallet();
  const [provider, setProvider] = useAtom(providerAtom);
  const [user, setUser] = useAtom(userAtom);
  const [loggedIn, setLoggedIn] = useAtom(loggedInAtom);
  const [web3auth, setWeb3auth] = useAtom(web3authAtom);
  const [isWeb3AuthInitialized, setIsWeb3AuthInitialized] = useAtom(isWeb3AuthInitializedAtom);
  const router = useRouter()
  const loginMutation = trpc.users.login.useMutation()
  const logoutMutation = trpc.users.logout.useMutation()

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        const web3authInstance = new Web3Auth({
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID as string,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider: privateKeyProvider,
        });

        // web3authInstance.provider.
        await web3authInstance.initModal();
        setWeb3auth(web3authInstance);
        setIsWeb3AuthInitialized(true);
        setProvider(web3authInstance.provider);

        if (web3authInstance.connected) {
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

    return user;
  };
  const login = async () => {
    setIsLoading(true)
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
          // getUs

          await loginMutation.mutateAsync({
            name: userInfo.name as string,
            email: userInfo.email as string,
            profileImage: userInfo.profileImage as string,
            email_verified: true
          })

          setUser({
              name: userInfo.name,
              profileImage: userInfo.profileImage,
              email: userInfo.email
          })
        } catch (error) {
          console.error("Failed to get or store user info:", error);
        }
      }

    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false)
    }
  };
  const webAuthLogout = async () => {
    try {
      if (web3auth?.connected) {
        await web3auth.logout();
      }

      setLoggedIn(false);
      setProvider(null);
      setIsAuthenticated(false)
      await logoutMutation.mutateAsync()
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Combine both logout methods
  // const combinedLogout = async () => {
  //   await webAuthLogout();
  //   logout(); // This is the NextAuth logout
  // };

  // const handleAuthAction = async () => {
  //   if (isAuthenticated) {
  //     // Use the logout function from useAuthLogin
  //     logout();
  //   } else if (isWeb3AuthInitialized) {
  //     try {
  //       await login();
  //
  //       // Check if we successfully logged in
  //       if (loggedIn) {
  //         // Use authStore to update authentication state if not already handled
  //         if (!isAuthenticated && web3auth && web3auth.connected) {
  //           const userInfo = await web3auth.getUserInfo();
  //           useAuthStore.getState().setIsAuthenticated(true);
  //           useAuthStore.getState().setUser({
  //             id: userInfo.verifierId || undefined,
  //             name: userInfo.name || undefined,
  //             image: userInfo.profileImage || undefined,
  //             username: userInfo.name || undefined,
  //           });
  //         }
  //
  //         // Navigate to profile page after successful login
  //         router.push('/profile');
  //       }
  //     } catch (error) {
  //       console.error("Authentication error:", error);
  //     }
  //   } else {
  //     console.error("Web3Auth is not initialized yet");
  //   }
  // };

  return {
    scrolled,
    setScrolled,
    isAuthenticated,
    isLoading,
    user,
    logout: webAuthLogout, // Return the combined logout function
    connected,
    connect,
    provider,
    loggedIn,
    setLoggedIn,
    web3auth,
    isWeb3AuthInitialized,
    login,
    setIsAuthenticated,
    setIsLoading,
    setUser,
    getUserInfo
  }
}
