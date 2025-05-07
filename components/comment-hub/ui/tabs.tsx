"use client";
import { cn, formatString, reverseFormatString } from "@/utils/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

type TabsProps = {
	tabs: string[];
	selected: string;
	onSelected: (tab: string) => void;
};

const Tabs: React.FC<TabsProps> = ({ tabs, selected, onSelected }) => {
	const router = useRouter();
	const pathname = useSearchParams();

	function routerPush(tab: string, url: string) {
		if (tab === "All") {
			router.push("/comment-hub");
		} else {
			router.push(url);
		}
	}

	return (
		<div className="flex items-center gap-5 w-full px-6">
			{tabs.map((tab, i) => {
				const url = formatString(tab);
				const decodeUrl =
					pathname.get("tabs") !== null
						? reverseFormatString(pathname.get("tabs") as string)
						: "";

				return (
					<button
						className={cn(
							// lg:min-w-[140px]
							"py-2 rounded-lg w-full min-w-fit lg:min-w-[120px] text-sm cursor-pointer border-2 font-normal",
							pathname.get("tabs") === null &&
								tab === "All" &&
								"bg-darkGreen text-white border-darkGreen font-bold",
							decodeUrl === tab &&
								pathname.get("tabs") !== null &&
								"bg-darkGreen text-white border-darkGreen font-bold",
							!(pathname.get("tabs") === null && tab === "All") &&
								!(
									decodeUrl === tab &&
									pathname.get("tabs") !== null
								) &&
								"border-black/50 bg-transparent"
						)}
						key={i}
						onClick={() =>
							routerPush(tab, `comment-hub/?tabs=${url}`)
						}
					>
						{tab}
					</button>
				);
			})}
		</div>
	);
};

export default Tabs;
