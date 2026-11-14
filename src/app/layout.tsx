import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { HudHeader } from "@/components/HudHeader";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NoTime2Die — Health Copilot for Distance",
  description:
    "Research prototype: explainable astronaut health monitoring that adapts to Earth comms delay. NASA Space Apps 2026.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} h-full`}>
      <body className="mission-bg min-h-full flex flex-col antialiased">
        <HudHeader subtitle="Health copilot that knows how far Earth is" />
        <main className="relative z-10 flex-1">{children}</main>
        <footer className="relative z-10 border-t border-[var(--border-dim)] px-4 py-2 text-center">
          <p className="label-caps m-0">
            Simulated crew data · Not a medical device · Research prototype for NASA Space Apps 2026
          </p>
        </footer>
      </body>
    </html>
  );
}
