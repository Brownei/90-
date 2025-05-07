import type { Metadata } from "next";
import AuthProvider from "@/components/providers/auth-provider";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "90+: Profile",
  description: "Step into the Profile, where fans from all over the world connect to debate, celebrate, and Interact in real-time.",
};

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const serverCookies = await cookies()
  const token = serverCookies.get("session")?.value as string

  return (
    <AuthProvider token={token}>
      {children}
    </AuthProvider>
  );
}

