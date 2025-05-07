"use client";
import { defaultMessages } from "@/data";
import { useMessageStore, Reply } from "@/stores/use-messages-store";
import React, { useState, useEffect } from "react";
import { formatNumberInThousands } from "@/utils/utils";
import ReactionsIcon from "@/public/icons/ReactionsIcon";
import ShareIcon from "@/public/icons/ShareIcon";
import WagerModal from "./WagerModal";
import FundWagerModal from "./FundWagerModal";
import TransactionConfirmedModal from "./TransactionConfirmedModal";
import { BettingClient } from "@/client/betting-client";
import { Wallet } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { useAuth } from "@/utils/useAuth";
import toast from "react-hot-toast";
import Image from "next/image";

const RefereeAction = () => {
	return (
		<div className="border-b border-[#B7B7B7] py-8">
			<div className="flex gap-2">
				<img
					src="https://media.tenor.com/XPbK0iLSsIgAAAAm/touchdown-referee.webp"
					width={36}
					height={36}
					className="size-9 rounded-full"
				/>
				<div className="flex-1">
					{/*  TODO: */}
					<p className="uppercase font-medium text-black text-xs mb-1 tracking-[0.2px]">
						Referee{" "}
						<span className="font-normal text-xs text-[#8080808C]">
							* 28’
						</span>
					</p>

					<p className="text-black text-sm tracking-[0.2px] font-normal">
						<span className="block">⚽{" 28'"} GOAL - Pedri</span>
						Bullet Shot from Outside the box to give Barcelona the
						Lead in the CDR Final. Assisted by Lamal
					</p>
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
const JosiahComment = ({
	id = "josiah-1",
	onShowReplies,
	replies = [],
	children,
}: {
	id?: string;
	onShowReplies?: (id: string) => void;
	replies?: Reply[];
	children: React.ReactNode;
}) => {
	return (
		<div className="border-b border-[#B7B7B7] py-8">
			<div className="flex gap-2 items-start">
				<div className="size-[50px] rounded-full bg-yellow-200 flex items-center justify-center font-bold text-xl">
					🔥
				</div>
				<div className="grid gap-1 w-full">
					<p className="flex gap-1 items-center">
						<span className="text-[#616061] text-sm font-normal">
							Josiah🔥
						</span>
						<span className="text-[10px] text-[##8080808C]">
							9:16 AM
						</span>
					</p>
					<p className="flex gap-2 justify-between items-start">
						<span className="text-sm text-black tracking-[0.2px] w-full">
							Real Madrid playing with 13 men again — 11 on the
							pitch, 2 in VAR. {"Nothing's"} changed
						</span>
					</p>
					<div className="w-full flex items-center gap-[13px]">
						<button
							className="text-black border-b border-b-black pb-0.5 text-xs  tracking-[0.2px]  hover:text-blue-600"
							onClick={() => onShowReplies && onShowReplies(id)}
						>
							{replies.length > 0
								? `View ${replies.length} ${
										replies.length === 1
											? "reply"
											: "replies"
								  }`
								: "Reply"}
						</button>
						{/* backdrop-filter: blur(4px) */}
						{/* background: linear-gradient(135.01deg, #0A6B41 29.81%,
						#0E9158 60.46%, #14D17F 87.49%); */}
						{replies.length > 0 && <ShareIcon />}
					</div>
				</div>
			</div>
			{children}
		</div>
	);
};

const StrikeComment = () => {
	return (
		<div className="border-b border-[#B7B7B7] py-8">
			<div className="flex gap-2 items-start">
				<div className="size-[50px] rounded-full bg-yellow-200 flex items-center justify-center font-bold text-xl">
					🔥
				</div>
				<div className="grid gap-1 w-full font-ABCDaitype">
					<p className="flex gap-1 items-center">
						<span className="text-[#616061] text-sm tracking-[0.2px]">
							Joahah🏋️‍♂️
						</span>
						<span className="text-xs text-[#8080808C]">
							* 9:16 AM
						</span>
					</p>
					<p className="text-xs tracking-[0.2px] w-full">
						WHAT A STRIKEEE! {"That's"} world-class 🔥🔥
					</p>
				</div>
			</div>
		</div>
	);
};

const BookedWager = () => {
	return (
		<div className="py-8 border-b border-b-[#B7B7B7]">
			<div className="bg-white border border-[#E3E0E0] p-5 py-3.5 flex gap-4 justify-between rounded-xl">
				<div className="space-y-5">
					<img
						src={"https://placehold.co/36x36?text=J"}
						alt=""
						width={36}
						height={36}
						className="size-9 rounded-full"
					/>

					<button className="bg-[#0A6B41] text-white px-3 py-2 rounded-xl font-bold text-sm tracking-[0.2px]">
						Join Bet
					</button>
				</div>

				<div>
					<div className="flex items-center justify-between mb-1.5">
						<h3 className="text-black font-bold text-sm uppercase">
							Wager booked
						</h3>
						<p className="text-xs text-[#8080808C]">9.16 AM</p>
					</div>

					<div className="text-black">
						<p className="font-bold text-sm tracking-[0.2px]">Condition</p>
						<span className="text-[#000000BF] font-normal text-sm block">
							"Barcelona to score 3 goals first half"
						</span>
						<p className="font-bold text-sm">Stake</p>
						<span className="text-[#000000BF] font-normal text-sm block">
							$10
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

// Component to display replies to a message
const Replies = ({
	replies,
	messageUsername,
}: {
	replies: Reply[];
	messageUsername: string;
}) => {
	if (!replies || replies.length === 0) return null;

	return (
		<div className="ml-12 mt-3 border-l-2 border-gray-200 pl-4">
			{replies.map((reply) => (
				<div
					key={reply.id}
					className="mb-3"
				>
					<div className="flex gap-2 items-start">
						<img
							src={reply.avatarUrl}
							alt={reply.username}
							width={36}
							height={36}
							className="size-[36px] rounded-full"
						/>
						<div className="grid gap-1 w-full font-ABCDaitype">
							<p className="flex gap-1 items-center">
								<span className="text-[#616061] text-[0.6rem] md:text-[0.7rem] font-medium">
									{reply.username}
								</span>
								<span className="text-[0.5rem] text-[#808080]/55">
									{reply.time}
								</span>
							</p>
							<div className="bg-gray-50 rounded-lg px-3 py-2">
								<p className="text-[0.9rem] tracking-[0.2px]">
									{reply.content}
								</p>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

const MessagePopup = () => {
	const { messages, addReaction, addActionNos, addReply } = useMessageStore();
	const { user, isAuthenticated } = useAuth();

	const [selectedMessage, setSelectedMessage] = useState<any>(null);
	const [isWagerModalOpen, setIsWagerModalOpen] = useState(false);
	const [isFundModalOpen, setIsFundModalOpen] = useState(false);
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
		useState(false);
	const [insufficientBalance, setInsufficientBalance] = useState(false);
	const [wagerCondition, setWagerCondition] = useState("");
	const [stakeAmount, setStakeAmount] = useState(0);
	const [replyText, setReplyText] = useState("");
	const [replyingTo, setReplyingTo] = useState<string | null>(null);
	const [showAllReplies, setShowAllReplies] = useState<
		Record<string, boolean>
	>({});

	// Custom message state for Josiah comments with proper typing
	const [customMessages, setCustomMessages] = useState<
		Record<string, CustomMessage>
	>({
		"josiah-1": {
			id: "josiah-1",
			// avatarUrl: "https://via.placeholder.com/50?text=J",
			avatarUrl: "https://placehold.co/36x36?text=J",
			username: "Josiah🔥",
			time: "9:16 AM",
			content:
				"Real Madrid playing with 13 men again — 11 on the pitch, 2 in VAR. Nothing's changed",
			isRef: false,
			reactions: ["😂", "🔥", "👏"],
			actionNos: 25,
			replies: [],
		},
		"josiah-2": {
			id: "josiah-2",
			avatarUrl: "https://placehold.co/36x36?text=J",
			username: "Josiah🔥",
			time: "9:16 AM",
			content:
				"Real Madrid playing with 13 men again — 11 on the pitch, 2 in VAR. Nothing's changed",
			isRef: false,
			reactions: ["😂", "🔥", "👏"],
			actionNos: 25,
			replies: [],
		},
		"josiah-3": {
			id: "josiah-3",
			avatarUrl: "https://placehold.co/36x36?text=J",
			username: "Josiah🔥",
			time: "9:16 AM",
			content: "WHAT A STRIKEEE! That's world-class 🔥🔥",
			isRef: false,
			reactions: ["😂", "🔥", "👏"],
			actionNos: 15,
			replies: [],
		},
	});

	// Add some initial replies for demonstration purposes only on first render
	useEffect(() => {
		// Add a sample reply to josiah-1 if none exists yet
		if (customMessages["josiah-1"].replies.length === 0) {
			setCustomMessages((prev) => ({
				...prev,
				"josiah-1": {
					...prev["josiah-1"],
					replies: [
						{
							id: "reply-demo-1",
							avatarUrl: "https://placehold.co/36x36?text=J",
							username: "FanNow22",
							time: "9:20 AM",
							content:
								"Absolutely right! This is getting ridiculous 😡",
						},
					],
				},
			}));
		}
	}, []);

	// Custom handler for Josiah comments
	const handleJosiahReplyToggle = (id: string) => {
		setShowAllReplies((prev) => ({
			...prev,
			[id]: !prev[id],
		}));

		// If there's no replying state for this message yet, also set it to replying
		if (replyingTo !== id) {
			setReplyingTo(id);
		}
	};

	const handleWagerClick = (message: any) => {
		setSelectedMessage(message);
		setIsWagerModalOpen(true);
	};

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
	};

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
			setIsFundModalOpen(false);
			setIsConfirmationModalOpen(true);

			// Close confirmation after 3 seconds
			setTimeout(() => {
				setIsConfirmationModalOpen(false);
			}, 3000);
		} catch (error) {
			console.error("Error placing bet:", error);
		}
	};

	const handleShowReplies = (messageId: string) => {
		setShowAllReplies((prev) => ({
			...prev,
			[messageId]: !prev[messageId],
		}));
	};

	const handleReplyClick = (messageId: string) => {
		setReplyingTo(messageId);
	};

	const handleSubmitReply = (messageId: string) => {
		if (!replyText.trim()) return;

		// Check if it's a standard message or custom Josiah message
		if (messageId.startsWith("josiah-")) {
			const reply: Reply = {
				id: `reply-${Date.now()}`,
				avatarUrl: user?.image || "https://placehold.co/36x36?text=J",
				username: user?.username || "You",
				time: new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				content: replyText,
			};

			// Update the custom messages state
			setCustomMessages((prev) => ({
				...prev,
				[messageId]: {
					...prev[messageId],
					replies: [...prev[messageId].replies, reply],
				},
			}));

			// Show success notification
			toast.success("Reply added successfully!");
		} else {
			// For regular messages in the message store
			const reply: Reply = {
				id: `reply-${Date.now()}`,
				avatarUrl: user?.image || "https://placehold.co/36x36?text=J",
				username: user?.username || "You",
				time: new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				content: replyText,
			};

			addReply(messageId, reply);
			toast.success("Reply added successfully!");
		}

		// Clear the reply text but keep the reply input open
		setReplyText("");

		// Make sure the replies section is expanded
		setShowAllReplies((prev) => ({
			...prev,
			[messageId]: true,
		}));
	};

	// Enhanced messages for demo
	const enhancedMessages = [...messages];

	return (
		<section className="overflow-auto h-full pt-2">
			{/* Add the custom comments to match the image */}
			<JosiahComment
				id="josiah-1"
				onShowReplies={handleJosiahReplyToggle}
				replies={customMessages["josiah-1"].replies}
			>
				{/* Show replies for Josiah comment if expanded */}
				{showAllReplies["josiah-1"] && (
					<div className="ml-12 mt-5">
						{customMessages["josiah-1"].replies.map((reply) => (
							<div
								key={reply.id}
								className="mb-3"
							>
								<div className="flex gap-2 items-start">
									<img
										src={
											"https://placehold.co/36x36?text=J"
										}
										alt={reply.username}
										width={36}
										height={36}
										className="size-[36px] rounded-full"
									/>
									<div className="grid gap-1 w-full">
										<span className="text-black text-[13px] font-normal">
											{reply.username}
										</span>
										<p className="text-black text-[13px] font-normal tracking-[0.2px]">
											{reply.content}
										</p>
									</div>
								</div>
							</div>
						))}

						{/* Add Reply button at the bottom of replies */}
						{replyingTo !== "josiah-1" && (
							<div className="mt-2 mb-3">
								<button
									onClick={() => setReplyingTo("josiah-1")}
									className="text-blue-600 text-sm hover:text-blue-800"
								>
									Add a reply...
								</button>
							</div>
						)}

						{/* Reply input for Josiah comment */}
						{replyingTo === "josiah-1" && (
							<div className="mt-6">
								<div className="flex gap-2 items-center">
									<input
										type="text"
										value={replyText}
										onChange={(e) =>
											setReplyText(e.target.value)
										}
										placeholder="Reply to Josiah..."
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
											onClick={() =>
												handleSubmitReply("josiah-1")
											}
											className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
											disabled={!replyText.trim()}
										>
											Send
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</JosiahComment>

			<JosiahComment
				id="josiah-2"
				onShowReplies={handleJosiahReplyToggle}
				replies={customMessages["josiah-2"].replies}
			>
				{/* Show replies for second Josiah comment if expanded */}
				{showAllReplies["josiah-2"] && (
					<div className="ml-12 mt-3 border-l-2 border-gray-200 pl-4">
						{customMessages["josiah-2"].replies.map((reply) => (
							<div
								key={reply.id}
								className="mb-3"
							>
								<div className="flex gap-2 items-start">
									<img
										src={reply.avatarUrl}
										alt={reply.username}
										width={36}
										height={36}
										className="size-[36px] rounded-full"
									/>
									<div className="grid gap-1 w-full font-ABCDaitype">
										<p className="flex gap-1 items-center">
											<span className="text-[#616061] text-[0.6rem] md:text-[0.7rem] font-medium">
												{reply.username}
											</span>
											<span className="text-[0.5rem] text-[#808080]/55">
												{reply.time}
											</span>
										</p>
										<div className="bg-gray-50 rounded-lg px-3 py-2">
											<p className="text-[0.9rem] tracking-[0.2px]">
												{reply.content}
											</p>
										</div>
									</div>
								</div>
							</div>
						))}

						{/* Add Reply button at the bottom of replies */}
						{replyingTo !== "josiah-2" && (
							<div className="mt-2 mb-3">
								<button
									onClick={() => setReplyingTo("josiah-2")}
									className="text-blue-600 text-sm hover:text-blue-800"
								>
									Add a reply...
								</button>
							</div>
						)}

						{/* Reply input for second Josiah comment */}
						{replyingTo === "josiah-2" && (
							<div className="flex gap-2 items-center">
								<input
									type="text"
									value={replyText}
									onChange={(e) =>
										setReplyText(e.target.value)
									}
									placeholder="Reply to Josiah..."
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
										onClick={() =>
											handleSubmitReply("josiah-2")
										}
										className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
										disabled={!replyText.trim()}
									>
										Send
									</button>
								</div>
							</div>
						)}
					</div>
				)}
			</JosiahComment>

			<RefereeAction />
			<StrikeComment />
			<BookedWager />

			{/* Wager Modals */}
			<WagerModal
				isOpen={isWagerModalOpen}
				onClose={() => {
					setIsWagerModalOpen(false);
					setInsufficientBalance(false);
				}}
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
	);
};

export default MessagePopup;
