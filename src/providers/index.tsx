"use client";
import { config } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";

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
 * This component ensures both providers are available to all child components.
 */
export default function ClientProviders({
  children,
  session,
}: ClientProvidersProps) {
  const queryClient = new QueryClient();

  return (
    <ErudaProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <MiniKitProvider>
            <SessionProvider session={session}>{children}</SessionProvider>
          </MiniKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErudaProvider>
  );
}
