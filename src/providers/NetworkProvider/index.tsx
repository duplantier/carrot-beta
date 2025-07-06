"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { worldchainSepolia } from "@/config";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const { isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [hasSwitched, setHasSwitched] = useState(false);

  useEffect(() => {
    // Only auto-switch if:
    // 1. User is connected to a wallet
    // 2. User is on wrong network
    // 3. We haven't already attempted to switch
    if (
      isConnected &&
      chain &&
      chain.id !== worldchainSepolia.id &&
      !hasSwitched
    ) {
      console.log("NetworkProvider: Auto-switching to World Chain Sepolia");
      console.log("Current chain:", chain);
      console.log("Target chain:", worldchainSepolia);

      switchChain(
        { chainId: worldchainSepolia.id },
        {
          onSuccess: () => {
            console.log("NetworkProvider: Successfully switched to World Chain Sepolia");
            toast.success("Switched to World Chain Sepolia!");
            setHasSwitched(true);
          },
          onError: (error) => {
            console.error("NetworkProvider: Failed to switch network:", error);
            toast.error("Please manually switch to World Chain Sepolia in your wallet");
            setHasSwitched(true); // Don't keep trying
          },
        }
      );
    }
  }, [isConnected, chain, switchChain, hasSwitched]);

  return <>{children}</>;
}

export default NetworkProvider; 