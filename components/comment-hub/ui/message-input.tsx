import SendIcon from '@/public/icons/SendIcon'
import React from 'react'

const MessageInput = ({ ref }: { ref: React.RefObject<HTMLDivElement | null> }) => {
  return (
    <div ref={ref} className='fixed bottom-0 bg-[#ECF5F5] p-3 right-0 left-0 z-40'>
      <div className='flex justify-between items-center border border-[#D9D9D9] w-full rounded-lg py-1 px-3'>
        <input className='outline-none w-full p-1' />
        <button>
          <SendIcon />
        </button>
      </div>
    </div>
  )
}

export default MessageInput
