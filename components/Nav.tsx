"use client"
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthLogin } from '@/hooks/use-auth-login';
import { useWallet } from "@civic/auth-web3/react";
import { trpc } from '@/trpc/client';
import { airdropSol, getSolanaBalance } from '@/utils/solanaHelpers';
import toast from 'react-hot-toast';
import { useUser } from "@civic/auth-web3/react";
import CivicWallet from './CivicWallet';
import { addListener } from 'process';

const Nav = () => {
  const pathname = usePathname()
  const usercontext = useUser()
  const { user, authStatus: status } = usercontext
  const { address } = useWallet({ type: "solana" });
  const router = useRouter();
  const walletMutation = trpc.wallets.createANewWallet.useMutation()
  const {
    isLoading,
    setLoggedIn,
    setIsLoading,
    login,
    setUser,
    user: settedUser
  } = useAuthLogin();

  // State to track scroll position
  const [scrolled, setScrolled] = useState(false);

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
    if (user !== null && status === 'authenticated') {
      setIsLoading(false)
      setLoggedIn(true)
      setUser({
        email: user.email!,
        id: user.id,
        name: user.name,
        profileImage: user.picture,
        address: address ? address : '',
      })
    }
  }, [user, status])


  // console.log({ user, settedUser, status })

  return (
    <nav className={`
      ${scrolled ? 'fixed shadow-md' : pathname !== '/' ? 'fixed' : 'absolute'} 
      top-0 left-0 z-50 right-0 px-3 lg:px-5 py-3 transition-all duration-300 
      ${scrolled ? 'bg-[#ffffff]/95 backdrop-blur-sm' : 'bg-[#ffffff]'} 
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
          {settedUser !== null && (
            <Link
              href={'/profile'}
              className={` font-semibold text-[0.8rem] cursor-pointer text-black`}
            >
              Profile
            </Link>
          )}
          <button
            onClick={
              async () => await login()
            }
            disabled={isLoading}
            className='bg-blue-500 flex items-center gap-3 py-2 px-3 rounded-full  font-semibold text-white text-[0.8rem] cursor-pointer'
          >
            {((isLoading) ? (
              <span className="flex gap-3 items-center">Loading...</span>
            ) : settedUser !== null ? (
              <span className="flex gap-3 items-center">
                {settedUser?.profileImage ? (
                  <div className="h-5 w-5 rounded-full overflow-hidden">
                    <Image
                      src={settedUser?.profileImage!}
                      alt={settedUser.name || 'User'}
                      width={500}
                      height={500}
                      quality={100}
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <span className='hidden'>{settedUser?.name || 'User'}</span>
                <span>{settedUser?.address?.slice(0, 5)}...</span>
              </span>
            ) : (
              <>
                <span className='hidden lg:flex gap-3 items-center font-bold'> Join Now</span>
                <span className='flex gap-3 lg:hidden items-center'>Join Now</span>
              </>
            ))}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Nav
