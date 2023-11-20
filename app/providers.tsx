"use client";
import React, { ReactNode, createContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const BalanceContext = createContext<number | null>(null);
export default function Providers({children}:{children: ReactNode}) {
  const queryClient = new QueryClient();

  
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
