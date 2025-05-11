'use client';
import React from 'react'
import Image from 'next/image';
import MessageIcon from '@/public/icons/MessageIcon';
import ChainIcon from '@/public/icons/ChainIcon';
import FooterLogo from '@/public/icons/FooterLogo';
import Link from 'next/link';
import { ArrowRight, } from 'lucide-react';
import { useAuthLogin } from '@/hooks/use-auth-login';

const Homepage = () => {
  const { loggedIn, user } = useAuthLogin()
  // async function joinConversation() {
  //   if (!isAuthenticated && !loggedIn) {
  //     await login()
  //   }
  //
  //   router.push('/comment-hub')
  // }

  return (
    <main>
      <div>
        <div className='relative'>
          <Image
            className='w-full object-cover h-[100dvh]'
            src={'/hero.jpg'}
            alt='Cheering'
            width={500}
            height={500}
            quality={100}
            unoptimized={true}
          />
          <div className='absolute grid gap-2 top-[50%] z-40 text-white text-center w-full left-[50%] translate-x-[-50%] translate-y-[-40%] lg:translate-y-[-50%]'>
            <h1 className=' text-[1.5rem] lg:text-[5rem] lg:leading-[70px] uppercase font-bold w-full'>The center stage for the global game</h1>
            <div className='flex flex-col justify-center items-center font-medium mx-4 lg:mx-0'>
              <p className='text-[0.8rem] lg:w-[200px] font-medium text-center'>The Home of Live Football Engagement, Powered by You!</p>
            </div>
          </div>
          <div className='bg-black/30 absolute z-20 top-0 left-0 right-0 bottom-0' />
        </div>


        <div className={` items-center container mx-auto px-4.5 grid grid-cols-1 grid-flow-row ${(loggedIn && user !== null) ? 'lg:grid-cols-1' : 'lg:grid-cols-1'} gap-4 mt-[25px] lg:mt-[50px]`}>


          <div className='bg-darkGreen rounded-md text-white p-4.5 w-[22rem] h-[12rem] gap-5'>
            <div className='flex justify-between items-center'>
              <MessageIcon />
              <Link href={'/comment-hub'} className=' p-2 rounded-full'>
                <ArrowRight />
              </Link>
            </div>
           
            <div className='grid gap-.005'>
              <h4 className='font-medium py-[15] text-[1.2rem]'>Comment Hubs</h4>
              <p className='text-[0.8rem] font-light lg:text-[0.8rem]'>Step into the Comment Hubs, where fans from all over the world connect to debate, celebrate, and Interact in real-time.</p>
            </div>
          </div>
        </div>


        <div className='container mx-auto p-4 lg:px-6 lg:py-12 bg-white flex flex-col justify-center items-center gap-4 mt-[25px] lg:mt-[50px]'>
          <div className='relative flex flex-col justify-center text-center items-center w-full'>
            <h4 className='font-medium text-[1.2rem] p-3.5'> In-Play Wagers{":"} Bet on Your Banter</h4>
            <p className=' w-full font-light lg:w-[800px] text-center text-[0.8rem] lg:text-[0.5rem]'>Soon, {"you’ll"} be able to instantly bet your takes during live matches. Whether {"it's"} a bold prediction or a hot debate, In-play wagers will let you put your insights on the line, enabling Peer to Peer bets</p>
          <Image
            className='w-[70px] h-[94px]'
            src={"/ball.gif"}
            alt="Ball gif"
            width={500}
            height={500}
            quality={100}
            unoptimized={true}
          />
            <Image
              className='absolute left-0 right-0 bottom-0 top-0 object-cover block lg:hidden'
              src={"/background.png"}
              alt="Background"
              width={1000}
              height={1000}
              quality={100}
            />
          </div>
        </div>


        <div className='bg-[#141517]  text-white lg:pb-[20px] mt-[25px] lg:mt-[50px]'>
          <div className='mb-[50px] flex flex-col justify-center items-center gap-3 p-4 lg:px-6 lg:pt-12 '>
            <h4 className='font-medium text-[1.2rem] p-3.5'>What’s Next? Stay Tuned…</h4>
            <p className='w-full font-light lg:w-[800px] text-center text-[0.8rem] lg:text-[0.5rem]'>The game never stops and neither do we. Big features are on the horizon, and you won’t want to miss what’s coming next.
              Partake in the future of live football Interaction</p>
            <div className='bg-ash flex justify-between items-center rounded-full p-1'>
              <input className='outline-none border-none text-white w-full lg:w-[354px] text-[0.7rem] p-2' placeholder='Enter your email address' />
              <button className='text-black bg-white rounded-full font-semibold text-[0.7rem] p-2'>Subscribe</button>
            </div>
          </div>
          <div className='border-ash border-[0.75px] w-full' />
          <div className='flex justify-between items-center text-[0.6rem] px-2 py-3'>
            <p className='text-white/40'>© 2025 90+</p>
            <div className='flex gap-1 items-center text-[#ECF5F5]'>
              <Link href={'/'}>Support</Link>
              <span className='text-white/40'>|</span>
              <Link className='w-full' href={'/'}>{`Terms & Conditions`}</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );


}

export default Homepage
