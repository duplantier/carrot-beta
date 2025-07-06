export const mockQuests = [
  {
    id: "1",
    title: "ChainLink Announcement",
    description: "Share ChainLink's latest announcement on social media",
    organization: "ChainLink",
    organizationLogo: "/chainlink-logo.svg",
    poolPrize: 100,
    prizeCurrency: "ETH",
    maxParticipants: 10,
    contractAddress: "0xFb5d825aF1Cedd96b995Eba9D125B4b89F8314a2", // Updated to new fixed contract
    requirements: ["Follow @chainlink on Twitter", "Retweet the announcement"],
    category: "Social Media",
    difficulty: "Easy",
    timeToComplete: "5 minutes",
    tags: ["ChainLink", "Social", "Announcement"],
  },
  {
    id: 15,
    type: "join_community",
    title: "Join the Worldcoin Discord",
    contractAddress: "0x907ed4a77B9a1503BF4dBC85944Ad3CF6C756397", // Contract 1
    organization: "World",
    organizationLogo: "/world-logo.jpg",
    poolPrize: 50,
    prizeCurrency: "WLD",
    maxParticipants: 200,
    currentParticipants: 120,
    description:
      "Join our official Discord server and introduce yourself in the #introductions channel. Please include your World App username or World App wallet address as proof of quest completion in your submission.",
  },
  {
    id: 16,
    type: "tutorial_creation",
    title: "Create a World ID Integration Tutorial",
    contractAddress: "0xFb5d825aF1Cedd96b995Eba9D125B4b89F8314a2", // Updated to new fixed contract
    organization: "World",
    organizationLogo: "/world-logo.jpg",
    poolPrize: 0.05,
    prizeCurrency: "ETH",
    maxParticipants: 10,
    currentParticipants: 1,
    description:
      "Develop a step-by-step tutorial (video or written) on how to integrate World ID into a simple web app. Please include your World App username or World App wallet address as proof of quest completion in your submission.",
  },
  {
    id: 17,
    type: "governance_vote",
    title: "Participate in Worldcoin Governance",
    contractAddress: "0xeD05437830F2d006DE354b988F89Dc56c380806E", // Contract 3
    organization: "World",
    organizationLogo: "/world-logo.jpg",
    poolPrize: 120,
    prizeCurrency: "USDC",
    maxParticipants: 75,
    currentParticipants: 30,
    description:
      "Cast your vote on the latest Worldcoin governance proposal and share your reasoning in our forum. Please include your World App username or World App wallet address as proof of quest completion in your submission.",
  },
  {
    id: 6,
    type: "quote_tweet",
    title: "Quote A Tweet",
    contractAddress: "0x22FBBbbC04cC241967fF3bBc9BE624dDcc7c8e83", // Contract 4
    organization: "World",
    organizationLogo: "/world-logo.jpg",
    poolPrize: 100,
    prizeCurrency: "WLD",
    maxParticipants: 50,
    currentParticipants: 10,
    description:
      "Quote the tweet, prove it, and earn up to 2 WLD. Please include your World App username or World App wallet address as proof of quest completion in your submission.",
  },
  {
    id: 1,
    type: "quote_tweet",
    title: "Amplify Our Latest Announcement",
    contractAddress: "0x684112717a2c2CB3a2DB05988CFBA885046908BD", // Contract 5
    organization: "ChainLink Labs",
    organizationLogo: "/chainlink-logo.svg",
    poolPrize: 150,
    prizeCurrency: "WLD",
    maxParticipants: 100,
    currentParticipants: 45,
    description:
      "Quote our latest tweet about the new protocol upgrade, add your insights, and tag 3 friends. Prove it with a screenshot! Please include your World App username or World App wallet address as proof of quest completion in your submission.",
  },
  {
    id: 2,
    type: "referral",
    title: "Invite New Users to Our Community",
    contractAddress: "0xa02f35c0998515220b9832AD2E1e3b2fdb267745", // Contract 6
    organization: "Solana Foundation",
    organizationLogo: "/solana-logo.svg",
    poolPrize: 300,
    prizeCurrency: "WLD",
    maxParticipants: 30,
    currentParticipants: 12,
    description:
      "Refer 5 new active members to our official Telegram group. Each successful referral earns you a ticket into the prize draw! Please include your World App username or World App wallet address as proof of quest completion in your submission.",
  },
  {
    id: 3,
    type: "quiz",
    title: "Test Your Blockchain Knowledge",
    contractAddress: "0x755bfb308CAbE3980C0228dEB07e0EE8Af2D53aE", // Contract 7
    organization: "Ethereum Foundation",
    organizationLogo: "/ethereum-foundation-logo.svg",
    poolPrize: 0.3,
    prizeCurrency: "ETH",
    maxParticipants: 200,
    currentParticipants: 110,
    description:
      "Complete our 10-question quiz on blockchain fundamentals and our project's unique features. Score 80% or higher to qualify! Please include your World App username or World App wallet address as proof of quest completion in your submission.",
  },
  {
    id: 4,
    type: "video_creation",
    title: "Create a Short Explainer Video",
    contractAddress: "0x2dBfF5b656115981D869c3Dc828AcE866025957e", // Contract 8
    organization: "Avalanche Network",
    organizationLogo: "/avalanche-logo.svg",
    poolPrize: 750,
    prizeCurrency: "USDC",
    maxParticipants: 15,
    currentParticipants: 3,
    description:
      "Produce a 1-3 minute video explaining a key feature of our platform or a recent development. Share it on YouTube/TikTok and tag us! Please include your World App username or World App wallet address as proof of quest completion in your submission.",
  },
  {
    id: 5,
    type: "feedback_submission",
    title: "Give Feedback on Our Beta DApp",
    contractAddress: "0x610FB9e04605367E5016bd07b4DcB965D5616a76", // Contract 9
    organization: "Oasis Network",
    organizationLogo: "/oasis-logo.svg",
    poolPrize: 0.4,
    prizeCurrency: "ETH",
    maxParticipants: 40,
    currentParticipants: 25,
    description:
      "Try out our beta DApp and provide detailed feedback on any bugs you find, suggestions for UX improvements, or ideas for new features using our dedicated feedback form. Please include your World App username or World App wallet address as proof of quest completion in your submission.",
  },
  {
    id: 7,
    type: "swap_challenge",
    title: "Execute a Swap on 1inch",
    contractAddress: "0x76AD19634e3C029E29ef366a589EB7B4856eA6ba", // Contract 10
    organization: "1inch Network",
    organizationLogo: "/1inch-logo.png",
    poolPrize: 120,
    prizeCurrency: "USDC",
    maxParticipants: 80,
    currentParticipants: 30,
    description:
      "Perform a token swap on the 1inch dApp, share your transaction hash, and explain your strategy. Please include your World App username or World App wallet address as proof of quest completion in your submission.",
  },
  {
    id: 8,
    type: "research_summary",
    title: "Summarize Our Latest AI Research",
    contractAddress: "0xbC4d8FE8B24d582023b0f9aC333f249dA778e1Be", // Contract 11
    organization: "ASI Alliance",
    organizationLogo: "/asi-alliance-logo.png",
    poolPrize: 0.2,
    prizeCurrency: "ETH",
    maxParticipants: 25,
    currentParticipants: 5,
    description:
      "Read our recent research paper on decentralized AI and write a concise summary (min. 300 words). Please include your World App username or World App wallet address as proof of quest completion in your submission.",
  },
  {
    id: 9,
    type: "data_provider_challenge",
    title: "Explore Flare's Data Oracles",
    contractAddress: "0x44d04aD1bc74D8Fcce333c18921e64435fD24a55", // Contract 12
    organization: "Flare Network",
    organizationLogo: "/flare-network-logo.png",
    poolPrize: 180,
    prizeCurrency: "WLD",
    maxParticipants: 60,
    currentParticipants: 20,
    description:
      "Interact with a data oracle on Flare, explain its utility, and share your findings on social media. Please include your World App username or World App wallet address as proof of quest completion in your submission.",
  },
  {
    id: 10,
    type: "privacy_advocacy",
    title: "Champion Digital Privacy",
    contractAddress: "0xd59a14464dD3c9db1F6C5106a009dA682698649B", // Contract 13
    organization: "Self Protocol",
    organizationLogo: "/self-protocol-logo.png",
    poolPrize: 220,
    prizeCurrency: "USDC",
    maxParticipants: 45,
    currentParticipants: 15,
    description:
      "Create a compelling social media post advocating for digital privacy using Self Protocol's features. Please include your World App username or World App wallet address as proof of quest completion in your submission.",
  },
  {
    id: 11,
    type: "zk_explainer",
    title: "Demystify Zircuit's ZK-Rollup",
    contractAddress: "0xBCd01A7fDda6b937181B56C42429A0Ad3af91Dfb", // Contract 14
    organization: "Zircuit",
    organizationLogo: "/zircuit-logo.png",
    poolPrize: 0.1,
    prizeCurrency: "ETH",
    maxParticipants: 10,
    currentParticipants: 2,
    description:
      "Produce a simple, engaging explanation (video or article) of how Zircuit's ZK-rollup technology works. Please include your World App username or World App wallet address as proof of quest completion in your submission.",
  },
  {
    id: 12,
    type: "wallet_onboarding",
    title: "Onboard a Friend to Walrus Wallet",
    contractAddress: "0x3b1FD9Cb173924123Dc55284a79d675a38d0BC11", // Contract 15
    organization: "Walrus Wallet",
    organizationLogo: "/walrus-logo.png",
    poolPrize: 100,
    prizeCurrency: "WLD",
    maxParticipants: 70,
    currentParticipants: 25,
    description:
      "Help a friend set up their first Walrus Wallet and make a test transaction. Provide proof of onboarding. Please include your World App username or World App wallet address as proof of quest completion in your submission.",
  },
  {
    id: 13,
    type: "usdc_adoption",
    title: "Share Your USDC Use Case",
    contractAddress: "0xC591071839BfC4Fbb6bbd75F0C4074153a6e2084", // Original contract (reused)
    organization: "Circle",
    organizationLogo: "/circle-logo.png",
    poolPrize: 90,
    prizeCurrency: "USDC",
    maxParticipants: 150,
    currentParticipants: 80,
    description:
      "Describe how you use USDC in your daily life or crypto activities in a short tweet or forum post. Please include your World App username or World App wallet address as proof of quest completion in your submission.",
  },
  {
    id: 14,
    type: "nft_showcase",
    title: "Showcase Your Flow NFT",
    contractAddress: "0xC591071839BfC4Fbb6bbd75F0C4074153a6e2084", // Original contract (reused)
    organization: "Flow Blockchain",
    organizationLogo: "/flow-logo.png",
    poolPrize: 170,
    prizeCurrency: "WLD",
    maxParticipants: 55,
    currentParticipants: 18,
    description:
      "Share your favorite NFT on the Flow blockchain, explain why you love it, and tag us! Please include your World App username or World App wallet address as proof of quest completion in your submission.",
  },
];
