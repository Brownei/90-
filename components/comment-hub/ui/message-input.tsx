import SendIcon from '@/public/icons/SendIcon'
import React, { forwardRef, useState } from 'react'

interface MessageInputProps {
  ref: React.ForwardedRef<HTMLDivElement | null>;
  onWagerClick?: () => void;
}

const MessageInput = forwardRef<HTMLDivElement | null, MessageInputProps>(
  ({ onWagerClick }, ref) => {
    const [message, setMessage] = useState('');

    return (
      <div ref={ref} className='fixed bottom-0 bg-[#ECF5F5] p-3 right-0 left-0 z-40'>
        <div className='flex gap-2 items-center'>
          <button 
            onClick={onWagerClick}
            className='bg-yellow-400 hover:bg-yellow-500 rounded-full py-2 px-6 text-yellow-900 text-sm font-medium flex items-center gap-1 transition-colors'
          >
            <span className='text-lg'>⚽</span>
            <span>Wager</span>
          </button>

          <div className='flex justify-between items-center border border-[#D9D9D9] w-full rounded-lg py-1 px-3'>
            <input 
              className='outline-none w-full p-1' 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button>
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

MessageInput.displayName = 'MessageInput';

export default MessageInput
