"use client";
import React, { Suspense } from "react";
import Tabs from "./ui/tabs";
import { useTabsStore } from "@/stores/use-tabs-store";
import SearchComponent from "./ui/search-component";
import Carousel from "../carousel/carousel";
import { Game, games } from "@/data";
import { PlusIcon } from "lucide-react";
// import PlusIcon from '@/public/icons/PlusIcon'
import LoadingIcon from "@/public/icons/LoadingIcon";
import Link from "next/link";

const tabs = ["All", "PL", "UCL"];

const CommentHubPage = () => {
	const { selected, setSelected } = useTabsStore();
	const [isLoading, setIsLoading] = React.useState(false);
	const [query, setQuery] = React.useState("");
	const [filteredGames, setFilteredGames] = React.useState<Game[]>(games);

	React.useEffect(() => {
		setIsLoading(true);

		const timeoutId = setTimeout(() => {
			if (query !== "") {
				const gamesFiltered = games.filter(
					(g) =>
						g.awayTeam
							.toLowerCase()
							.includes(query.toLowerCase()) ||
						g.homeTeam.toLowerCase().includes(query.toLowerCase())
				);
				setFilteredGames(gamesFiltered);
			} else {
				setFilteredGames(games);
			}

			setIsLoading(false);
		}, 1000);

		return () => clearTimeout(timeoutId);
	}, [query, games]);

	return (
		<main className="bg-[##ECF5F5] min-h-screen">
			<div className="container mx-auto px-5">
				<div className="space-y-5">
					<div className="flex items-center justify-center gap-5">
						<h2 className="text-[#BBB4B4] text-sm font-medium">
							Community Huddle
						</h2>
						<h2 className="text-black font-bold text-base border-b-2 border-b-[#0A6B41] pb-1">
							Live Hubs
						</h2>
					</div>

					<SearchComponent setQuery={setQuery} />

					<div className="flex justify-center">
						<Suspense>
							<Tabs
								tabs={tabs}
								onSelected={setSelected}
								selected={selected}
							/>
						</Suspense>
					</div>
				</div>

				<div className="mt-5 space-y-9">
					<div className="mt-5">
						<div className="space-y-1">
							<h3 className="text-xl font-medium text-black">
								Live Hubs
							</h3>
							<p className="font-normal text-sm text-[#BEBEBE]">
								Join the conversation
							</p>
						</div>

						{isLoading ? (
							<div className="bg-gray-50 rounded-xl p-3 shadow-sm">
								<div className="flex justify-center py-4">
									<LoadingIcon />
								</div>
							</div>
						) : (
							<Carousel
								tabs={filteredGames}
								isLive
							/>
						)}
					</div>

					<div>
						<h3 className="text-xl font-medium text-black">
							Upcoming Hubs
						</h3>
						{isLoading ? (
							<div className="bg-gray-50 rounded-xl p-3 shadow-sm">
								<div className="flex justify-center py-4">
									<LoadingIcon />
								</div>
							</div>
						) : (
							<Carousel
								tabs={filteredGames}
								isLive={false}
							/>
						)}
					</div>
				</div>

				<Link
					href="/comment-hub/create-new-hub"
					className="fixed bottom-6 right-6 z-40 bg-green-700 hover:bg-green-800 rounded-full shadow-lg p-5 transition-colors"
				>
					<PlusIcon
						fontSize={64}
						size={32}
						color="#fff"
					/>
				</Link>
			</div>
		</main>
	);
};

export default CommentHubPage;
