"use client"
import { defaultMessages } from '@/data'
import { useMessageStore, Reply } from '@/stores/use-messages-store'
import React, { useState, useEffect } from 'react'
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
import toast from 'react-hot-toast'
import { trpc } from '@/trpc/client'

const RefereeAction = () => {
  return (
    <div className="border-b border-[#B7B7B7] py-4 font-ABCDaitype">
      <div className="flex flex-col">
        <div className="text-gray-500 text-xs mb-2">REFEREE</div>
        <div className="flex gap-2">
          <div className="rounded-full overflow-hidden w-6 h-6 flex items-center justify-center bg-gray-200 text-xs font-bold">
            ⚽
          </div>
          <div className="flex-1">
            <div className="text-gray-800 font-medium py-1">
              <span className="mr-2">{"28'"}</span>
              <span className="font-bold">GOAL!</span> - Pedri
            </div>
            <div className="text-sm">Bullet Shot from Outside the box to give Barcelona the Lead in the CDR Final. Assisted by Lamal</div>
            <div className="flex gap-2 mt-2">
              <div className="rounded-full bg-gray-200 px-3 py-1 flex items-center gap-1">
                <span>😂</span> <span className="text-sm">20</span>
              </div>
              <div className="rounded-full bg-gray-200 px-3 py-1 flex items-center gap-1">
                <span>👏</span> <span className="text-sm">20</span>
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

// Define custom message type
interface CustomMessage {
  id: string;
  avatarUrl: string;
  username: string;
  time: string;
  content: string;
  isRef: boolean;
  reactions: string[];
  actionNos: number;
  replies: Reply[];
}

// Add custom soccer comment component to match the image
const JosiahComment = ({ id = "josiah-1", onShowReplies, replies = [] }: {
  id?: string,
  onShowReplies?: (id: string) => void,
  replies?: Reply[]
}) => {
  return (
    <div className="border-b border-[#B7B7B7] py-4">
      <div className="flex gap-2 items-start">
        <div className="size-[50px] rounded-full bg-yellow-200 flex items-center justify-center font-bold text-xl">
          🔥
        </div>
        <div className="grid gap-1 w-full font-ABCDaitype">
          <p className="flex gap-1 items-center">
            <span className="text-[#616061] text-[0.75rem] font-medium">Josiah🔥</span>
            <span className="text-[0.5rem] text-[#808080]/55">9:16 AM</span>
          </p>
          <p className="flex gap-2 justify-between items-start">
            <span className="text-[1rem] tracking-[0.2px] w-full">
              Real Madrid playing with 13 men again — 11 on the pitch, 2 in VAR. {"Nothing's"} changed
            </span>
            <span className="text-[#000]/50 text-[0.6rem]">1%</span>
          </p>
          <div className="text-[1rem] tracking-[0.2px] w-full flex justify-between items-center">
            <button
              className="text-[#000000] underline text-[0.7rem] hover:text-blue-600"
              onClick={() => onShowReplies && onShowReplies(id)}
            >
              {replies.length > 0 ? `View ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}` : 'Reply'}
            </button>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-1">
                <span>😂🔥👏</span>
                <span className="text-[#000000]/43 text-[0.7rem]">+25</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StrikeComment = () => {
  return (
    <div className="border-b border-[#B7B7B7] py-4">
      <div className="flex gap-2 items-start">
        <div className="size-[50px] rounded-full bg-yellow-200 flex items-center justify-center font-bold text-xl">
          🔥
        </div>
        <div className="grid gap-1 w-full font-ABCDaitype">
          <p className="flex gap-1 items-center">
            <span className="text-[#616061] text-[0.75rem] font-medium">Josiah🔥</span>
            <span className="text-[0.5rem] text-[#808080]/55">9:16 AM</span>
          </p>
          <p className="flex gap-2 justify-between items-start">
            <span className="text-[1rem] tracking-[0.2px] w-full font-bold">
              WHAT A STRIKEEE! {"That's"} world-class 🔥🔥
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Component to display replies to a message
const Replies = ({ replies, messageUsername }: { replies: Reply[], messageUsername: string }) => {
  if (!replies || replies.length === 0) return null;

  return (
    <div className="ml-12 mt-3 border-l-2 border-gray-200 pl-4">
      {replies.map((reply) => (
        <div key={reply.id} className="mb-3">
          <div className="flex gap-2 items-start">
            <img
              src={reply.author.profileImage}
              alt={reply.author.name}
              width={36}
              height={36}
              className="size-[36px] rounded-full"
            />
            <div className="grid gap-1 w-full font-ABCDaitype">
              <p className="flex gap-1 items-center">
                <span className="text-[#616061] text-[0.6rem] md:text-[0.7rem] font-medium">{reply.author.name}</span>
                <span className="text-[0.5rem] text-[#808080]/55">{reply.author.name}</span>
              </p>
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-[0.9rem] tracking-[0.2px]">{reply.content}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const MessagePopup = ({seletedGame}: {seletedGame: any}) => {
  const { messages, addReply } = useMessageStore()
  const {data: allMessages, isLoading, error} = trpc.messages.getAllMessages.useQuery({hubName: seletedGame.hub.name})
  const { user, isAuthenticated } = useAuth()
  // const {} =
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [isWagerModalOpen, setIsWagerModalOpen] = useState(false)
  const [isFundModalOpen, setIsFundModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [insufficientBalance, setInsufficientBalance] = useState(false)
  const [wagerCondition, setWagerCondition] = useState('')
  const [stakeAmount, setStakeAmount] = useState(0)
  const [replyText, setReplyText] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [showAllReplies, setShowAllReplies] = useState<Record<string, boolean>>({})

  console.log({allMessages, seletedGame})

  // Custom message state for Josiah comments with proper typing
  const [customMessages, setCustomMessages] = useState<Record<string, CustomMessage>>({
    "josiah-1": {
      id: "josiah-1",
      avatarUrl: "https://via.placeholder.com/50?text=J",
      username: "Josiah🔥",
      time: "9:16 AM",
      content: "Real Madrid playing with 13 men again — 11 on the pitch, 2 in VAR. Nothing's changed",
      isRef: false,
      reactions: ["😂", "🔥", "👏"],
      actionNos: 25,
      replies: []
    },
    "josiah-2": {
      id: "josiah-2",
      avatarUrl: "https://via.placeholder.com/50?text=J",
      username: "Josiah🔥",
      time: "9:16 AM",
      content: "Real Madrid playing with 13 men again — 11 on the pitch, 2 in VAR. Nothing's changed",
      isRef: false,
      reactions: ["😂", "🔥", "👏"],
      actionNos: 25,
      replies: []
    },
    "josiah-3": {
      id: "josiah-3",
      avatarUrl: "https://via.placeholder.com/50?text=J",
      username: "Josiah🔥",
      time: "9:16 AM",
      content: "WHAT A STRIKEEE! That's world-class 🔥🔥",
      isRef: false,
      reactions: ["😂", "🔥", "👏"],
      actionNos: 15,
      replies: []
    }
  });

  // Add some initial replies for demonstration purposes only on first render
  const handleJosiahReplyToggle = (id: number) => {
    setShowAllReplies(prev => ({
      ...prev,
      [id]: !prev[id]
    }));

    // If there's no replying state for this message yet, also set it to replying
    if (replyingTo !== id) {
      setReplyingTo(id);
    }
  };

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

  const handleShowReplies = (messageId: number) => {
    setShowAllReplies(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  }

  const handleReplyClick = (messageId: number) => {
    setReplyingTo(messageId);
  }

  // const handleSubmitReply = (messageId: string) => {
  //   if (!replyText.trim()) return;
  //
  //   // Check if it's a standard message or custom Josiah message
  //   if (messageId.startsWith("josiah-")) {
  //     const reply: Reply = {
  //       id: 1,
  //       author: {
  //         id: 1,
  //         name: user?.name as string,
  //         profileImage: user?.image || "https://via.placeholder.com/50?text=U",
  //       }
  //       content: replyText
  //     };
  //
  //     // Update the custom messages state
  //     setCustomMessages(prev => ({
  //       ...prev,
  //       [messageId]: {
  //         ...prev[messageId],
  //         replies: [...prev[messageId].replies, reply]
  //       }
  //     }));
  //
  //     // Show success notification
  //     toast.success("Reply added successfully!");
  //   } else {
  //     // For regular messages in the message store
  //     const reply: Reply = {
  //       id: `reply-${Date.now()}`,
  //       avatarUrl: user?.image || "https://via.placeholder.com/50?text=U",
  //       username: user?.username || "You",
  //       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //       content: replyText
  //     };
  //
  //     addReply(messageId, reply);
  //     toast.success("Reply added successfully!");
  //   }
  //
  //   // Clear the reply text but keep the reply input open
  //   setReplyText('');
  //
  //   // Make sure the replies section is expanded
  //   setShowAllReplies(prev => ({
  //     ...prev,
  //     [messageId]: true
  //   }));
  // }

  // Enhanced messages for demo
  const enhancedMessages = [
    ...messages
  ];

  return (
    <section className='overflow-auto h-full pt-2'>
      {/* Add the custom comments to match the image */}
      <JosiahComment
        id="josiah-1"
        // onShowReplies={handleJosiahReplyToggle}
        replies={customMessages["josiah-1"].replies}
      />

      {/* Show replies for Josiah comment if expanded */}
      {showAllReplies["josiah-1"] && (
        <div className="ml-12 mt-3 border-l-2 border-gray-200 pl-4">
          {customMessages["josiah-1"].replies.map((reply) => (
            <div key={reply.id} className="mb-3">
              <div className="flex gap-2 items-start">
                <img
                  src={reply.author.profileImage}
                  alt={reply.author.name}
                  width={36}
                  height={36}
                  className="size-[36px] rounded-full"
                />
                <div className="grid gap-1 w-full font-ABCDaitype">
                  <p className="flex gap-1 items-center">
                    <span className="text-[#616061] text-[0.6rem] md:text-[0.7rem] font-medium">{reply.author.name}</span>
                    <span className="text-[0.5rem] text-[#808080]/55">{reply.author.name}</span>
                  </p>
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-[0.9rem] tracking-[0.2px]">{reply.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Reply button at the bottom of replies */}
          {/* {replyingTo !== "josiah-1" && ( */}
          {/*   <div className="mt-2 mb-3"> */}
          {/*     <button */}
          {/*       onClick={() => setReplyingTo("josiah-1")} */}
          {/*       className="text-blue-600 text-sm hover:text-blue-800" */}
          {/*     > */}
          {/*       Add a reply... */}
          {/*     </button> */}
          {/*   </div> */}
          {/* )} */}

          {/* Reply input for Josiah comment */}
          {/* {replyingTo === "josiah-1" && ( */}
          {/*   <div className="flex gap-2 items-center"> */}
          {/*     <input */}
          {/*       type="text" */}
          {/*       value={replyText} */}
          {/*       onChange={(e) => setReplyText(e.target.value)} */}
          {/*       placeholder="Reply to Josiah..." */}
          {/*       className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" */}
          {/*       autoFocus */}
          {/*     /> */}
          {/*     <div className="flex gap-2"> */}
          {/*       <button */}
          {/*         onClick={() => setReplyingTo(null)} */}
          {/*         className="text-gray-500 text-sm hover:text-gray-700" */}
          {/*       > */}
          {/*         Cancel */}
          {/*       </button> */}
          {/*       <button */}
          {/*         // onClick={() => handleSubmitReply("josiah-1")} */}
          {/*         className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600" */}
          {/*         disabled={!replyText.trim()} */}
          {/*       > */}
          {/*         Send */}
          {/*       </button> */}
          {/*     </div> */}
          {/*   </div> */}
          {/* )} */}
        </div>
      )}

      <JosiahComment
        id="josiah-2"
        // onShowReplies={handleJosiahReplyToggle}
        replies={customMessages["josiah-2"].replies}
      />

      {/* Show replies for second Josiah comment if expanded */}
      {showAllReplies["josiah-2"] && (
        <div className="ml-12 mt-3 border-l-2 border-gray-200 pl-4">
          {customMessages["josiah-2"].replies.map((reply) => (
            <div key={reply.id} className="mb-3">
              <div className="flex gap-2 items-start">
                <img
                  src={reply.author.profileImage}
                  alt={reply.author.name}
                  width={36}
                  height={36}
                  className="size-[36px] rounded-full"
                />
                <div className="grid gap-1 w-full font-ABCDaitype">
                  <p className="flex gap-1 items-center">
                    <span className="text-[#616061] text-[0.6rem] md:text-[0.7rem] font-medium">{reply.author.name}</span>
                    <span className="text-[0.5rem] text-[#808080]/55">{reply.author.name}</span>
                  </p>
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-[0.9rem] tracking-[0.2px]">{reply.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Reply button at the bottom of replies */}
          {/* {replyingTo !== "josiah-2" && ( */}
          {/*   <div className="mt-2 mb-3"> */}
          {/*     <button */}
          {/*       onClick={() => setReplyingTo("josiah-2")} */}
          {/*       className="text-blue-600 text-sm hover:text-blue-800" */}
          {/*     > */}
          {/*       Add a reply... */}
          {/*     </button> */}
          {/*   </div> */}
          {/* )} */}

          {/* Reply input for second Josiah comment */}
          {/* {replyingTo === "josiah-2" && ( */}
          {/*   <div className="flex gap-2 items-center"> */}
          {/*     <input */}
          {/*       type="text" */}
          {/*       value={replyText} */}
          {/*       onChange={(e) => setReplyText(e.target.value)} */}
          {/*       placeholder="Reply to Josiah..." */}
          {/*       className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" */}
          {/*       autoFocus */}
          {/*     /> */}
          {/*     <div className="flex gap-2"> */}
          {/*       <button */}
          {/*         onClick={() => setReplyingTo(null)} */}
          {/*         className="text-gray-500 text-sm hover:text-gray-700" */}
          {/*       > */}
          {/*         Cancel */}
          {/*       </button> */}
          {/*       <button */}
          {/*         // onClick={() => handleSubmitReply("josiah-2")} */}
          {/*         className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600" */}
          {/*         disabled={!replyText.trim()} */}
          {/*       > */}
          {/*         Send */}
          {/*       </button> */}
          {/*     </div> */}
          {/*   </div> */}
          {/* )} */}
        </div>
      )}

      <RefereeAction />
      <StrikeComment />

      {/* Original messages */}
      {enhancedMessages.map((message, i) => (
        <div key={message.id} className={`${i !== enhancedMessages.length - 1 && 'border-b border-[#B7B7B7] '} py-4`}>
          <div className='flex gap-2 items-start'>
            <img
              src={message.author?.profileImage}
              alt={message.author?.name}
              width={500}
              height={500}
              className='size-[50px] rounded-full'
            />

            <div className='grid gap-1 w-full font-ABCDaitype'>
              <p className='flex gap-1 items-center'>
                <span className='text-[#616061] text-[0.6rem] md:text-[0.75rem] font-medium'>{message.author?.name}</span>
                <span className='text-[0.5rem] lg:text-[0.5rem] text-[#808080]/55'>{message.time}</span>
              </p>
              <p className='flex gap-2 justify-between items-start'>
                <span className='lg:w-[700px] text-[1rem] tracking-[0.2px] w-full'>{message.message}</span>
                {/* {!message.isRef && ( */}
                {/*   <button */}
                {/*     className='flex items-center gap-[2px]' */}
                {/*     onClick={() => handleWagerClick(message)} */}
                {/*   > */}
                {/*     <span className='text-[0.9rem] lg:text-[0.9rem]'>⚽</span> */}
                {/*     <span className='text-[#000]/50 text-[0.6rem] w-[15%] lg:text-[0.8rem]'> {formatNumberInThousands(message.actionNos)}</span> */}
                {/*   </button> */}
                {/* )} */}
              </p>

              <div className='lg:w-[700px] text-[1rem] tracking-[0.2px] w-[calc(100%_-_10%)] flex justify-between items-center'>
                {message.replies && message.replies.length > 0 ? (
                  <button
                    onClick={() => handleShowReplies(message.id!)}
                    className='text-[#000000] underline text-[0.7rem] lg:text-[0.75rem] hover:text-blue-600'
                  >
                    {showAllReplies[message.id!] ? 'Hide replies' : `View ${message.replies.length} ${message.replies.length === 1 ? 'reply' : 'replies'}`}
                  </button>
                ) : (
                  <button
                    className='text-[#000000]/60 text-[0.7rem] lg:text-[0.75rem] hover:text-black'
                  >
                    {`Reply to ${message.author?.name}`}
                  </button>
                )}

                <div className='flex gap-2 items-center'>
                  {/* {!message.isRef && ( */}
                  {/*   <button */}
                  {/*     className='bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium hover:bg-yellow-200' */}
                  {/*     onClick={() => handleWagerClick(message)} */}
                  {/*   > */}
                  {/*     Wager */}
                  {/*   </button> */}
                  {/* )} */}

                </div>

              </div>

              {/* Show all replies when expanded */}
              {/* {showAllReplies[message.id] && message.replies && ( */}
              {/*   <div className="ml-12 mt-3 border-l-2 border-gray-200 pl-4"> */}
              {/*     <Replies replies={message.replies} messageUsername={message.username} /> */}
              {/**/}
              {/*     {replyingTo !== message.id && ( */}
              {/*       <div className="mt-2 mb-3"> */}
              {/*         <button */}
              {/*           onClick={() => setReplyingTo(message.id)} */}
              {/*           className="text-blue-600 text-sm hover:text-blue-800" */}
              {/*         > */}
              {/*           Add a reply... */}
              {/*         </button> */}
              {/*       </div> */}
              {/*     )} */}
              {/*   </div> */}
              {/* )} */}

              {/* Reply input when replying to this message */}
              {replyingTo === message.id && (
                <div className="mt-2 ml-6 flex gap-2 items-center">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${message.author?.name}...`}
                    className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-gray-500 text-sm hover:text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
                      disabled={!replyText.trim()}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Wager Modals */}
      <WagerModal
        isOpen={isWagerModalOpen}
        onClose={() => {
          setIsWagerModalOpen(false)
          setInsufficientBalance(false)
        }}
        selectedGame={seletedGame}
        onProceed={handleWagerProceed}
        username={selectedMessage?.username || "User"}
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
    </section>
  )
}

export default MessagePopup
