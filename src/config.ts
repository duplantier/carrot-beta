import { defineChain } from "viem";
import { mainnet } from "wagmi/chains";

export const worldChainSepolia = defineChain({
  id: 4801,
  name: "World Chain Sepolia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://worldchain-sepolia.g.alchemy.com/public"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://worldchain-sepolia.explorer.alchemy.com",
    },
  },
});

export const config = {
  chains: [mainnet, worldChainSepolia],
  transports: {
    [mainnet.id]: "http",
    [worldChainSepolia.id]: "http",
  },
};
