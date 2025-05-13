"use client"
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthLogin } from '@/hooks/use-auth-login';

const Nav = () => {
  const pathname = usePathname()
  const router = useRouter();
  const {
    isLoading,
    logout,
    connected,
    user,
    loggedIn,
    isWeb3AuthInitialized,
    login,
  } = useAuthLogin();

  // State to track scroll position
  const [scrolled, setScrolled] = useState(false);
  console.log({user})

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


  const handleAuthAction = async () => {
    if (loggedIn && user !== null) {
      // await logout();
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
              className={` font-semibold text-[0.8rem] cursor-pointer text-black`}
            >
              Profile
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
