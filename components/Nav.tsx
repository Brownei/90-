'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthState } from '@/context';

const Nav = () => {
  const pathname = usePathname();
  const { login, user } = useAuthState();

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

  console.log('User:', user);

  return (
    <nav
      className={`
      ${scrolled ? 'fixed shadow-md' : pathname !== '/' ? 'fixed' : 'absolute'} 
      top-0 left-0 z-50 right-0 px-3 lg:px-5 py-3 transition-all duration-300 
      ${scrolled ? 'bg-[#ffffff]/95 backdrop-blur-sm' : 'bg-[#ffffff]'} 
      text-black w-full
    `}
    >
      <div className="flex justify-between items-center">
        <Link href={'/'}>
          <Image
            src={'/logo.png'}
            width={500}
            height={500}
            alt="Logo"
            quality={100}
            className="size-[32px]"
          />
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <Link
              href={'/profile'}
              className={` font-semibold text-[0.8rem] cursor-pointer text-black`}
            >
              Profile
            </Link>
          )}
          {!user ? (
            <button
              onClick={login}
              className="bg-blue-500 flex items-center gap-3 py-2 px-3 rounded-full  font-semibold text-white text-[0.8rem] cursor-pointer"
            >
              <>
                <span className="flex gap-3 items-center font-bold">Login</span>
              </>
            </button>
          ) : (
            <button className="bg-blue-500 flex items-center gap-3 py-2 px-3 rounded-full  font-semibold text-white text-[0.8rem] cursor-pointer">
              Log Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
