import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { cn } from "~/lib/utils";
import { ThemeProvider } from "~/providers/theme-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "MQViva - Streamline Oral Examinations",
  description:
    "MQViva is designed to streamline the assessment process in higher education by providing a sophisticated interface for generating and managing oral examinations.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    title: "MQViva - Streamline Oral Examinations",
    description:
      "Enhance efficiency and accuracy in preparing viva questions based on student submissions with MQViva.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MQViva - Streamline Oral Examinations",
    description:
      "Enhance efficiency and accuracy in preparing viva questions based on student submissions with MQViva.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
