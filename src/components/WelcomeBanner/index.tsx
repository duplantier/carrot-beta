"use client";

import { useSession } from "next-auth/react";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CheckCircle, Wallet, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/AuthButton";

export function WelcomeBanner() {
  const { data: session, status } = useSession();
  const { isConnected, address, chain } = useAccount();
  const { disconnect } = useDisconnect();

  // Debug session data
  console.log("WelcomeBanner - Session:", session);
  console.log("WelcomeBanner - Status:", status);
  console.log("WelcomeBanner - Wallet Address:", session?.user?.walletAddress);
  console.log("WelcomeBanner - Wagmi Connected:", isConnected);
  console.log("WelcomeBanner - Wagmi Address:", address);

  // Show loading state
  if (status === "loading") {
    return (
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-600">
              Loading...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // User is not authenticated with World ID
  if (!session) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Authenticate with World ID to start participating in quests
              </span>
            </div>
            <AuthButton />
          </div>
        </CardContent>
      </Card>
    );
  }

  // User is authenticated but wallet not connected
  if (session && !isConnected) {
    return (
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-orange-700">
                  Connect your wallet to join quests
                </span>
                <span className="text-xs text-orange-600">
                  Authenticated as @{session.user.username}
                </span>
              </div>
            </div>
            <ConnectButton />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Both authenticated and wallet connected
  return (
    <div className="flex justify-center items-center w-full">
      <ConnectButton />
    </div>
  );
}

export default WelcomeBanner;
