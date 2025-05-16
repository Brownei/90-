"use client"
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthLogin } from '@/hooks/use-auth-login';
import { useSession } from 'next-auth/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { trpc } from '@/trpc/client';
import { airdropSol, getSolanaBalance } from '@/utils/solanaHelpers';
import toast from 'react-hot-toast';
import { PublicKey } from '@solana/web3.js';

const Nav = () => {
  const pathname = usePathname()
  const {data, status} = useSession()
  const user = data?.user
  const router = useRouter();
  const {connect, connected, connecting, publicKey} = useWallet()
  const walletMutation = trpc.wallets.createANewWallet.useMutation()
  const {
    isLoading,
    logout,
    login,
    connectToWallet
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
    if (user !== undefined) {
      // await logout();
      if (!connected) {
        await connectToWallet()
        await new Promise((res) => setTimeout(res, 500));
      } 

      if(publicKey) {
        try {
          const balance = await getSolanaBalance(publicKey.toBase58());

          if (balance === 0) {
            const sig = await airdropSol(publicKey.toBase58());
            if (sig) toast.success("1 SOL has been sent to your account");
          }

          await walletMutation.mutateAsync({
            email: user.email!,
            balance,
            publicKey: publicKey.toBase58(),
            address: publicKey.toBase58(),
          });
        } catch (err) {
          console.error("Error in wallet setup:", err);
        }      
      }
    } else {
      try {
        await login();
      } catch (error) {
        console.error("Authentication error:", error);
      }

      return;
    } 
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
          {(user !== undefined) && (
            <Link
              href={'/profile'}
              className={` font-semibold text-[0.8rem] cursor-pointer text-black`}
            >
              Profile
            </Link>
          )}

          {/* {(user !== undefined) && ( */}
          {/*   <button */}
          {/*     // href={'/wallet'} */}
          {/*     onClick={async () => await connectToWallet()} */}
          {/*     className={` font-semibold border border-darkGreen py-2 px-3 rounded-full text-[0.8rem] cursor-pointer text-black`} */}
          {/*   > */}
          {/*     {connected ? `${publicKey.toBase58().slice(0, 8) + '...'}`: connecting ? 'Connecting...' : 'Connect to Wallet'} */}
          {/*   </button> */}
          {/* )} */}

          <button
            onClick={handleAuthAction}
            disabled={isLoading}
            className='bg-darkGreen flex items-center gap-3 py-2 px-3 rounded-full  font-semibold text-white text-[0.8rem] cursor-pointer'
          >
            {(isLoading || status === 'loading') ? (
              <span className="flex gap-3 items-center">Loading...</span>
            ) : (user !== undefined) ? (
              <span className="flex gap-3 items-center">
                {user?.image ? (
                  <div className="h-5 w-5 rounded-full overflow-hidden">
                    <Image
                      src={user.image}
                      alt={user.name || 'User'}
                      width={500}
                      height={500}
                      quality={100}
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <span className='hidden'>{user?.name || 'User'}</span>
                <span>{connected ? `${publicKey?.toBase58().slice(0, 5) + '...'}`: connecting ? 'Connecting...' : 'Connect to Wallet'}</span>
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
