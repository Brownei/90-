"use client"
import { useAtom } from 'jotai';
import { useAuthStore } from '@/stores/authStore';
import { CHAIN_NAMESPACES, CustomChainConfig, IProvider, WEB3AUTH_NETWORK, } from "@web3auth/base";
import { useEffect, useState, } from 'react'
import { scrolledAtom, providerAtom, loggedInAtom, web3authAtom, isWeb3AuthInitializedAtom, userAtom } from '@/stores/navStore';
import { useWallet, } from '@solana/wallet-adapter-react';
import { Web3Auth } from "@web3auth/modal";
import { useRouter } from 'next/navigation';
import { SolanaPrivateKeyProvider, SolanaWallet } from "@web3auth/solana-provider";
import { trpc } from '@/trpc/client';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { encryptData } from '@/utils/utils';
import { useSessionStore } from '@/stores/use-session-store';
import { PersonalWallet } from '@/helpers/wallet';
import { airdropSol, getSolanaBalance, getTokenAccounts } from '@/utils/solanaHelpers';
import { useProviderStore } from '@/stores/use-provider-store';
import { jsonlStreamConsumer } from '@trpc/server/unstable-core-do-not-import';

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
    isAuthenticated,
  } = useAuthStore();
  const { connected, connect } = useWallet();
  const {provider, setProvider} = useProviderStore();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useAtom(userAtom);
  const [loggedIn, setLoggedIn] = useAtom(loggedInAtom);
  const [web3auth, setWeb3auth] = useAtom(web3authAtom);
  const [isWeb3AuthInitialized, setIsWeb3AuthInitialized] = useAtom(isWeb3AuthInitializedAtom);
  const router = useRouter()
  const loginMutation = trpc.users.login.useMutation()
  const logoutMutation = trpc.users.logout.useMutation()
  const {setSession} = useSessionStore()
  
const initWeb3Auth = async () => {
      setIsLoading(true)
      try {
        // Check if client ID exists
        const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
        
        if (!clientId) {
          console.error("Web3Auth client ID is missing! Please add NEXT_PUBLIC_WEB3AUTH_CLIENT_ID to your .env.local file");
          return;
        }

        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider: privateKeyProvider,
        });

        await web3authInstance.initModal();
        setWeb3auth(web3authInstance);
        setIsWeb3AuthInitialized(true);
        // setProvider(web3authInstance.provider);

        if (web3authInstance.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error("Failed to initialize Web3Auth:", error);
      } finally {
        setIsLoading(false)
      }
    };



useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        // Check if client ID exists
        const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
        
        if (!clientId) {
          console.error("Web3Auth client ID is missing! Please add NEXT_PUBLIC_WEB3AUTH_CLIENT_ID to your .env.local file");
          return;
        }

        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider: privateKeyProvider,
        });

        await web3authInstance.initModal();
        setWeb3auth(web3authInstance);
        setIsWeb3AuthInitialized(true);
        // setProvider(web3authInstance.provider);

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

    return user;
  };
  const login = async () => {
    setIsLoading(true)
    try {
      // await signIn("twitter")
      // setLoggedIn(true)

      if (!web3auth) {
        await initWeb3Auth()
      } else {
        await web3auth.connect();
      // setProvider(web3authProvider);

      if (web3auth.connected) {
        setLoggedIn(true);

        // Get user info and save to database
        try {
          const userWallet = new PersonalWallet(web3auth.provider!)
          const userInfo = await web3auth.getUserInfo();
          const keypair = Keypair.generate()
          console.log({keypair})
          // const balance = await getSolanaBalance(keypair.publicKey)
          const encryptedProvider = encryptData(JSON.stringify(keypair))
          const token = await loginMutation.mutateAsync({
            name: userInfo.name as string,
            email: userInfo.email as string,
            profileImage: userInfo.profileImage as string,
            email_verified: true,
            publicKey: keypair.publicKey,
            balance: 0,
            encryptedProvider: encryptedProvider,
          })

          setSession(token as string)

          setUser({
              name: userInfo.name,
              profileImage: userInfo.profileImage,
              email: userInfo.email,
              address: keypair.publicKey.toBase58(),
              balance: "0",
          })

          setProvider(keypair);
          if (token) {
            const sig = await airdropSol(keypair.publicKey)
          }
        } catch (error) {
          console.error("Failed to get or store user info:", error);
        }
      }
      }

      // if (!isWeb3AuthInitialized) {
       // console.error("Web3Auth modal not initialized yet");
        // return;
      // 

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

      router.push('/')
      setLoggedIn(false);
      setProvider(null);
      setIsAuthenticated(false)
      await logoutMutation.mutateAsync()
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    scrolled,
    setScrolled,
    isAuthenticated,
    isLoading,
    user,
    logout: webAuthLogout,
    connected,
    connect,
    provider,
    setProvider,
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
