import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from '@/components/providers/toaster-provider';
import { ConfettiProvider } from '@/components/providers/confetti-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZenMentor",
  description: "ZenMentor: Teach with passion and soul",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ConfettiProvider />
          <ToastProvider />
          {children}
          
        </body>
      </html>
    </ClerkProvider>
    
  );
}
