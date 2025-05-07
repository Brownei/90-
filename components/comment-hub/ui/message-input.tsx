import SendIcon from "@/public/icons/SendIcon";
import React, { forwardRef, useState, useEffect } from "react";
import { useMessageStore } from "@/stores/use-messages-store";

interface MessageInputProps {
	ref: React.ForwardedRef<HTMLDivElement | null>;
	onWagerClick?: () => void;
}

const MessageInput = forwardRef<HTMLDivElement | null, MessageInputProps>(
	({ onWagerClick }, ref) => {
		const [message, setMessage] = useState("");
		const { addMessage, messages } = useMessageStore();
		const [showWager, setShowWager] = useState(false);

		const handleSendMessage = () => {
			if (!message.trim()) return;

			// Create a new message object
			const newMessage = {
				id: `msg-${Date.now()}`,
				avatarUrl: "https://placehold.co/36x36?text=J",
				username: "You",
				time: new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				content: message,
				isRef: false,
				reactions: [],
				actionNos: 0,
				replies: [],
			};

			// Add the message to the store
			addMessage(newMessage);

			// Clear the input
			setMessage("");
		};

		// Handle enter key press
		const handleKeyPress = (e: React.KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSendMessage();

				// Keep focus on input after sending
				const inputField = document.querySelector(
					".message-input"
				) as HTMLInputElement;
				if (inputField) {
					setTimeout(() => {
						inputField.focus();
					}, 10);
				}
			}
		};

		// Focus the input when component mounts
		useEffect(() => {
			const inputField = document.querySelector(
				".message-input"
			) as HTMLInputElement;
			if (inputField) {
				setTimeout(() => {
					inputField.focus();
				}, 300);
			}
		}, []);

		// Update useEffect to check for exact '/' character
		useEffect(() => {
			setShowWager(message === "/");
		}, [message]);

		return (
			<div
				ref={ref}
				className="fixed bottom-0 bg-[#ECF5F5] p-3 right-0 left-0 z-40 shadow-lg border-t border-gray-200 font-ABCDaitype"
			>
				<div className="flex flex-col gap-2 items-center max-w-2xl mx-auto">
					{showWager && (
						<button
							onClick={onWagerClick}
							className="bg-white rounded-xl py-2 px-6 flex items-center gap-1.5 w-full transition-colors flex-shrink-0 border border-[#DEDEDE] cursor-pointer"
						>
							🤝
							<div className="flex flex-col">
								<span className="text-black font-bold text-[16px] tracking-[0.2px] text-left">
									Wager
								</span>
								<span className="font-normal text-[#0000007D] text-[10px] tracking-[0.2px]">
									Peer to Peer bet
								</span>
							</div>
						</button>
					)}

					<div className="flex justify-between items-center w-full  py-2 px-3 focus-within:ring-1 focus-within:ring-blue-400 border-2 border-[#BEBEBE80] bg-[#D9D9D900] rounded-xl">
						<input
							className="outline-none w-full p-1  message-input text-xs font-normal placeholder:text-[#616061EE] tracking-[0.2px] text-black"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyDown={handleKeyPress}
							placeholder="Share your thoughts..."
						/>
						<button
							onClick={() => {
								handleSendMessage();

								// Focus back on input after clicking send button
								const inputField = document.querySelector(
									".message-input"
								) as HTMLInputElement;
								if (inputField) {
									setTimeout(() => {
										inputField.focus();
									}, 10);
								}
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
