import { Game } from '@/data'
import Image from 'next/image'
import React from 'react'

const Card = ({ game }: { game: Game }) => {
  return (
    <div className='p-3 text-black border border-[#BEBEBE]/50 bg-white rounded-[12px]'>

      <h2 className='text-[1rem] font-dmSans font-semibold text-center'>UEFA Champions League</h2>
      <div className='flex justify-between items-center p-4 lg:p-6'>
        <div className='flex flex-col items-center'>
          <Image
            src={game.homeImage}
            alt={game.homeTeam}
            width={100}
            height={100}
            className='w-[50px] lg:w-[150px]'
          />
          <p className='text-center text-[0.9rem] lg:text-[1rem] font-dmSans'>{game.homeTeam}</p>
        </div>

        <div className='font-dmSans text-[1rem] lg:text-[1.1rem]'>20:00</div>

        <div className='flex flex-col items-center'>
          <Image
            src={game.awayImage}
            alt={game.awayTeam}
            width={100}
            height={100}
            className='w-[50px] lg:w-[150px]'
          />
          <p className='text-center text-[0.9rem] lg:text-[1rem] font-dmSans'>{game.awayTeam}</p>
        </div>
      </div>

      <div className='flex justify-center items-center'>
        <button className='w-fit bg-darkGreen py-1 px-6 text-white font-dmSans font-extrabold rounded-xl'>Launch Hub</button>
      </div>
    </div>)
}

export default Card
