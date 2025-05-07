import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";

export const DMSans = {
	subsets: ["latin"],
	variable: "--font-dm-sans",
};

export const abcDiatype = localFont({
	src: [
		{
			path: "./font/abc-diatype-thin.otf",
			weight: "200",
			style: "normal",
		},
		{
			path: "./font/abc-diatype-thin-italic.otf",
			weight: "200",
			style: "italic",
		},
		{
			path: "./font/abc-diatype-light.otf",
			weight: "300",
			style: "normal",
		},
		{
			path: "./font/abc-diatype-regular.otf",
			weight: "400",
			style: "normal",
		},
		{
			path: "./font/abc-diatype-light.otf",
			weight: "400",
			style: "italic",
		},
		{
			path: "./font/abc-diatype-medium.otf",
			weight: "500",
			style: "normal",
		},
		{
			path: "./font/abc-diatype-medium-italic.otf",
			weight: "500",
			style: "italic",
		},
		{
			path: "./font/abc-diatype-bold.otf",
			weight: "700",
			style: "normal",
		},
		{
			path: "./font/abc-diatype-bold-italic.otf",
			weight: "700",
			style: "italic",
		},
	],
	variable: "--font-abc",
});
