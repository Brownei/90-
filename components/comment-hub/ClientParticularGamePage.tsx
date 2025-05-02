"use client"
import { Game, games } from '@/data'
import BackIcon from '@/public/icons/BackIcon'
import CurvedArrow from '@/public/icons/CurvedArrow'
import { reverseFormatString } from '@/utils/utils'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import MessagePopup from './ui/message-popup'
import MessageInput from './ui/message-input'
import gsap from 'gsap'
import StatsIcon from '@/public/icons/StatsIcon'
import WagerModal from './ui/WagerModal'
import FundWagerModal from './ui/FundWagerModal'
import TransactionConfirmedModal from './ui/TransactionConfirmedModal'
import { useMessageStore } from '@/stores/use-messages-store'

// Add sample messages data if not already in the store
const sampleMessages = [
  {
    id: 'msg-sample-1',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    username: 'FootballFan22',
    time: '5:30 PM',
    content: 'What a game so far! That last play was incredible.',
    isRef: false,
    reactions: ['👍', '🔥'],
    actionNos: 5,
    replies: [
      {
        id: 'reply-sample-1',
        avatarUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
        username: 'SoccerLover',
        time: '5:32 PM',
        content: 'Absolutely! The midfielder is on fire today!'
      }
    ]
  },
  {
    id: 'msg-sample-2',
    avatarUrl: 'https://randomuser.me/api/portraits/women/45.jpg',
    username: 'SportAnalyst',
    time: '5:35 PM',
    content: 'The defense needs to tighten up in the second half. Too many opportunities for the opponent.',
    isRef: false,
    reactions: ['👀', '👍'],
    actionNos: 8,
    replies: []
  },
  {
    id: 'msg-sample-3',
    avatarUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
    username: 'GameChanger',
    time: '5:40 PM',
    content: 'I bet we\'ll see a substitution in the next 10 minutes. The striker looks tired.',
    isRef: false,
    reactions: ['👍', '🤔'],
    actionNos: 15,
    replies: [
      {
        id: 'reply-sample-2',
        avatarUrl: 'https://randomuser.me/api/portraits/men/28.jpg',
        username: 'CoachMike',
        time: '5:42 PM',
        content: 'Good call! I think they should bring in the young forward.'
      },
      {
        id: 'reply-sample-3',
        avatarUrl: 'https://randomuser.me/api/portraits/women/36.jpg',
        username: 'TacticalGenius',
        time: '5:43 PM',
        content: 'No way, they need to focus on defense first!'
      }
    ]
  }
];

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
  const messageAreaRef = useRef<HTMLDivElement>(null);
  const [isSlidOut, setIsSlidOut] = React.useState(false);
  const { messages, addMessage } = useMessageStore();
  const [messageCount, setMessageCount] = useState(0);

  // Add sample messages on first load if needed
  useEffect(() => {
    if (messages.length <= 2) {
      sampleMessages.forEach(msg => {
        addMessage(msg);
      });
    }
    
    // Set initial message count to track new messages
    setMessageCount(messages.length);
  }, [addMessage]);
  
  // Track message changes and scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > messageCount) {
      scrollToBottom();
      setMessageCount(messages.length);
    }
  }, [messages.length, messageCount]);
  
  const scrollToBottom = () => {
    if (messageAreaRef.current) {
      setTimeout(() => {
        messageAreaRef.current?.scrollTo({
          top: messageAreaRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  // New function to handle manual scroll to bottom
  const handleScrollToBottom = () => {
    scrollToBottom();
  };

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


  return (
    <main className='bg-gradient-to-b overflow-scroll from-gradientDarkGreen to-gradientLightGreen min-h-screen flex flex-col'>
      {/* Mobile status bar */}
      <div className='flex justify-between items-center px-4 py-2 bg-green-600 text-white'>
        <div className='text-sm font-medium'>9:41</div>
        <div className='flex items-center space-x-2'>
          <div className='flex space-x-1'>
            <div className='w-1 h-2 bg-white rounded-sm'></div>
            <div className='w-1 h-3 bg-white rounded-sm'></div>
            <div className='w-1 h-4 bg-white rounded-sm'></div>
            <div className='w-1 h-5 bg-white rounded-sm'></div>
          </div>
          <div className='flex space-x-0.5'>
            <div className='w-0.5 h-2 bg-white rounded-full'></div>
            <div className='w-0.5 h-3 bg-white rounded-full'></div>
            <div className='w-0.5 h-4 bg-white rounded-full'></div>
          </div>
          <div className='w-4 h-3 border border-white rounded-sm relative'>
            <div className='absolute inset-0.5 bg-white'></div>
            <div className='absolute -right-1 top-1/2 transform -translate-y-1/2 w-0.5 h-1.5 bg-white rounded-full'></div>
          </div>
        </div>
      </div>
      
      {/* Header section - fixed on desktop, normal flow on mobile */}
      <div className='overflow-visible text-white bg-green-600 z-30 shadow-md pb-3'>
        <div className='container mx-auto px-4 md:px-6 pt-2 pb-2'>
          {/* Navigation bar */}
          <div className='flex justify-between items-center mb-2'>
            <button 
              onClick={() => router.back()}
              className='p-2 rounded-full hover:bg-[#3E3D3D30] transition-colors'
            >
              <BackIcon />
            </button>
            <CurvedArrow />
          </div>
          
          {/* Teams and score section */}
          <div className='flex flex-col justify-center items-center gap-2'>
            <div className='flex w-full md:w-[90%] max-w-2xl pt-1 justify-between items-center'>
              {/* Home team */}
              <div className='flex flex-col items-center gap-1'>
                <img
                  src={seletedGame.homeImage}
                  alt="FC Barcelona"
                  width={100}
                  height={100}
                  className='w-[48px] md:w-[68px] lg:w-[84px] transition-transform hover:scale-105'
                />
                <p className='text-center text-[0.7rem] md:text-[0.8rem] lg:text-[0.9rem] font-sofiaSans font-medium'>FC Barcelona</p>
              </div>

              {/* Score or time */}
              {isLive ? (
                <div className='grid place-items-center'>
                  <div className='flex items-center gap-2 leading-10 font-dmSans font-bold'>
                    <p className='text-[2.5rem] md:text-[2.8rem] lg:text-[3.2rem]'>4</p>
                    <span className='text-[2.5rem] md:text-[2.8rem] lg:text-[3.2rem]'> - </span>
                    <p className='text-[2.5rem] md:text-[2.8rem] lg:text-[3.2rem]'>1</p>
                  </div>
                  <div className='font-dmSans text-[0.7rem] md:text-[0.8rem] bg-[#ffffff20] px-3 py-1 rounded-full'>45 : 04</div>
                </div>
              ) : (
                <div className='font-dmSans text-[1.1rem] lg:text-[1.2rem] bg-[#ffffff20] px-4 py-2 rounded-full'>20:00</div>
              )}

              {/* Away team */}
              <div className='flex flex-col items-center gap-1'>
                <img
                  src={seletedGame.awayImage}
                  alt="Real Madrid FC"
                  width={100}
                  height={100}
                  className='w-[48px] md:w-[68px] lg:w-[84px] transition-transform hover:scale-105'
                />
                <p className='text-center text-[0.7rem] md:text-[0.8rem] lg:text-[0.9rem] font-sofiaSans font-medium'>Real Madrid FC</p>
              </div>
            </div>

            {/* Match overview text */}
            <p className='font-sofiaSans font-bold text-[0.8rem] md:text-[0.9rem] mt-1 mb-0'>Match overview</p>
            
            {/* Progress indicator - make it more visible */}
            <div className="w-full flex justify-center items-center my-1">
              <div className="bg-[#ffffff50] h-1 w-16 rounded-full">
                <div className="bg-white h-1 w-6 rounded-full"></div>
              </div>
            </div>
            
            {/* Toggle button - make it more visible */}
            <button 
              onClick={handleToggle} 
              className='bg-[#ffffff40] w-[40px] h-[6px] border-2 border-[#ffffff40] rounded-full hover:bg-[#ffffff60] transition-colors mb-2'
            />
          </div>
        </div>
      </div>

      {/* Chat Container - Adjusts based on screen size */}
      <div className='flex-1 flex flex-col h-full'>
        {/* Message area - takes remaining height */}
        <div 
          ref={messageAreaRef}
          className='border bg-[#ECF5F5] flex-1 z-20 overflow-y-auto rounded-t-3xl message-area'
          style={{ height: 'calc(100vh - 200px)', marginTop: '0' }}
        >
          <div className='  px-3 py-1 bg-[#ECF5F5] pb-20' ref={boxRef}>
            <MessagePopup />
          </div>
          
          {/* Scroll to Bottom button - shows only when not at bottom */}
          <button
            onClick={handleScrollToBottom}
            className='fixed bottom-24 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-colors z-50'
            aria-label="Scroll to bottom"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
        
        {/* Message input - always at bottom */}
        <MessageInput 
          ref={inputRef} 
          onWagerClick={handleWagerClick}
        />
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
