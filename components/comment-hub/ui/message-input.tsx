import SendIcon from "@/public/icons/SendIcon";
import React, { forwardRef, useState, useEffect } from "react";
import { Message, useMessageStore } from "@/stores/use-messages-store";
import { useAuthLogin } from "@/hooks/use-auth-login";
import { trpc } from "@/trpc/client";

interface MessageInputProps {
  ref: React.ForwardedRef<HTMLDivElement | null>;
  hubId: number;
  onWagerClick?: () => void;
}

const MessageInput = forwardRef<HTMLDivElement | null, MessageInputProps>(
  ({ onWagerClick, hubId }, ref) => {
    const { user } = useAuthLogin();
    const [message, setMessage] = useState("");
    const { addMessage, messages } = useMessageStore();
    const messagesMutation = trpc.messages.sendMessages.useMutation();

    const handleSendMessage = async () => {
      if (!message.trim()) return;

      const newMessage: Message = {
        message: message.trim(),
        hubId,
        replies: [],
        userId: Number(user?.id),
        author: {
          id: Number(user?.id),
          name: user?.name || "user",
          profileImage:
            user?.profileImage ||
            "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
        },
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      console.log("Sending message:", newMessage);

      // Clear the input
      setMessage("");

      messagesMutation.mutateAsync({
        hubId,
        content: newMessage.message,
        userId: Number(user?.id),
      });

    };

    // Handle enter key press
    const handleKeyPress = async (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();

        // Keep focus on input after sending
        // const inputField = document.querySelector(
        //   ".message-input"
        // ) as HTMLInputElement;
        // if (inputField) {
        //   setTimeout(() => {
        //     inputField.focus();
        //   }, 10);
        // }
      }
    };

    // Focus the input when component mounts
    // useEffect(() => {
    //   const inputField = document.querySelector('.message-input') as HTMLInputElement;
    //   if (inputField) {
    //     setTimeout(() => {
    //       inputField.focus();
    //     }, 300);
    //   }
    // }, []);

    return (
      <div
        ref={ref}
        className="fixed bottom-0 bg-[#ECF5F5] p-3 right-0 left-0 z-40 shadow-lg border-t border-gray-200"
      >
        <div className="flex gap-2 items-center max-w-2xl mx-auto">
          <button
            onClick={onWagerClick}
            className="bg-yellow-400 hover:bg-yellow-500 rounded-full py-2 px-6 text-yellow-900 text-sm font-medium flex items-center gap-1 transition-colors flex-shrink-0"
          >
            <span className="text-lg">⚽</span>
            <span>Wager</span>
          </button>

          <div className="flex justify-between items-center border border-[#D9D9D9] w-full rounded-lg py-1 px-3 focus-within:ring-1 focus-within:ring-blue-400">
            <input
              className="outline-none w-full p-1 bg-transparent message-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={async (e) => await handleKeyPress(e)}
              placeholder="Type a message..."
            />
            <button
              onClick={() => {
                handleSendMessage();

                // Focus back on input after clicking send button
                // const inputField = document.querySelector('.message-input') as HTMLInputElement;
                // if (inputField) {
                //   setTimeout(() => {
                //     inputField.focus();
                //   }, 10);
                // }
              }}
              disabled={!message.trim()}
              className={`${
                !message.trim()
                  ? "text-gray-400"
                  : "text-blue-500 hover:text-blue-600"
              } flex-shrink-0`}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

MessageInput.displayName = "MessageInput";

export default MessageInput;
