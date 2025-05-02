"use client"
import { defaultMessages } from '@/data'
import { useMessageStore } from '@/stores/use-messages-store'
import React, { useState } from 'react'
import { formatNumberInThousands } from '@/utils/utils'
import ReactionsIcon from '@/public/icons/ReactionsIcon'
import ShareIcon from '@/public/icons/ShareIcon'
import WagerModal from './WagerModal'
import FundWagerModal from './FundWagerModal'
import TransactionConfirmedModal from './TransactionConfirmedModal'
import { BettingClient } from '@/client/betting-client'
import { Wallet } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { useAuth } from '@/utils/useAuth'

const RefereeAction = () => {
  return (
    <div className="border-b border-[#B7B7B7] py-4">
      <div className="flex flex-col">
        <div className="text-gray-500 text-xs mb-2">REF</div>
        <div className="flex gap-2">
          <div className="rounded-full overflow-hidden w-12 h-12">
            <img 
              src="/images/ref-avatar.png" 
              alt="Referee"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/150?text=REF";
              }}
            />
          </div>
          <div className="flex-1">
            <div className="text-red-600 font-bold py-1">{"76'"} RED CARD! - Sergio Ramos</div>
            <div className="text-sm">Second yellow. PSG down to 10 men. Classic Ramos moment.</div>
            <div className="flex gap-2 mt-2">
              <div className="rounded-full bg-gray-200 px-3 py-1 flex items-center gap-1">
                <span>👏</span> <span className="text-sm">20</span>
              </div>
              <div className="rounded-full bg-gray-200 px-3 py-1 flex items-center gap-1">
                <span>😮</span> <span className="text-sm">20</span>
              </div>
              <div className="rounded-full bg-gray-200 px-3 py-1 flex items-center gap-1">
                <span>👎</span> <span className="text-sm">20</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessagePopup = () => {
  const { messages, addReaction, addActionNos, addReply } = useMessageStore()
  const { user, isAuthenticated } = useAuth()
  
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [isWagerModalOpen, setIsWagerModalOpen] = useState(false)
  const [isFundModalOpen, setIsFundModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [insufficientBalance, setInsufficientBalance] = useState(false)
  const [wagerCondition, setWagerCondition] = useState('')
  const [stakeAmount, setStakeAmount] = useState(0)

  const handleWagerClick = (message: any) => {
    setSelectedMessage(message)
    setIsWagerModalOpen(true)
  }

  const handleWagerProceed = (condition: string, stake: number) => {
    setWagerCondition(condition)
    setStakeAmount(stake)
    
    // For demo purposes, we're showing insufficient balance if stake > 5
    if (stake > 5) {
      setInsufficientBalance(true)
    } else {
      setIsWagerModalOpen(false)
      setIsFundModalOpen(true)
    }
  }

  const handleFundConfirm = async () => {
    try {
      // In a real implementation, we would use the BettingClient to submit the transaction
      // const wallet = new Wallet(/* user's keypair */);
      // const bettingClient = new BettingClient(wallet, 'devnet');
      // const tx = await bettingClient.placeBet(
      //   `${selectedMessage.id}`,
      //   stakeAmount,
      //   wagerCondition,
      //   new PublicKey('your-token-mint'),
      //   new PublicKey('your-bettor-token-account'),
      //   new PublicKey('your-escrow-token-account')
      // );
      
      // For demo, we just show confirmation
      setIsFundModalOpen(false)
      setIsConfirmationModalOpen(true)
      
      // Close confirmation after 3 seconds
      setTimeout(() => {
        setIsConfirmationModalOpen(false)
      }, 3000)
    } catch (error) {
      console.error('Error placing bet:', error)
    }
  }

  return (
    <main className='md:mt-[230px] grid gap-3'>
      {messages.slice(0, 1).map((message, i) => (
        <div key={message.id} className='border-b border-[#B7B7B7] py-4'>
          <div className='flex gap-1 items-start'>
            <img
              src={message.avatarUrl}
              alt={message.id}
              width={500}
              height={500}
              className='size-[50px] rounded-full'
            />

            <div className='grid gap-1 w-full font-sofiaSans'>
              <p className='flex gap-1 items-center'>
                <span className='text-[#616061] text-[0.6rem] md:text-[0.75rem]'>{message.username}</span>
                <span className='text-[0.5rem] lg:text-[0.5rem] text-[#808080]/55'>{message.time}</span>
              </p>
              <p className='flex gap-2 justify-between items-start'>
                <span className='lg:w-[700px] text-[1rem] tracking-[0.2px] w-full'>{message.content}</span>
                {!message.isRef && (
                  <button 
                    className='flex items-center gap-[2px]'
                    onClick={() => handleWagerClick(message)}
                  >
                    <span className='text-[0.9rem] lg:text-[0.9rem]'>⚽</span>
                    <span className='text-[#000]/50 text-[0.6rem] w-[15%] lg:text-[0.8rem]'> {formatNumberInThousands(message.actionNos)}</span>
                  </button>
                )}
              </p>

              <div className='lg:w-[700px] text-[1rem] tracking-[0.2px] w-[calc(100%_-_10%)] flex justify-between items-center'>
                {message.replies && !message.isRef ? (
                  <p className='text-[#000000] underline text-[0.7rem] lg:text-[0.75rem]'>View all replies</p>
                ) : (<p className='text-[#000000]/37 text-[0.7rem] lg:text-[0.75rem]'>
                  {!message.isRef && `Reply to ${message.username}`}
                </p>)}

                <div className='flex gap-2 items-center'>
                  {!message.isRef && (
                    <button 
                      className='bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium hover:bg-yellow-200'
                      onClick={() => handleWagerClick(message)}
                    >
                      Wager
                    </button>
                  )}

                  {!message.isRef && (
                    <div className='flex gap-2 items-center'>
                      <span className='text-[#000000]/43 text-[0.6rem] md:text-[0.7rem] lg:text-[0.8rem]'> +{message.reactions?.length}</span>
                      <button>
                        <ReactionsIcon />
                      </button>
                    </div>
                  )}

                  {!message.isRef && (
                    <button>
                      <ShareIcon />
                    </button>
                  )}
                </div>

                {message.isRef && (
                  <div className='flex gap-2 items-center'>
                    <button className='px-2 py-[1px] border border-[#000]/50 rounded-full'>
                      😂
                      <span>{message.reactionsToRef?.laughing}</span>
                    </button>
                    <button className='px-2 py-[1px] border border-[#000]/50 rounded-full'>
                      👏
                      <span>{message.reactionsToRef?.clapping}</span>
                    </button>
                    <button className='px-2 py-[1px] border border-[#000]/50 rounded-full'>
                      👎
                      <span>{message.reactionsToRef?.['thumbs-down']}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Referee Action */}
      <RefereeAction />

      {messages.slice(1).map((message, i) => (
        <div key={message.id} className={`${i !== messages.length - 2 && 'border-b border-[#B7B7B7] '} py-4`}>
          <div className='flex gap-1 items-start'>
            <img
              src={message.avatarUrl}
              alt={message.id}
              width={500}
              height={500}
              className='size-[50px] rounded-full'
            />

            <div className='grid gap-1 w-full font-sofiaSans'>
              <p className='flex gap-1 items-center'>
                <span className='text-[#616061] text-[0.6rem]  md:text-[0.75rem]'>{message.username}</span>
                <span className='text-[0.5rem] lg:text-[0.5rem] text-[#808080]/55'>{message.time}</span>
              </p>
              <p className='flex gap-2 justify-between items-start'>
                <span className='lg:w-[700px] text-[1rem] tracking-[0.2px] w-full'>{message.content}</span>
                {!message.isRef && (
                  <button 
                    className='flex items-center gap-[2px]'
                    onClick={() => handleWagerClick(message)}
                  >
                    <span className='text-[0.9rem] lg:text-[0.9rem]'>⚽</span>
                    <span className='text-[#000]/50 text-[0.6rem] w-[15%] lg:text-[0.8rem]'> {formatNumberInThousands(message.actionNos)}</span>
                  </button>
                )}
              </p>

              <div className='lg:w-[700px] text-[1rem] tracking-[0.2px] w-[calc(100%_-_10%)] flex justify-between items-center'>
                {message.replies && !message.isRef ? (
                  <p className='text-[#000000] underline text-[0.7rem] lg:text-[0.75rem]'>View all replies</p>
                ) : (<p className='text-[#000000]/37 text-[0.7rem] lg:text-[0.75rem]'>
                  {!message.isRef && `Reply to ${message.username}`}
                </p>)}

                <div className='flex gap-2 items-center'>
                  {!message.isRef && (
                    <button 
                      className='bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium hover:bg-yellow-200'
                      onClick={() => handleWagerClick(message)}
                    >
                      Wager
                    </button>
                  )}

                  {!message.isRef && (
                    <div className='flex gap-2 items-center'>
                      <span className='text-[#000000]/43 text-[0.6rem] md:text-[0.7rem] lg:text-[0.8rem]'> +{message.reactions?.length}</span>
                      <button>
                        <ReactionsIcon />
                      </button>
                    </div>
                  )}

                  {!message.isRef && (
                    <button>
                      <ShareIcon />
                    </button>
                  )}
                </div>

                {message.isRef && (
                  <div className='flex gap-2 items-center'>
                    <button className='px-2 py-[1px] border border-[#000]/50 rounded-full'>
                      😂
                      <span>{message.reactionsToRef?.laughing}</span>
                    </button>
                    <button className='px-2 py-[1px] border border-[#000]/50 rounded-full'>
                      👏
                      <span>{message.reactionsToRef?.clapping}</span>
                    </button>
                    <button className='px-2 py-[1px] border border-[#000]/50 rounded-full'>
                      👎
                      <span>{message.reactionsToRef?.['thumbs-down']}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Wager Modal */}
      <WagerModal 
        isOpen={isWagerModalOpen} 
        onClose={() => {
          setIsWagerModalOpen(false)
          setInsufficientBalance(false)
        }}
        onProceed={handleWagerProceed}
        username={selectedMessage?.username || ''}
        insufficientBalance={insufficientBalance}
      />

      {/* Fund Wager Modal */}
      <FundWagerModal 
        isOpen={isFundModalOpen} 
        onClose={() => setIsFundModalOpen(false)} 
        onConfirm={handleFundConfirm}
        amount={stakeAmount}
      />

      {/* Transaction Confirmed Modal */}
      <TransactionConfirmedModal 
        isOpen={isConfirmationModalOpen} 
        onClose={() => setIsConfirmationModalOpen(false)} 
      />
    </main>
  )
}

export default MessagePopup
