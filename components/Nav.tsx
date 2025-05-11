"use client"
import TwitterIcon from '@/public/icons/TwitterIcon'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';
import { useAuthLogin } from '@/hooks/use-auth-login';
import { PersonalWallet } from '@/helpers/wallet';
import { IProvider } from '@web3auth/base';
import { Provider } from '@project-serum/anchor';
import { trpc } from '@/trpc/client';
import { decryptData, encryptData } from '@/utils/utils';
import { getSolanaBalance, updateWalletData } from '@/utils/solanaHelpers';
import { useSessionStore } from '@/stores/use-session-store';


const Nav = () => {
  const pathname = usePathname()
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading,
    logout,
    connected,
    provider,
    setProvider,
    user,
    loggedIn,
    setUser,
    web3auth,
    isWeb3AuthInitialized,
    login,
    setIsAuthenticated
  } = useAuthLogin();

  // State to track scroll position
  const [scrolled, setScrolled] = useState(false);
  const [balance, setBalance] = useState(0)
  const {setSession} = useSessionStore()

  // Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
  if (user !== null) {
    const lastRunKey = 'last-balance-check';
    const now = Date.now();
    const lastRun = Number(localStorage.getItem(lastRunKey));

    const TWO_MINUTES = 2 * 60 * 1000;

    if (!lastRun || now - lastRun > TWO_MINUTES) {
      const getB = async () => {
        const userBalance = await getSolanaBalance(user?.address!);

        setProvider(provider);
        setBalance(userBalance);
        await updateWalletData(user?.address!);

        setUser({
            ...user,
            balance: userBalance.toString()
        })
        const token = encryptData(JSON.stringify(user))
        setSession(token)
        localStorage.setItem(lastRunKey, String(now));
      };

      getB();
    }
  }
}, [user]);


  const handleAuthAction = async () => {
    if (loggedIn && user !== null) {
      await logout();
    } else if (isWeb3AuthInitialized && !loggedIn) {
      try {
        await login();
      } catch (error) {
        console.error("Authentication error:", error);
      }
    } else {
      console.error("Web3Auth is not initialized yet");
    }
  };

  const navigateToWallet = () => {
    router.push('/wallet');
  };

  return (
    <nav className={`
      ${scrolled ? 'fixed shadow-md' : pathname !== '/' ? 'fixed' : 'absolute'} 
      top-0 left-0 z-50 right-0 px-3 lg:px-5 py-3 transition-all duration-300 
      ${scrolled ? 'bg-[#ECF5F5]/95 backdrop-blur-sm' : 'bg-[#ECF5F5]'} 
      text-black w-full
    `}>
      <div className='flex justify-between items-center'>

        <Link href={'/'}>
          <Image
            src={'/logo.png'}
            width={500}
            height={500}
            alt='Logo'
            quality={100}
            className='size-[32px]'
          />
        </Link>

        <div className="flex items-center gap-3">
          {(loggedIn && user !== null) && (
            <Link
              href={'/profile'}
              className={` font-semibold text-[0.8rem] cursor-pointer ${pathname !== '/' ? 'text-black' : 'text-white'}`}
            >
            </Link>
          )}

          {(loggedIn && user !== null && connected) && (
            <Link
              href={'/wallet'}
              onClick={navigateToWallet}
              className={`font-semibold text-[0.8rem] cursor-pointer ${pathname !== '/' ? 'text-black' : 'text-white'}`}
            >
              Wallet
            </Link>
          )}

          <button
            onClick={handleAuthAction}
            disabled={!isWeb3AuthInitialized}
            className='bg-darkGreen flex items-center gap-3 py-2 px-3 rounded-full  font-semibold text-white text-[0.8rem] cursor-pointer'
          >
            {(!isWeb3AuthInitialized || isLoading) ? (
              <span className="flex gap-3 items-center">Loading...</span>
            ) : (loggedIn && user !== null) ? (
              <span className="flex gap-3 items-center">
                {user?.profileImage ? (
                  <div className="h-5 w-5 rounded-full overflow-hidden">
                    <Image
                      src={user.profileImage}
                      alt={user.name || 'User'}
                      width={500}
                      height={500}
                      quality={100}
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <span className='hidden lg:inline'>{user?.name || 'User'}</span>
                <span className='lg:hidden'></span>
              </span>
            ) : (
              <>
                <span className='hidden lg:flex gap-3 items-center font-bold'> Join Now</span>
                <span className='flex gap-3 lg:hidden items-center'>Join Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Nav