"use client"
import { defaultMessages } from '@/data'
import { useMessageStore } from '@/stores/use-messages-store'
import Image from 'next/image'
import React from 'react'
import { formatNumberInThousands } from '@/utils/utils'
import ReactionsIcon from '@/public/icons/ReactionsIcon'
import ShareIcon from '@/public/icons/ShareIcon'

const MessagePopup = () => {
  const { messages, addReaction, addActionNos, addReply } = useMessageStore()

  return (
    <main className='md:mt-[230px] grid gap-3'>
      {messages.map((message, i) => (
        <div key={message.id} className={`${i !== defaultMessages.length - 1 && 'border-b border-[#B7B7B7] '} py-4`}>
          <div className='flex gap-1 items-start'>
            <Image
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
                  <button className='flex items-center gap-[2px]'>
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

                {!message.isRef && (
                  <div className='border flex gap-2 items-center'>
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
    </main>
  )
}

export default MessagePopup
