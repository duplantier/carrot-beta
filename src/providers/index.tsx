"use client";
import { config } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { NetworkProvider } from "./NetworkProvider";
import { worldchainSepolia } from "@/config";

const ErudaProvider = dynamic(
  () => import("@/providers/Eruda").then((c) => c.ErudaProvider),
  { ssr: false }
);

// Define props for ClientProviders
interface ClientProvidersProps {
  children: ReactNode;
  session: Session | null; // Use the appropriate type for session from next-auth
}

/**
 * ClientProvider wraps the app with essential context providers.
 *
 * - ErudaProvider:
 *     - Should be used only in development.
 *     - Enables an in-browser console for logging and debugging.
 *
 * - MiniKitProvider:
 *     - Required for MiniKit functionality.
 *
 * - RainbowKitProvider:
 *     - Provides wallet connection UI and management.
 *
 * - NetworkProvider:
 *     - Automatically switches to World Chain Sepolia on app load.
 *
 * This component ensures both providers are available to all child components.
 */
export default function ClientProviders({
  children,
  session,
}: ClientProvidersProps) {
  const queryClient = new QueryClient();

  return (
    <ErudaProvider>
      <WagmiProvider config={config as any}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider initialChain={worldchainSepolia}>
            <NetworkProvider>
              <MiniKitProvider>
                <SessionProvider session={session}>{children}</SessionProvider>
              </MiniKitProvider>
            </NetworkProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErudaProvider>
  );
}
