"use client";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const BalanceContext = createContext<
  [bigint, Dispatch<SetStateAction<bigint>>]
>([
  BigInt(0),
  () => {
    return;
  },
]);
export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  //let [balance, setBalance] = useState<number>();

  return (
    <QueryClientProvider client={queryClient}>
      <BalanceContext.Provider value={useState<bigint>(BigInt(0))}>
        {children}
      </BalanceContext.Provider>
    </QueryClientProvider>
  );
}

export function useBalance() {
  let [balance, setBalance] = useContext(BalanceContext);

  const addBalance = (b: bigint) => {
    setBalance((lastBalance) => lastBalance + b);
  };

  return {balance, setBalance, addBalance}
}
