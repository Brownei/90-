import { Game, games } from "@/data";
import Image from "next/image";
import React from "react";

const Card = ({ game }: { game: Game }) => {
	const alreadyAHub = games.find((g) => g === game);
	return (
		<div>
			{alreadyAHub && (
				<p className="font-medium text-sm mb-1.5">
					⚠️ This Hub already exists.
				</p>
			)}
			<div className="py-6 px-4 text-black border border-[#E3E0E0] bg-white rounded-2xl">
				<h2 className="text-base font-medium text-black text-center">
					UEFA Champions League
				</h2>
				<div className="flex justify-between items-center p-4 lg:p-6">
					<div className="flex flex-col items-center">
						<Image
							src={game.homeImage}
							alt={game.homeTeam}
							width={100}
							height={100}
							className="w-[50px] lg:w-[150px]"
						/>
						<p className="text-center text-[13px] text-black font-dmsans font-normal">
							{game.homeTeam}
						</p>
					</div>

					{alreadyAHub !== undefined ? (
						<div className="flex items-center gap-1 font-medium text-[#FF0000] text-2xl">
							<p>{game.homeScore}</p>
							<span>:</span>
							<p>{game.awayScore}</p>
						</div>
					) : (
						<div className="font-dmSans text-[1rem] lg:text-[1.1rem]">
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
						<p className="text-center text-[13px] text-black font-dmsans font-normal">
							{game.awayTeam}
						</p>
					</div>
				</div>

				<div className="flex justify-center items-center">
					<button className="w-40 bg-darkGreen py-2 cursor-pointer text-white font-dmSans font-bold rounded-lg">
						{alreadyAHub ? "Join Hub" : "Launch Hub"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Card;
