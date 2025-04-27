"use client"
import { Game, games } from '@/data'
import BackIcon from '@/public/icons/BackIcon'
import CurvedArrow from '@/public/icons/CurvedArrow'
import { reverseFormatString } from '@/utils/utils'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React from 'react'
import MessagePopup from './ui/message-popup'
import MessageInput from './ui/message-input'

type Params = {
  game: string
}

const ClientParticularGamePage = () => {
  const isLive = true
  const { game } = useParams<Params>()
  const [homeTeam, awayTeam] = reverseFormatString(game).split("Vs")
  const seletedGame = games.find((g) => g.awayTeam === awayTeam?.trim() && g.homeTeam === homeTeam?.trim()) as Game

  console.log(game)

  return (
    <main>

      <div className='sticky md:fixed top-0 left-0 right-0 bg-gradient-to-b from-gradientDarkGreen rounded-b-md text-white to-gradientLightGreen'>
        <div className='container mx-auto px-6 pt-6 pb-2 h-fit'>
          <div className='flex justify-between items-center'>
            <BackIcon />
            <CurvedArrow />
          </div>
          <div className='flex flex-col justify-center items-center gap-1'>
            <div className='flex w-[calc(100%_-_10%)] pt-2 justify-between items-center'>
              <div className='flex flex-col items-center'>
                <Image
                  src={seletedGame.homeImage}
                  alt={seletedGame.homeTeam}
                  width={100}
                  height={100}
                  className='w-[42px] md:w-[63px] lg:w-[84px]'
                />
                <p className='text-center text-[0.65rem] lg:text-[0.7rem] font-sofiaSans'>{seletedGame.homeTeam}</p>
              </div>

              {isLive ? (
                <div className='grid place-items-center'>
                  <div className='flex items-center gap-1 leading-10 font-dmSans font-bold'>
                    <p className=' text-[2.5rem] lg:text-[3rem]'>{seletedGame.homeScore}</p>
                    <span className='text-[2.5rem] lg:text-[3rem]'> - </span>
                    <p className=' text-[2.5rem] lg:text-[3rem]'>{seletedGame.awayScore}</p>
                  </div>
                  <div className='font-dmSans text-[0.6rem] lg:text-[0.7rem]'>20:00</div>
                </div>
              ) : (
                <div className='font-dmSans text-[1rem] lg:text-[1.1rem]'>20:00</div>
              )}

              <div className='flex flex-col items-center'>
                <Image
                  src={seletedGame.awayImage}
                  alt={seletedGame.awayTeam}
                  width={100}
                  height={100}
                  className='w-[42px] md:w-[63px] lg:w-[84px]'
                />
                <p className='text-center text-[0.65rem] lg:text-[0.7rem] font-sofiaSans'>{seletedGame.awayTeam}</p>
              </div>
            </div>

            <p className='font-sofiaSans font-bold text-[0.75rem]'>Match overview</p>
            <div className='bg-[#3E3D3D] w-[34px] border-2 border-[#3E3D3D] rounded-full' />
          </div>

          <div className='flex flex-col gap-1 items-center justify-center'>
          </div>
        </div>
      </div>

      <div>
        <div className='container mx-auto px-3 py-1 h-screen'>
          <MessagePopup />
          <MessageInput />
        </div>
      </div>
    </main>
  )
}

export default ClientParticularGamePage
