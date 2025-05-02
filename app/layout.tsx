import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
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
        <Providers>
          <Nav />
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
