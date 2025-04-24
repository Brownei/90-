"use client"
import Logo from '@/public/icons/Logo'
import TwitterIcon from '@/public/icons/TwitterIcon'
import React from 'react'
import { usePathname } from 'next/navigation';

const Nav = () => {
  const pathname = usePathname()
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
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
  }, []);

  return (
    <nav className={`${pathname !== '/' ? 'fixed top-0 left-0 z-50 right-0 px-3 lg:px-5 py-3 transition-colors duration-300 bg-[#ECF5F5] text-black' : 'absolute z-50 w-full px-3 lg:px-5 py-3 text-white'}`}>
      <div className='flex justify-between items-center'>
        <div className='flex gap-1 items-center'>
          <Logo pathname={pathname} />
          <span className={`${pathname !== '/' ? 'text-black/40' : 'text-white/40'}`}>|</span>
          <p className='text-[0.8rem] font-dmSans'>90+</p>
        </div>

        <button className='bg-ctaButton flex items-center gap-3 py-2 px-3 rounded-2xl font-dmSans font-semibold text-white text-[0.8rem]'>
          <span className='hidden lg:flex gap-3 items-center'>Register/Sign in with <TwitterIcon /></span>
          <span className='flex gap-3 lg:hidden items-center'>Connect <TwitterIcon /></span>
        </button>
      </div>
    </nav>
  )
}

export default Nav
