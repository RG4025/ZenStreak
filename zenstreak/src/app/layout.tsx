import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import "./globals.css";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { success } from "zod";
import { FaCheck } from "react-icons/fa";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZenStreak - Master Consistency",
  description: "Log your daily routines, track your streaks visually, and cultivate mental balance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={<div><Loader2 className="animate-spin" /></div>}>
              {children}
            </Suspense>
            <Toaster position="top-right" richColors duration={2000} />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
