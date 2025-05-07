"use client";
import SearchIcon from "@/public/icons/SearchIcon";
import React from "react";

const SearchComponent = ({
	setQuery,
}: {
	setQuery: React.Dispatch<React.SetStateAction<string>>;
}) => {
	return (
		<div className="relative">
			<SearchIcon className="absolute top-1/2 left-4 -translate-y-1/2" />
			<input
				className="outline-none w-full text-[#BEBEBE] border-2 border-[#BEBEBE] rounded-2xl pl-10 px-4 py-4 h-12"
				onChange={(e) => setQuery(e.target.value)}
			/>
		</div>
	);
};

export default SearchComponent;
