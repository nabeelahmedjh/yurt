import type { Metadata } from "next";
// import { Rubik } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { JotaiProvider } from "@/components/jotai-provider";
import { Toaster } from "@/components/ui/sonner";

// const rubik = Rubik({ subsets: ["latin"] });
const rubik = localFont({
  src: "./Rubik.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yurt",
  description:
    "Yurt is an educational community for students to come together and connect with each other.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={rubik.className}>
        <Toaster richColors />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <JotaiProvider>{children}</JotaiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
