import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";

const rubik = Rubik({ subsets: ["latin"] });

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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
