"use client"
import { Game, games } from '@/data'
import BackIcon from '@/public/icons/BackIcon'
import CurvedArrow from '@/public/icons/CurvedArrow'
import { reverseFormatString } from '@/utils/utils'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import MessagePopup from './ui/message-popup'
import MessageInput from './ui/message-input'
import gsap from 'gsap'
import StatsIcon from '@/public/icons/StatsIcon'
import WagerModal from './ui/WagerModal'
import FundWagerModal from './ui/FundWagerModal'
import TransactionConfirmedModal from './ui/TransactionConfirmedModal'

type Params = {
  game: string
}

const ClientParticularGamePage = () => {
  const isLive = true
  const router = useRouter()
  const { game } = useParams<Params>()
  const [homeTeam, awayTeam] = reverseFormatString(game).split("Vs")
  const seletedGame = games.find((g) => g.awayTeam === awayTeam?.trim() && g.homeTeam === homeTeam?.trim()) as Game
  const inputRef = React.useRef<HTMLDivElement>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [isSlidOut, setIsSlidOut] = React.useState(false);

  // Wager state
  const [isWagerModalOpen, setIsWagerModalOpen] = useState(false)
  const [isFundModalOpen, setIsFundModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [insufficientBalance, setInsufficientBalance] = useState(false)
  const [wagerCondition, setWagerCondition] = useState('')
  const [stakeAmount, setStakeAmount] = useState(0)
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null)

  const handleToggle = () => {
    if (!boxRef.current) return;

    if (!isSlidOut) {
      boxRef.current.style.position = "fixed";
      boxRef.current.style.top = `${boxRef.current.offsetTop}px`;
      boxRef.current.style.left = `${boxRef.current.offsetLeft}px`;

      // Slide OUT (down off the screen)
      gsap.to(boxRef.current, {
        y: window.innerHeight,
        duration: 1,
        ease: "power4.in",
      });

      // Animate input down and fade
      gsap.to(inputRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.in",
      });
    } else {
      // Slide BACK IN (to original position)
      gsap.to(boxRef.current, {
        y: 0,
        duration: 1,
        ease: "power4.in",
        onComplete: () => {
          if (boxRef.current) {
            boxRef.current.style.position = "static";
          }
        },
      });

      gsap.to(inputRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power4.out",
      });
    }

    setIsSlidOut((prev) => !prev); // Toggle state
  };

  const handleWagerClick = () => {
    setSelectedMessage(null);
    setIsWagerModalOpen(true);
  }

  const handleWagerProceed = (condition: string, stake: number) => {
    setWagerCondition(condition);
    setStakeAmount(stake);
    
    // For demo purposes, we're showing insufficient balance if stake > 5
    if (stake > 5) {
      setInsufficientBalance(true);
    } else {
      setIsWagerModalOpen(false);
      setIsFundModalOpen(true);
    }
  }

  const handleFundConfirm = async () => {
    try {
      // In a real implementation, we would use the BettingClient
      // For example:
      // const wallet = new Wallet(keypair);
      // const bettingClient = new BettingClient(wallet, 'devnet');
      // const tx = await bettingClient.placeBet(
      //   matchId, 
      //   stakeAmount,
      //   wagerCondition,
      //   tokenMint,
      //   bettorTokenAccount,
      //   escrowTokenAccount
      // );
      
      // For demo, we just show confirmation
      setIsFundModalOpen(false);
      setIsConfirmationModalOpen(true);
      
      // Close confirmation after 3 seconds
      setTimeout(() => {
        setIsConfirmationModalOpen(false);
      }, 3000);
    } catch (error) {
      console.error('Error placing bet:', error);
    }
  }

  console.log(game)

  return (
    <main className='bg-gradient-to-b from-gradientDarkGreen to-gradientLightGreen h-screen'>
      <div className='absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-10'>
        <StatsIcon />
      </div>

      <div className='sticky md:fixed top-0 left-0 right-0 rounded-b-md text-white bg-gradientDarkGreen z-30'>
        <div className='container mx-auto px-6 pt-6 pb-2 '>
          <div className='flex justify-between items-center'>
            <button onClick={() => router.back()}>
              <BackIcon />
            </button>
            <CurvedArrow />
          </div>
          <div className='flex flex-col justify-center items-center gap-1'>
            <div className='flex w-[calc(100%_-_10%)] pt-2 justify-between items-center'>
              <div className='flex flex-col items-center'>
                <img
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
                  <div className='font-dmSans text-[0.6rem] lg:text-[0.7rem]'>45 : 04</div>
                </div>
              ) : (
                <div className='font-dmSans text-[1rem] lg:text-[1.1rem]'>20:00</div>
              )}

              <div className='flex flex-col items-center'>
                <img
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
            <button onClick={handleToggle} className='bg-[#3E3D3D] w-[34px] border-2 border-[#3E3D3D] rounded-full' />
          </div>

          <div className='flex flex-col gap-1 items-center justify-center'>
          </div>
        </div>
      </div>

      <div className='border bg-[#ECF5F5] h-[calc(100vh-150px)] z-20 overflow-auto'>
        <MessageInput 
          ref={inputRef} 
          onWagerClick={handleWagerClick}
        />
        <div className='container mx-auto px-3 py-1 bg-[#ECF5F5] pb-20' ref={boxRef}>
          <MessagePopup />
        </div>
      </div>

      {/* Wager Modals */}
      <WagerModal 
        isOpen={isWagerModalOpen} 
        onClose={() => {
          setIsWagerModalOpen(false);
          setInsufficientBalance(false);
        }} 
        onProceed={handleWagerProceed}
        username={selectedMessage?.username || "Pkay"}
        insufficientBalance={insufficientBalance}
      />

      <FundWagerModal 
        isOpen={isFundModalOpen} 
        onClose={() => setIsFundModalOpen(false)} 
        onConfirm={handleFundConfirm}
        amount={stakeAmount}
      />

      <TransactionConfirmedModal 
        isOpen={isConfirmationModalOpen} 
        onClose={() => setIsConfirmationModalOpen(false)} 
      />
    </main>
  )
}

export default ClientParticularGamePage
