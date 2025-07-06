"use client";
import { walletAuth } from "@/auth/wallet";
import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

/**
 * This component is an example of how to authenticate a user
 * We will use Next Auth for this example, but you can use any auth provider
 * Read More: https://docs.world.org/mini-apps/commands/wallet-auth
 */
export const AuthButton = () => {
  const [isPending, setIsPending] = useState(false);
  const { isInstalled } = useMiniKit();
  const { data: session } = useSession();
  const onClick = useCallback(async () => {
    if (!isInstalled || isPending) {
      return;
    }
    setIsPending(true);
    try {
      await walletAuth();
    } catch (error) {
      console.error("Wallet authentication button error", error);
      setIsPending(false);
      return;
    }

    setIsPending(false);
  }, [isInstalled, isPending]);

  useEffect(() => {
    const authenticate = async () => {
      if (isInstalled && !isPending && !session) {
        setIsPending(true);
        try {
          await walletAuth();
        } catch (error) {
          console.error("Auto wallet authentication error", error);
        } finally {
          setIsPending(false);
        }
      }
    };

    authenticate();
  }, [isInstalled, isPending, session]);

  return (
    <LiveFeedback
      label={{
        failed: "Failed to login",
        pending: "Logging in...",
        success: "Logged in",
      }}
      state={isPending ? "pending" : undefined}
    >
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            src={"/carrot-logo.svg"}
            alt="Carrot"
            width={200}
            height={200}
          />
          <p className="text-gray-600 text-xs">Verify & Engage & Earn</p>
        </div>
        <Button
          onClick={onClick}
          disabled={isPending}
          size="lg"
          variant="primary"
          className="flex items-center gap-2 text-sm hover:!bg-gradient-to-r hover:!from-yellow-500 hover:!to-orange-600"
        >
          <Image
            src="/world-logo.jpg"
            alt="World ID"
            className="rounded-full"
            width={30}
            height={30}
          />
          <h6>Verify with World ID</h6>
        </Button>
      </div>
    </LiveFeedback>
  );
};
