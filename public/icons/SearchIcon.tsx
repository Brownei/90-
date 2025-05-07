import React from "react";

const SearchIcon = ({ className }: { className: string }) => {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				d="M7.22222 13.4444C10.6587 13.4444 13.4444 10.6587 13.4444 7.22222C13.4444 3.78578 10.6587 1 7.22222 1C3.78578 1 1 3.78578 1 7.22222C1 10.6587 3.78578 13.4444 7.22222 13.4444Z"
				stroke="#BEBEBE"
				strokeWidth="2"
			/>
			<path
				d="M15.0003 14.9999L11.5781 11.5776"
				stroke="#BEBEBE"
				strokeWidth="2"
			/>
		</svg>
	);
};

export default SearchIcon;
