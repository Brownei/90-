import AuthProvider from "@/components/providers/auth-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "90+: Comment Hub",
	description:
		"Step into the Comment Hub, where fans from all over the world connect to debate, celebrate, and Interact in real-time.",
};

export default function CommentHubLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		// <html
		// 	lang="en"
		// 	className={`${abcDiatype.variable} antialiased`}
		// >
		// 	<body>
		// <div className={`${abcDiatype.variable} antialiased`}>
		<div>
			<AuthProvider>{children}</AuthProvider>
		</div>
		// </div>
		// 	</body>
		// </html>
	);
}
