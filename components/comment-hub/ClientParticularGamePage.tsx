"use client";
import { Game, games } from "@/data";
import BackIcon from "@/public/icons/BackIcon";
import CurvedArrow from "@/public/icons/CurvedArrow";
import { reverseFormatString } from "@/utils/utils";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import MessagePopup from "./ui/message-popup";
import MessageInput from "./ui/message-input";
import gsap from "gsap";
import StatsIcon from "@/public/icons/StatsIcon";
import WagerModal from "./ui/WagerModal";
import FundWagerModal from "./ui/FundWagerModal";
import TransactionConfirmedModal from "./ui/TransactionConfirmedModal";
import { useMessageStore } from "@/stores/use-messages-store";
import { ChevronLeft } from "lucide-react";

// Add sample messages data if not already in the store
const sampleMessages = [
	{
		id: "msg-sample-1",
		avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
		username: "FootballFan22",
		time: "5:30 PM",
		content: "What a game so far! That last play was incredible.",
		isRef: false,
		reactions: ["👍", "🔥"],
		actionNos: 5,
		replies: [
			{
				id: "reply-sample-1",
				avatarUrl: "https://randomuser.me/api/portraits/women/22.jpg",
				username: "SoccerLover",
				time: "5:32 PM",
				content: "Absolutely! The midfielder is on fire today!",
			},
		],
	},
	{
		id: "msg-sample-2",
		avatarUrl: "https://randomuser.me/api/portraits/women/45.jpg",
		username: "SportAnalyst",
		time: "5:35 PM",
		content:
			"The defense needs to tighten up in the second half. Too many opportunities for the opponent.",
		isRef: false,
		reactions: ["👀", "👍"],
		actionNos: 8,
		replies: [],
	},
	{
		id: "msg-sample-3",
		avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
		username: "GameChanger",
		time: "5:40 PM",
		content:
			"I bet we'll see a substitution in the next 10 minutes. The striker looks tired.",
		isRef: false,
		reactions: ["👍", "🤔"],
		actionNos: 15,
		replies: [
			{
				id: "reply-sample-2",
				avatarUrl: "https://randomuser.me/api/portraits/men/28.jpg",
				username: "CoachMike",
				time: "5:42 PM",
				content:
					"Good call! I think they should bring in the young forward.",
			},
			{
				id: "reply-sample-3",
				avatarUrl: "https://randomuser.me/api/portraits/women/36.jpg",
				username: "TacticalGenius",
				time: "5:43 PM",
				content: "No way, they need to focus on defense first!",
			},
		],
	},
];

type Params = {
	game: string;
};

const ClientParticularGamePage = () => {
	const isLive = true;
	const router = useRouter();
	const { game } = useParams<Params>();
	const [homeTeam, awayTeam] = reverseFormatString(game).split("Vs");
	const seletedGame = games.find(
		(g) =>
			g.awayTeam === awayTeam?.trim() && g.homeTeam === homeTeam?.trim()
	) as Game;
	const inputRef = React.useRef<HTMLDivElement>(null);
	const boxRef = React.useRef<HTMLDivElement>(null);
	const messageAreaRef = useRef<HTMLDivElement>(null);
	const [isSlidOut, setIsSlidOut] = React.useState(false);
	const { messages, addMessage } = useMessageStore();
	const [messageCount, setMessageCount] = useState(0);

	// Add sample messages on first load if needed
	useEffect(() => {
		if (messages.length <= 2) {
			sampleMessages.forEach((msg) => {
				addMessage(msg);
			});
		}

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

	const scrollToBottom = () => {
		if (messageAreaRef.current) {
			setTimeout(() => {
				messageAreaRef.current?.scrollTo({
					top: messageAreaRef.current.scrollHeight,
					behavior: "smooth",
				});
			}, 100);
		}
	};

	// New function to handle manual scroll to bottom
	const handleScrollToBottom = () => {
		scrollToBottom();
	};

	// Wager state
	const [isWagerModalOpen, setIsWagerModalOpen] = useState(false);
	const [isFundModalOpen, setIsFundModalOpen] = useState(false);
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
		useState(false);
	const [insufficientBalance, setInsufficientBalance] = useState(false);
	const [wagerCondition, setWagerCondition] = useState("");
	const [stakeAmount, setStakeAmount] = useState(0);
	const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

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
			console.error("Error placing bet:", error);
		}
	};

	return (
		<main className=" overflow-hidden min-h-screen flex flex-col">
			{/* Mobile status bar */}

			{/* Header section - fixed on desktop, normal flow on mobile */}
			<div className="overflow-visible text-white z-30 shadow-md pb-9 bg-gradient-to-b from-gradientDarkGreen to-gradientLightGreen rounded-b-[5px]">
				<div className="container mx-auto px-4 md:px-6 pt-4">
					{/* Navigation bar */}
					<div className="flex justify-between items-center mb-3">
						<button
							onClick={() => router.back()}
							className="rounded-full bg-[#D9D9D957] hover:bg-[#3E3D3D30] transition-colors size-[26px] flex items-center justify-center cursor-pointer"
						>
							<ChevronLeft
								color="#ffffff"
								size={20}
								className="-ml-0.5"
							/>
						</button>
						<svg
							width="26"
							height="26"
							viewBox="0 0 26 26"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
						>
							<circle
								cx="13"
								cy="13"
								r="13"
								transform="matrix(-1 0 0 1 26 0)"
								fill="#D9D9D9"
								fillOpacity="0.34"
							/>
							<rect
								x="6"
								y="6"
								width="14"
								height="14"
								fill="url(#pattern0_847_1103)"
							/>
							<defs>
								<pattern
									id="pattern0_847_1103"
									patternContentUnits="objectBoundingBox"
									width="1"
									height="1"
								>
									<use
										xlinkHref="#image0_847_1103"
										transform="scale(0.01)"
									/>
								</pattern>
								<image
									id="image0_847_1103"
									width="100"
									height="100"
									preserveAspectRatio="none"
									xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEg0lEQVR4nO3dW6hVRRzH8TG1i5lZphgZRBGZRiBd0JIIejHqJET10kNFBBH5IBg9GBo+SJeHKJBMoqArCFEkFRFdoEKwKApLQayQUgONIrRC8xt/nOike5+z11pzW2v/Pu9nzcz+7b1uM/M/zomIiIiIiEgUwATgPuBl4OY4rcjAfBijPTT4X0twwKsc7zH75YRvTcYFbKS39cAJ4x9BUgViXgEmh21RmgRiNgEnj30USRmI+RA4LVyr0jQQswWY0f9IkjoQsxU4O0zLEiIQsx04t/fRJEcg5gfgwuatS6hAzB7g0uOPKLkCMb8AC5v1QEIGYn4Hrvv/USVnIOZPYGn9XkjoQMxfwK3/HVlyB2IOA3fX64nECMQcAZYfPbqUEMi/HqneG3ERAzFPaaKrrECMJrqAqcA8YAlwD7DaTiHAM8CLwGvAe8Bm/3AX20vAJNd1wDnAjcAq/yF/legDruMN4CTXFcBE4GpgDfAOsJf2sV/lqa6tgJn2sAW8UPA3v6p2TXTZNwi4C/jE39N30ZfALFcy4DLgSWA/w2F7kRNdwA3A5wyn74ELXAmAxcBHuT+RAuSd6AIWAB/k/hQKsw+4PHUQk4EH/WtqyTnRZT9J4IsenZCUE122WBl4GDh0TMPSn51BbokRxjTg9TEallQTXXZ/DXwzRoMyPnsoXhYijLnArgEalMGsbBLGRf6+WsJaUSeM84GfAndEjtpXNYwzgW3+jyW8rVXCmOQ3tEgcvwGLqgTyeKSOCBXXDvvp067OWeS2G7ikShgzdEcVTfX9J35aVcKzm6M5VcO4UqeqKOrtYQQ+jtOfobal1uIHq5iTu+cdVG8fvH/m+DZ37zumfqUIvzxHSlliCnwWsDPDbn2jakPAFblH0CHNtykAz+UeRUc038gDTAcO5B5Jy4Xb6gbcm3s0HZgjvzNIGD6Qt2ivg8B3wNfAp8C7ftfUs8ATCeZxwq4iAab4QZVsF/A2sA54ALjNv96ZlXlLm53mrw8Whu/wUsp7Lb3Jr/caAWY3HN/GVq1EBDaQ1wG/88iWoV4cYXwxAolXlAb4kTynIKudey1wYpSBxQvEfsHzY3XWFrylctB/OCMpd6wSNpC4hc2Am4jPXsfcDpwSbSBpAqk+sVSVv3DGekiy68JI1AGkCyRNcUzgTcIHYbXW57pC0DwQe7aZnqqzIS/o1vGrXGFoFki6AsvAWYGC2BH84aiMQNJWZvDblJs45Lc5F125gHqBpC/S3/AOy2qOLHAtQPVAns7ybyyA+2uGYeu1priWoFogj2arfwWsrRjEr1H2xpUTyMrcHbW6UoOy19vzXAsxfiBl1FCssLl/c/GFVOoHEnZiqYkB64/YffhU12L0D6SsOrz+dUDn/xUQvQOxV/5LXEmAnWOE8X5XytUBz/fYsXSNK41/r9+v+NY01xHAolFT1D8nLwIzqD4l9axqzXmuY4A5fqr6DFcqXwhltL+LO68OE+CPYwJZk7tPQ82vzB593ejERby1bHEBcIc9GAGn5+6PiIiIiIiIiIiIuFb4B4/tMYTwkiOuAAAAAElFTkSuQmCC"
								/>
							</defs>
						</svg>
					</div>

					{/* Teams and score section */}
					<div className="flex flex-col justify-center items-center">
						{/*  max-w-2xl w-full */}
						<div className="flex w-[70%] md:w-[85%] pt-1 justify-between items-center">
							{/* Home team */}
							<div className="flex flex-col items-center">
								<img
									src={seletedGame.homeImage}
									alt="FC Barcelona"
									width={100}
									height={100}
									className="w-[40px] md:w-[50px] lg:w-[60px] transition-transform hover:scale-105"
								/>
								<p className="text-center text-xs font-medium mt-1">
									FC Barcelona
								</p>
							</div>

							{/* Score or time */}
							<div className="grid place-items-center mt-2">
								<div className="flex items-center gap-2 leading-8 text-[27px] text-[#ECF5F5] font-bold md:text-[2.2rem] lg:text-[2.5rem]">
									<p>4</p>
									<span> - </span>
									<p>1</p>
								</div>
								<div className="text-xs text-white">
									45 : 04
								</div>
							</div>

							{/* Away team */}
							<div className="flex flex-col items-center">
								<img
									src={seletedGame.awayImage}
									alt="Real Madrid FC"
									width={100}
									height={100}
									className="w-[40px] md:w-[50px] lg:w-[60px] transition-transform hover:scale-105"
								/>
								<p className="text-center text-xs font-medium mt-1">
									Real Madrid FC
								</p>
							</div>
						</div>

						{/* Match overview section - using a green underline to make it stand out */}
						{/* <div className="mt-3 mb-1">
							<p className="font-ABCDaitype font-medium text-[0.7rem] md:text-[0.8rem] inline-block relative p-2">
								Match overview
								<span className="absolute bottom-0 left-0 w-full h-1 bg-[#3E3D3D] rounded-full"></span>
							</p>
						</div> */}
					</div>
				</div>
			</div>

			{/* Chat Container - Adjusts based on screen size */}
			<div>
				{/* Message area - takes remaining height */}
				<div
					ref={messageAreaRef}
					className="border h-[calc(100vh-290px)] sm:h-[calc(100vh-340px)] bg-[#ECF5F5] flex-1 z-20 overflow-y-auto rounded-t-3xl message-area"
					style={{ marginTop: "0", border: "none" }}
				>
					<div
						className="px-5 py-1 bg-[#ECF5F5] pb-20"
						ref={boxRef}
					>
						<MessagePopup />
					</div>

					{/* Scroll to Bottom button - shows only when not at bottom */}
					<button
						onClick={handleScrollToBottom}
						className="fixed bottom-24 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-colors z-50"
						aria-label="Scroll to bottom"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 14l-7 7m0 0l-7-7m7 7V3"
							/>
						</svg>
					</button>
				</div>

				{/* Message input - always at bottom */}
				<MessageInput
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
	);
};

export default ClientParticularGamePage;
