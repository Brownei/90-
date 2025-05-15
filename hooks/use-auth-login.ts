"use client"
import { useAtom } from 'jotai';
import { useAuthStore } from '@/stores/authStore';
import { CHAIN_NAMESPACES, CustomChainConfig, IProvider, WEB3AUTH_NETWORK, } from "@web3auth/base";
import { useEffect, useState, } from 'react'
import { scrolledAtom,  loggedInAtom, web3authAtom, isWeb3AuthInitializedAtom, userAtom } from '@/stores/navStore';
import { useWallet, } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { SolanaPrivateKeyProvider, SolanaWallet } from "@web3auth/solana-provider";
import { trpc } from '@/trpc/client';
import { useSessionStore } from '@/stores/use-session-store';
import { useProviderStore } from '@/stores/use-provider-store';
import { signIn, useSession } from 'next-auth/react';
import { WalletConnectWalletName, PhantomWalletName } from '@solana/wallet-adapter-wallets';

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
  const {data} = useSession()
  const { connected, connect, select, wallet, wallets, publicKey } = useWallet();
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

  async function login () {
    if(data?.user === undefined) {
      setIsLoading(true)
      try {
        await signIn('twitter')
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
        setLoggedIn(true)
      }
    } 
  }

  async function connectToWallet() {
    if(!wallet) {
      select(PhantomWalletName)
    }

    await connect()
    return publicKey?.toBase58()
  }

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
    getUserInfo,
    connectToWallet,
  }
}
