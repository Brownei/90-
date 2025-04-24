import type { Metadata } from "next";
import "./globals.css";
import { TRPCProvider } from "@/trpc/client";
import Nav from "@/components/Nav";
import { HydrateClient } from "@/trpc/server";

export const metadata: Metadata = {
  title: "90+: The Future of Live Football Engagement",
  description: "Step into the Comment Hub, where fans from all over the world connect to debate, celebrate, and Interact in real-time.",
  icons: {
    icon: '/favicon.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>
          <HydrateClient>
            <Nav />
            {children}
          </HydrateClient>
        </TRPCProvider>
      </body>
    </html>
  );
}
