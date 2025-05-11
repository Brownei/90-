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
import { Message, useMessageStore } from '@/stores/use-messages-store'
import pusherClient from '@/lib/pusher/init'
import { trpc } from '@/trpc/client'
import LoadingIcon from '@/public/icons/LoadingIcon'

// Add sample messages data if not already in the store


const sampleMessages: Message[] = [
  {
    id: 1,
    message: "What a game so far! That last play was incredible.",
    hubId: 101,
    userId: 1001,
    author: {
      id: 1001,
      name: "FootballFan22",
      profileImage: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    time: "17:30",
    replies: [
      {
        id: 11,
        commentId: 1,
        content: "Absolutely! The midfielder is on fire today!",
        author: {
          id: 1002,
          name: "SoccerLover",
          profileImage: "https://randomuser.me/api/portraits/women/22.jpg"
        }
      }
    ]
  },
  {
    id: 2,
    message: "The defense needs to tighten up in the second half. Too many opportunities for the opponent.",
    hubId: 101,
    userId: 1003,
    author: {
      id: 1003,
      name: "SportAnalyst",
      profileImage: "https://randomuser.me/api/portraits/women/45.jpg"
    },
    time: "17:35",
    replies: []
  },
  {
    id: 3,
    message: "I bet we'll see a substitution in the next 10 minutes. The striker looks tired.",
    hubId: 101,
    userId: 1004,
    author: {
      id: 1004,
      name: "GameChanger",
      profileImage: "https://randomuser.me/api/portraits/men/67.jpg"
    },
    time: "17:40",
    replies: [
      {
        id: 12,
        commentId: 3,
        content: "Good call! I think they should bring in the young forward.",
        author: {
          id: 1005,
          name: "CoachMike",
          profileImage: "https://randomuser.me/api/portraits/men/28.jpg"
        }
      },
      {
        id: 13,
        commentId: 3,
        content: "No way, they need to focus on defense first!",
        author: {
          id: 1006,
          name: "TacticalGenius",
          profileImage: "https://randomuser.me/api/portraits/women/36.jpg"
        }
      }
    ]
  }
];
;
;

type Params = {
  game: string
}

const ClientParticularGamePage = () => {
  const isLive = true
  const hubId = 1
  const router = useRouter()
  const { game } = useParams<Params>()
  // console.log({game})
  const {data: seletedGame, isLoading, error} = trpc.hubs.getAParticularHub.useQuery({name: game})
  // const [homeTeam, awayTeam] = reverseFormatString(game).split("Vs")
  // const seletedGame = games.find((g) => g.awayTeam === awayTeam?.trim() && g.homeTeam === homeTeam?.trim()) as Game
  const inputRef = React.useRef<HTMLDivElement>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const messageAreaRef = useRef<HTMLDivElement>(null);
  const [isSlidOut, setIsSlidOut] = React.useState(false);
  const { messages, addMessage } = useMessageStore();
  const [messageCount, setMessageCount] = useState(0);

  // console.log(seletedGame)
  // console.log(JSON.stringify(seletedGame, null, 2))

  // Add sample messages on first load if needed
  useEffect(() => {
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

  useEffect(() => {
    const channel = pusherClient.subscribe('comment-hub')
    
    channel.bind('new-message', (payload: Message) => {
      // console.log(payload)
      addMessage(payload)
    })

    return () => {
      pusherClient.unsubscribe('comment-hub')
    }
  }, [])

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


  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingIcon />
      </div>
    )
  } else if (error) {
    return (
      <div className='flex justify-center py-4'>
        <p>Big Errror Occured</p>
      </div>
    )
  } else {
    return (
    <main className=' overflow-hidden min-h-screen flex flex-col'>
      <div className='overflow-visible text-white z-30 shadow-md pb-3 bg-gradient-to-b from-gradientDarkGreen to-gradientLightGreen'>
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
          <div className='flex flex-col justify-center items-center'>
            <div className='flex w-full md:w-[90%] max-w-2xl pt-1 justify-between items-center'>
              {/* Home team */}
              <div className='flex flex-col items-center'>
                <img
                  src={seletedGame?.team?.home}
                  alt={seletedGame?.team?.home}
                  width={100}
                  height={100}
                  className='w-[40px] md:w-[50px] lg:w-[60px] transition-transform hover:scale-105'
                />
                <p className='text-center text-[0.65rem] md:text-[0.7rem] lg:text-[0.8rem] font-ABCDaitype font-medium mt-1'>{seletedGame?.team?.home}</p>
              </div>

              {/* Score or time */}
              <div className='grid place-items-center'>
                <div className='flex items-center gap-2 leading-8 font-ABCDaitype font-bold'>
                  <p className='text-[2rem] md:text-[2.2rem] lg:text-[2.5rem]'>{seletedGame?.team?.homeScore}</p>
                  <span className='text-[2rem] md:text-[2.2rem] lg:text-[2.5rem]'> - </span>
                  <p className='text-[2rem] md:text-[2.2rem] lg:text-[2.5rem]'>{seletedGame?.team?.awayScore}</p>
                </div>
                <div className='font-ABCDaitype text-[0.65rem] md:text-[0.7rem] bg-[#ffffff20] px-3 py-0.5 rounded-full'>45 : 04</div>
              </div>

              {/* Away team */}
              <div className='flex flex-col items-center'>
                <img
                  src={seletedGame?.team?.away}
                  alt={seletedGame?.team?.away}
                  width={100}
                  height={100}
                  className='w-[40px] md:w-[50px] lg:w-[60px] transition-transform hover:scale-105'
                />
                <p className='text-center text-[0.65rem] md:text-[0.7rem] lg:text-[0.8rem] font-ABCDaitype font-medium mt-1'>{seletedGame?.team?.away}</p>
              </div>
            </div>

            {/* Match overview section - using a green underline to make it stand out */}
            <div className="mt-3 mb-1">
              <p className='font-ABCDaitype font-medium text-[0.7rem] md:text-[0.8rem] inline-block relative p-2'>
                Match overview
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#3E3D3D] rounded-full"></span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container - Adjusts based on screen size */}
      <div className=''>
        {/* Message area - takes remaining height */}
        <div
          ref={messageAreaRef}
          className='border h-[calc(100vh-290px)] sm:h-[calc(100vh-340px)] bg-[#ECF5F5] flex-1 z-20 overflow-y-auto rounded-t-3xl message-area'
          style={{ marginTop: '0', border: 'none' }}
        >
          <div className='  px-3 py-1 bg-[#ECF5F5] pb-20' ref={boxRef}>
            <MessagePopup seletedGame={seletedGame}/>
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
          hubId={hubId}
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
        selectedGame={seletedGame}
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
}

export default ClientParticularGamePage
