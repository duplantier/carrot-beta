"use client";

import { useSession } from "next-auth/react";
import { useAccount, useSwitchChain } from "wagmi";
import { worldchainSepolia } from "@/config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function NetworkSwitcher() {
  const { data: session } = useSession();
  const { isConnected, chain } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  const [isManualSwitching, setIsManualSwitching] = useState(false);

  const isCorrectNetwork = chain?.id === worldchainSepolia.id;

  // Don't show anything if user is not authenticated
  if (!session?.user?.walletAddress) {
    return null;
  }

  // User is authenticated but wallet not connected
  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <AlertCircle className="w-4 h-4 text-orange-600" />
        <span className="text-sm font-medium text-orange-700">
          Wallet not connected
        </span>
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          Connect Wallet
        </Badge>
      </div>
    );
  }

  // Wallet connected and on correct network
  if (isCorrectNetwork) {
    return (
      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium text-green-700">
          World Chain Sepolia
        </span>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Connected
        </Badge>
      </div>
    );
  }

  // Wallet connected but wrong network
  const handleSwitchNetwork = async () => {
    setIsManualSwitching(true);
    try {
      await switchChain({ chainId: worldchainSepolia.id });
      toast.success("Successfully switched to World Chain Sepolia!");
    } catch (error) {
      console.error("Failed to switch network:", error);
      toast.error("Failed to switch network. Please switch manually in your wallet.");
    } finally {
      setIsManualSwitching(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-orange-600" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-orange-700">
            Wrong Network
          </span>
          <span className="text-xs text-orange-600">
            Currently on: {chain?.name || "Unknown"}
          </span>
        </div>
      </div>
      <Button
        onClick={handleSwitchNetwork}
        disabled={isPending || isManualSwitching}
        size="sm"
        className="bg-orange-600 hover:bg-orange-700 text-white"
      >
        {isPending || isManualSwitching ? (
          <>
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Switching...
          </>
        ) : (
          "Switch Network"
        )}
      </Button>
    </div>
  );
}

export default NetworkSwitcher; 