'use client';
import React from 'react'
import { trpc } from '@/trpc/client';
import Image from 'next/image';
import MessageIcon from '@/public/icons/MessageIcon';
import ArrowRightIcon from '@/public/icons/ArrowRightIcon';
import ChainIcon from '@/public/icons/ChainIcon';

const Homepage = () => {
  //const greeting = trpc.hello.useQuery({ text: "Brownson" });

  return (
    <main>
      <div className='mb-[100px]'>


        <div className='relative'>
          <Image
            className='w-full object-cover h-[100dvh]'
            src={'/header.gif'}
            alt='Cheering'
            width={1000}
            height={1000}
            quality={100}
          />
          <div className='absolute grid gap-2 top-[50%] z-40 text-white text-center w-full left-[50%] translate-x-[-50%] translate-y-[-40%] lg:translate-y-[-50%]'>
            <h1 className='font-specialGothic text-[2rem] lg:text-[5rem] lg:leading-[70px] uppercase w-full'>The center stage for the global game</h1>
            <div className='flex flex-col justify-center items-center mx-4 lg:mx-0'>
              <p className='font-dmSans text-[0.8rem] lg:w-[600px] text-center'>The future of live football engagement, powered by you, where fans take control, interact in real time, and shape the game experience like never before.</p>
              <button className='bg-ctaButton py-[7px] px-[20px] w-fit rounded-full text-[0.9rem] font-dmSans font-semibold mt-2 text-white'>Join the conversation</button>
            </div>
          </div>
          <div className='bg-black/30 absolute z-20 top-0 left-0 right-0 bottom-0' />
        </div>


        <div className='container mx-auto px-2 grid grid-cols-1 grid-flow-row lg:grid-cols-2 gap-4 mt-[25px] lg:mt-[50px]'>
          <div className='bg-darkGreen text-white p-4 grid gap-5'>
            <div className='flex justify-between items-center'>
              <MessageIcon />
              <div className='border p-2 rounded-full'>
                <ArrowRightIcon />
              </div>
            </div>
            <div className='grid gap-2'>
              <h4 className='font-sofiaSans font-bold text-[1.5rem]'>Comment Hubs</h4>
              <p className='font-dmSans italic text-[1rem]'>Step into the Comment Hub, where fans from all over the world connect to debate, celebrate, and Interact in real-time.</p>
            </div>
          </div>

          <div className='bg-darkGreen text-white p-4 grid gap-5'>
            <div className='flex justify-between items-center'>
              <ChainIcon />
              <div className='border p-2 rounded-full'>
                <ArrowRightIcon />
              </div>
            </div>
            <div className='grid gap-2'>
              <h4 className='font-sofiaSans font-bold text-[1.5rem]'>Jump In, No Hassle</h4>
              <p className='font-dmSans italic text-[1rem]'>Connect your X account, share your profile with your followers and banter!</p>
            </div>
          </div>

        </div>


        <div className='container mx-auto p-4 lg:p-6 bg-white flex flex-col justify-center items-center gap-4 mt-[25px] lg:mt-[50px]'>
          <Image
            className='w-[70px] h-[94px]'
            src={"/ball.gif"}
            alt="Ball gif"
            width={1000}
            height={1000}
            quality={100}
          />
          <div className='relative flex flex-col justify-center text-center items-center w-full'>
            <h4 className='font-sofiaSans text-[1.5rem]'>Sidebets: Coming Soon – Bet on Your Banter</h4>
            <p className='font-dmsans italic w-full lg:w-[800px] text-center text-[1rem]'>Soon, you’ll be able to instantly bet your takes during live matches. Whether it's a bold prediction or a hot debate, Sidebets will let you put your insights on the line, enabling Peer to Peer bets</p>

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
      </div>
    </main>
  );


}

export default Homepage
