"use client";
interface Props {
  server_balance: bigint;
}

import { useBalance } from "@/app/providers";
import React, { useEffect } from "react";

export default function ClientBalance({ server_balance }: Props) {
  const { balance, setBalance } = useBalance();
  useEffect(() => {
    setBalance(server_balance);
  }, [])
  
  return <>{`Balance: ${balance}`}</>;
}
