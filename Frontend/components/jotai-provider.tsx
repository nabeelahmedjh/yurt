"use client";

import { Provider } from "jotai";

export const JotaiProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <Provider>{children}</Provider>;
};
