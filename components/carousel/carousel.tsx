"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "./carousel-buttons";
import { Game } from "@/data";
import Image from "next/image";
import CurvedArrow from "@/public/icons/CurvedArrow";
import { cn, formatString } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { useAuthLogin } from "@/hooks/use-auth-login";
import { toast } from "react-hot-toast";
const Carousel = ({
	tabs,
	isLive = false,
}: {
	tabs: Game[];
	isLive: boolean;
}) => {
	const router = useRouter();
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
	const { selectedIndex, scrollSnaps, onDotButtonClick } =
		useDotButton(emblaApi);

	React.useEffect(() => {
		if (emblaApi) {
			//console.log(emblaApi.slideNodes()) // Access API
		}
	}, [emblaApi]);

	const { login, loggedIn } = useAuthLogin();

	return (
		<div
			className="overflow-hidden mt-[20px]"
			ref={emblaRef}
		>
			<div className="flex gap-1 lg[touch-action:pan-y_pinch-zoom] ml-[calc(1rem_*_ -1)]">
				{tabs.map((game, i) => {
					const urlRoute = formatString(
						`${game.homeTeam} vs ${game.awayTeam}`
					);

					return (
						<div
							className="min-w-0 lg:transform-gpu lg:flex-[0_0_50%] flex-[0_0_100%] gap-3 border border-[#BEBEBE]/50 bg-white rounded-[12px] py-6 px-5"
							key={i}
						>
							<div className="text-black space-y-4">
								<div className="flex justify-between items-center">
									<p
										className={`flex gap-1 items-center text-[#FF0000] text-[11px] font-normal ${
											isLive ? "visible" : "invisible"
										}`}
									>
										<span className="block bg-[#FF0000] size-1 rounded" />
										Live
									</p>
									<p className="font-bold text-base text-black">
										Premier League
									</p>
									<CurvedArrow />
								</div>

								<div className="flex justify-between items-center p-4">
									<div className="flex flex-col items-center">
										<Image
											src={game.homeImage}
											alt={game.homeTeam}
											width={100}
											height={100}
											className="w-[50px] lg:w-[150px]"
										/>
										<p className="text-center text-black font-normal text-sm mt-1">
											{game.homeTeam}
										</p>
									</div>

									{isLive ? (
										<div className="flex items-center gap-1 text-[#FF0000] font-medium text-2xl">
											<p className="">{game.homeScore}</p>
											<span className="">:</span>
											<p className="">{game.awayScore}</p>
										</div>
									) : (
										<div className="font-black text-[11px]">
											20:00
										</div>
									)}

									<div className="flex flex-col items-center">
										<Image
											src={game.awayImage}
											alt={game.awayTeam}
											width={100}
											height={100}
											className="w-[50px] lg:w-[150px]"
										/>
										<p className="text-center text-black font-normal text-sm mt-1">
											{game.awayTeam}
										</p>
									</div>
								</div>

								<div className="flex justify-center items-center">
									<button
										onClick={() => {
											if (loggedIn) {
												toast.success(
													"Joining the hub"
												);
												router.push(
													`/comment-hub/${urlRoute}`
												);
											} else {
												toast.error(
													"Please login to join the hub"
												);
												login();
											}
										}}
										className="bg-darkGreen cursor-pointer text-white font-bold text-base rounded-lg py-2 w-52"
									>
										{!isLive ? "Launch Hub" : "Join Hub"}
									</button>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<div className="flex gap-1 mt-3 flex-wrap justify-center items-center -mr-[calc((2.6rem-1.4rem)/2)]">
				{scrollSnaps.map((_, index) => (
					<DotButton
						key={index}
						onClick={() => onDotButtonClick(index)}
						className={cn(
							"appearance-none bg-[#7BAF9A] touch-manipulation flex items-center justify-center cursor-pointer border-0 p-0 m-0 size-[7.16px] rounded-full",
							index === selectedIndex && "bg-[#0A6B41]"
						)}
					/>
				))}
			</div>
		</div>
	);
};

export default Carousel;
