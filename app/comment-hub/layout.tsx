import type { Metadata } from "next";
import AuthProvider from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  title: "90+: Comment Hub",
  description: "Step into the Comment Hub, where fans from all over the world connect to debate, celebrate, and Interact in real-time.",
};

export default async function CommentHubLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
