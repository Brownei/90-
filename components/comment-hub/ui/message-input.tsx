import SendIcon from '@/public/icons/SendIcon'
import React, { forwardRef, useState, useEffect } from 'react'
import { useMessageStore } from '@/stores/use-messages-store'

interface MessageInputProps {
  ref: React.ForwardedRef<HTMLDivElement | null>;
  onWagerClick?: () => void;
}

const MessageInput = forwardRef<HTMLDivElement | null, MessageInputProps>(
  ({ onWagerClick }, ref) => {
    const [message, setMessage] = useState('');
    const { addMessage, messages } = useMessageStore();

    const handleSendMessage = () => {
      if (!message.trim()) return;
      
      // Create a new message object
      const newMessage = {
        id: `msg-${Date.now()}`,
        avatarUrl: 'https://via.placeholder.com/50?text=U',
        username: 'You',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        content: message,
        isRef: false,
        reactions: [],
        actionNos: 0,
        replies: []
      };
      
      // Add the message to the store
      addMessage(newMessage);
      
      // Clear the input
      setMessage('');
    };

    // Handle enter key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
        
        // Keep focus on input after sending
        const inputField = document.querySelector('.message-input') as HTMLInputElement;
        if (inputField) {
          setTimeout(() => {
            inputField.focus();
          }, 10);
        }
      }
    };

    // Focus the input when component mounts
    useEffect(() => {
      const inputField = document.querySelector('.message-input') as HTMLInputElement;
      if (inputField) {
        setTimeout(() => {
          inputField.focus();
        }, 300);
      }
    }, []);

    return (
      <div ref={ref} className='sticky bottom-0 bg-[#ECF5F5] p-3 right-0 left-0 z-40 shadow-lg border-t border-gray-200'>
        <div className='flex gap-2 items-center max-w-2xl mx-auto'>
          <button 
            onClick={onWagerClick}
            className='bg-yellow-400 hover:bg-yellow-500 rounded-full py-2 px-6 text-yellow-900 text-sm font-medium flex items-center gap-1 transition-colors flex-shrink-0'
          >
            <span className='text-lg'>⚽</span>
            <span>Wager</span>
          </button>

          <div className='flex justify-between items-center border border-[#D9D9D9] w-full rounded-lg py-1 px-3 focus-within:ring-1 focus-within:ring-blue-400'>
            <input 
              className='outline-none w-full p-1 bg-transparent message-input' 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
            />
            <button 
              onClick={() => {
                handleSendMessage();
                
                // Focus back on input after clicking send button
                const inputField = document.querySelector('.message-input') as HTMLInputElement;
                if (inputField) {
                  setTimeout(() => {
                    inputField.focus();
                  }, 10);
                }
              }}
              disabled={!message.trim()}
              className={`${!message.trim() ? 'text-gray-400' : 'text-blue-500 hover:text-blue-600'} flex-shrink-0`}
            >
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
