import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { cookies } from "next/headers";
import { SessionProvider } from "next-auth/react";


export const metadata: Metadata = {
  title: "90+: The Future of Live Football Engagement",
  description: "Step into the Comment Hub, where fans from all over the world connect to debate, celebrate, and Interact in real-time.",
  icons: {
    icon: '/logo.png'
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const serverCookies = await cookies()
  const token = serverCookies.get("session")?.value as string

  console.log({token})
  return (
    <html lang="en">
      <body>
        <Providers token={token}>
          <Nav />
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
