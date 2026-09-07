import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";

const heading = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Resume Analyzer & Career Advisor",
  description: "Upload your resume and get AI help to improve it.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
