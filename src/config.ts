import { http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { defineChain } from "viem";
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  walletConnectWallet,
  rainbowWallet,
  coinbaseWallet,
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';

// Define World Chain Sepolia Testnet with RainbowKit metadata
export const worldchainSepolia = defineChain({
  id: 4801,
  name: "World Chain Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://worldchain-sepolia.g.alchemy.com/public"],
    },
  },
  blockExplorers: {
    default: {
      name: "World Chain Sepolia Explorer",
      url: "https://worldchain-sepolia.blockscout.com",
    },
  },
  testnet: true,
  // RainbowKit specific metadata - Simple globe icon
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Im0yIDEyaDIwbS0yMCAwYTEwIDEwIDAgMCAwIDIwIDBtLTIwIDAgYTEwIDEwIDAgMCAxIDIwIDBtLTEwLTEwdjIwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K",
  iconBackground: "#1a1a1a",
});

// Create connectors for wallets
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        rainbowWallet,
        walletConnectWallet,
        coinbaseWallet,
        injectedWallet,
      ],
    },
  ],
  {
    appName: 'Carrot Quest Platform',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo',
  }
);

export const config = createConfig({
  chains: [worldchainSepolia, mainnet],
  connectors,
  transports: {
    [worldchainSepolia.id]: http("https://worldchain-sepolia.g.alchemy.com/public"),
    [mainnet.id]: http(),
  },
});
