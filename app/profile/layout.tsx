import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { OPTIONS } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "90+: Profile",
  description: "Step into the Profile, where fans from all over the world connect to debate, celebrate, and Interact in real-time.",
};

export default async function ProfileLayout({
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

