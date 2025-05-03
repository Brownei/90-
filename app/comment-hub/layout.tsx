import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { OPTIONS } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "90+: Comment Hub",
  description: "Step into the Comment Hub, where fans from all over the world connect to debate, celebrate, and Interact in real-time.",
};

export default async function CommentHubLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(OPTIONS);
  if (!session) {
    redirect("/")
  }

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
