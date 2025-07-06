"use client";
import { MiniKit, SignMessageInput } from "@worldcoin/minikit-js";
import {
  useWriteContract,
  useReadContract,
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { mockQuests } from "@/lib/mocks/mock-quests";
import { Progress } from "./ui/progress";
import { Trophy, Coins, Users, Eye, Send, Copy } from "lucide-react";
import Image from "next/image";
import { hashSafeMessage } from "@safe-global/protocol-kit";
import { useState, useEffect } from "react";
import {
  saveQuestParticipation,
  hasUserParticipatedInQuest,
  saveQuestSubmission,
  hasUserSubmittedProofForQuest,
  type QuestParticipation,
  type QuestSubmission,
} from "@/lib/utils";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockSubmissions } from "@/lib/mocks/mock-submissions";
import Link from "next/link";
import { questContractAbi } from "@/abi/quest-contract-abi";
import { worldchainSepolia } from "@/config";

const sendQuestProofSchema = z.object({
  proofLink: z.string().min(2).max(100),
});

// Type for User struct from smart contract
interface User {
  walletAddress: string;
  username: string;
  submission: string;
  isParticipant: boolean;
}

export default function QuestCard({
  quest,
  user,
  username,
}: {
  quest: (typeof mockQuests)[0];
  user: any;
  username: string;
}) {
  const participationPercentage =
    (quest.currentParticipants ?? 0 / quest.maxParticipants) * 100;
  const spotsRemaining = quest.maxParticipants - (quest.currentParticipants ?? 0);
  const isAlmostFull = participationPercentage > 80;
  const isFull = participationPercentage >= 100;
  const [messageHash, setMessageHash] = useState<string | null>(null);
  const [hasParticipated, setHasParticipated] = useState<boolean>(false);
  const [hasSubmittedProof, setHasSubmittedProof] = useState<boolean>(false);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSendingPrize, setIsSendingPrize] = useState<boolean>(false);
  const [allParticipants, setAllParticipants] = useState<User[]>([]);
  const [contractParticipantCount, setContractParticipantCount] =
    useState<number>(0);

  const {
    writeContract,
    isPending: isWritePending,
    isSuccess,
    isError,
    data: transactionHash,
    error,
  } = useWriteContract();
  const { isConnected, address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const session = useSession();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: transactionHash,
    });

  // Debug session data
  useEffect(() => {
    console.log("Session data:", session.data);
    console.log("User wallet address:", session.data?.user?.walletAddress);
    console.log("Session status:", session.status);
    console.log("Wagmi connected:", isConnected);
    console.log("Wagmi address:", address);
    console.log("Wagmi chain:", chain);
  }, [session, isConnected, address, chain]);

  // Check authentication and wallet connection
  const isAuthenticated = !!session.data?.user?.walletAddress;
  const isCorrectNetwork = chain?.id === worldchainSepolia.id;
  const isReadyToInteract = isAuthenticated && isConnected && isCorrectNetwork;

  // Add network switching state for immediate UI feedback
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

  // Read contract functions
  const { data: participantCount } = useReadContract({
    abi: questContractAbi,
    address: quest.contractAddress as `0x${string}`,
    functionName: "getTotalParticipants",
    chainId: worldchainSepolia.id,
  });

  const { data: isUserParticipant } = useReadContract({
    abi: questContractAbi,
    address: quest.contractAddress as `0x${string}`,
    functionName: "isParticipant",
    args: [address as `0x${string}`],
    chainId: worldchainSepolia.id,
    query: {
      enabled: !!address, // Only run query if address is available
    },
  });

  const { data: contractOwner } = useReadContract({
    abi: questContractAbi,
    address: quest.contractAddress as `0x${string}`,
    functionName: "owner",
    chainId: worldchainSepolia.id,
  });

  const form = useForm<z.infer<typeof sendQuestProofSchema>>({
    resolver: zodResolver(sendQuestProofSchema),
    defaultValues: {
      proofLink: "",
    },
  });

  // Update contract participant count when it changes
  useEffect(() => {
    if (participantCount !== undefined) {
      setContractParticipantCount(Number(participantCount));
    }
  }, [participantCount]);

  // Check if user has already participated in this quest (using both ID and contract address)
  useEffect(() => {
    const localParticipation = hasUserParticipatedInQuest(
      quest.id.toString(),
      quest.contractAddress
    );
    const contractParticipation = isUserParticipant === true;

    setHasParticipated(localParticipation || contractParticipation || false);
  }, [quest.id, quest.contractAddress, isUserParticipant]);

  // Check if user has already submitted proof for this quest
  useEffect(() => {
    const hasSubmitted = hasUserSubmittedProofForQuest(
      quest.id.toString(),
      quest.contractAddress
    );
    setHasSubmittedProof(hasSubmitted);
  }, [quest.id, quest.contractAddress]);

  // Handle transaction success/error
  useEffect(() => {
    if (isSuccess && transactionHash) {
      console.log("Transaction successful:", transactionHash);
      toast.success("Transaction submitted successfully!");

      // Check if this was a join quest or submit proof transaction
      // We determine this by checking the current submitting state
      if (isSubmitting) {
        // This was a submit proof transaction
        const userSubmission: QuestSubmission = {
          questId: quest.id.toString(),
          questContractAddress: quest.contractAddress,
          proofUrl: "Transaction completed", // We can't access form data after reset
          messageHash: messageHash,
          transactionHash: transactionHash,
          submittedAt: new Date().toISOString(),
        };

        const saveSuccess = saveQuestSubmission(userSubmission);
        if (saveSuccess) {
          setHasSubmittedProof(true);
          toast.success("Proof submitted successfully!");
        } else {
          toast.error("Failed to save your submission. Please try again.");
        }
      } else if (isJoining) {
        // This was a join quest transaction
        const userParticipation: QuestParticipation = {
          questId: quest.id.toString(),
          questContractAddress: quest.contractAddress,
          messageHash: messageHash,
          verifyProof: null,
          transactionHash: transactionHash,
          joinedAt: new Date().toISOString(),
        };

        const saveSuccess = saveQuestParticipation(userParticipation);
        if (saveSuccess) {
          setHasParticipated(true);
          toast.success(
            "Quest joined successfully! Your participation has been saved."
          );
        } else {
          toast.error("Failed to save your participation. Please try again.");
        }
      }

      setIsJoining(false);
      setIsSubmitting(false);
    }
  }, [
    isSuccess,
    transactionHash,
    quest.id,
    quest.contractAddress,
    messageHash,
    isSubmitting,
    isJoining,
  ]);

  useEffect(() => {
    if (isError && error) {
      console.error("Transaction failed:", error);
      toast.error(
        `Transaction failed: ${error.message || "Please try again."}`
      );
      setIsJoining(false);
      setIsSubmitting(false);
    }
  }, [isError, error]);

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Transaction confirmed on blockchain!");
    }
  }, [isConfirmed]);

  /**
   * 1. JOIN QUEST FUNCTION
   * Calls the smart contract's joinQuest function
   * Requires: World ID authentication + Wallet connection + Correct network
   */
  const joinQuest = async (quest: (typeof mockQuests)[0]) => {
    // Prevent joining if already participated or quest is full
    if (hasParticipated || isFull) {
      toast.error(
        hasParticipated
          ? "You have already joined this quest!"
          : "Quest is full!"
      );
      return;
    }

    // Check if user is authenticated with World ID
    if (!isAuthenticated) {
      toast.error("Please authenticate with World ID first.");
      return;
    }

    // Check if wallet is connected
    if (!isConnected) {
      toast.error("Please connect your wallet first.");
      return;
    }

    // Check if on correct network
    if (!isCorrectNetwork) {
      toast.error("Please switch to World Chain Sepolia network.");
      setIsSwitchingNetwork(true);

      // Add timeout for network switching
      const networkSwitchTimeout = setTimeout(() => {
        setIsSwitchingNetwork(false);
        setIsJoining(false);
        toast.error("Network switching timed out. Please try again.");
      }, 10000); // 10 second timeout

      try {
        await switchChain({ chainId: worldchainSepolia.id });
        clearTimeout(networkSwitchTimeout);
        toast.success("Successfully switched to World Chain Sepolia!");
        setIsSwitchingNetwork(false);
      } catch (error) {
        clearTimeout(networkSwitchTimeout);
        console.error("Failed to switch network:", error);
        toast.error("Failed to switch network. Please try again.");
        setIsSwitchingNetwork(false);
        setIsJoining(false);
        return;
      }
    }

    setIsJoining(true);

    try {
      const contractAddressOfTheQuest = quest.contractAddress;

      // Validate required parameters
      if (!address) {
        toast.error("Wallet address not found. Please reconnect your wallet.");
        setIsJoining(false);
        return;
      }

      if (!contractAddressOfTheQuest) {
        toast.error("Quest contract address not found.");
        setIsJoining(false);
        return;
      }

      if (!username) {
        toast.error("Username not found. Please re-authenticate.");
        setIsJoining(false);
        return;
      }

      console.log("Quest joining validation passed:", {
        address,
        contractAddress: contractAddressOfTheQuest,
        username,
        maxParticipants: quest.maxParticipants,
      });

      // 1. Sign message for quest participation
      const messageToSign: SignMessageInput = {
        message: `You are confirming that you are joining the "${quest.title}" of ${quest.organization}. This action does not mean any money transaction.`,
      };

      const { finalPayload: signMessagePayload }: any =
        await MiniKit.commandsAsync.signMessage(messageToSign);

      if (signMessagePayload.status === "success") {
        const userMessageHash = hashSafeMessage(messageToSign.message);
        setMessageHash(userMessageHash);
      } else {
        toast.error("Message signing failed!");
        setIsJoining(false);
        return;
      }

      // 2. Call smart contract joinQuest function
      console.log("Initiating writeContract with params:", {
        abi: questContractAbi,
        address: contractAddressOfTheQuest,
        functionName: "joinQuest",
        args: [BigInt(quest.maxParticipants), username],
        chainId: worldchainSepolia.id,
      });

      toast.info("Transaction initiated. Please confirm in your wallet.");

      // Use wagmi v2 API - writeContract doesn't return a promise
      writeContract({
        abi: questContractAbi,
        address: contractAddressOfTheQuest as `0x${string}`,
        functionName: "joinQuest",
        args: [BigInt(quest.maxParticipants), username],
        chainId: worldchainSepolia.id,
      });
    } catch (error) {
      console.error("Error joining quest:", error);
      toast.error("Failed to join quest. Please try again.");
    }
  };

  /**
   * 2. SUBMIT QUEST PROOF FUNCTION
   * Calls the smart contract's addSubmission function
   * Requires: World ID authentication + Wallet connection + Correct network
   */
  async function onSubmitProofLink(
    values: z.infer<typeof sendQuestProofSchema>
  ) {
    setIsSubmitting(true);

    try {
      // Check if user is authenticated with World ID
      if (!isAuthenticated) {
        toast.error("Please authenticate with World ID first.");
        setIsSubmitting(false);
        return;
      }

      // Check if wallet is connected
      if (!isConnected) {
        toast.error("Please connect your wallet first.");
        setIsSubmitting(false);
        return;
      }

      // Check if user has participated in the quest
      if (!hasParticipated) {
        toast.error("You must join the quest before submitting proof.");
        setIsSubmitting(false);
        return;
      }

      // Check if on correct network
      if (!isCorrectNetwork) {
        toast.error("Please switch to World Chain Sepolia network.");
        try {
          await switchChain({ chainId: worldchainSepolia.id });
        } catch (error) {
          console.error("Failed to switch network:", error);
          setIsSubmitting(false);
          return;
        }
      }

      // 1. Sign message for proof submission
      const messageToSign: SignMessageInput = {
        message: `You are confirming that you are sending the proof for the "${quest.title}" of ${quest.organization}. This action does not mean any money transaction.`,
      };

      const { finalPayload: signMessagePayload }: any =
        await MiniKit.commandsAsync.signMessage(messageToSign);

      if (signMessagePayload.status === "error") {
        console.error("Message signing failed:", signMessagePayload);
        toast.error("Error signing message!");
        setIsSubmitting(false);
        return;
      }

      const userMessageHash = hashSafeMessage(messageToSign.message);
      setMessageHash(userMessageHash);

      // 2. Call smart contract addSubmission function
      writeContract({
        abi: questContractAbi,
        address: quest.contractAddress as `0x${string}`,
        functionName: "addSubmission",
        args: [values.proofLink],
        chainId: worldchainSepolia.id,
      });

      // Success will be handled by useEffect hooks
      toast.info("Proof submission initiated. Please confirm in your wallet.");
      form.reset();
    } catch (error) {
      console.error("Error submitting proof:", error);
      toast.error("Failed to submit proof. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * 3. SEND PRIZE FUNCTION
   * Calls the smart contract's distributeQuestPrizes function
   * NOTE: This function can only be called by the contract owner
   */
  const sendPrize = async (submission: (typeof mockSubmissions)[0]) => {
    setIsSendingPrize(true);

    try {
      // Check if user is authenticated with World ID
      if (!isAuthenticated) {
        toast.error("Please authenticate with World ID first.");
        setIsSendingPrize(false);
        return;
      }

      // Check if wallet is connected
      if (!isConnected) {
        toast.error("Please connect your wallet first.");
        setIsSendingPrize(false);
        return;
      }

      // Check if the current user is the contract owner
      if (
        contractOwner &&
        typeof contractOwner === "string" &&
        contractOwner.toLowerCase() !== address?.toLowerCase()
      ) {
        toast.error("Only the contract owner can distribute prizes.");
        setIsSendingPrize(false);
        return;
      }

      // Check if on correct network
      if (!isCorrectNetwork) {
        toast.error("Please switch to World Chain Sepolia network.");
        try {
          await switchChain({ chainId: worldchainSepolia.id });
        } catch (error) {
          console.error("Failed to switch network:", error);
          setIsSendingPrize(false);
          return;
        }
      }

      // Calculate prize amount per participant
      const prizePerParticipant = quest.poolPrize / quest.maxParticipants;
      const prizeAmountInWei = BigInt(
        Math.floor(prizePerParticipant * 10 ** 18)
      ); // Convert to wei

      // Call smart contract distributeQuestPrizes function
      writeContract({
        abi: questContractAbi,
        address: quest.contractAddress as `0x${string}`,
        functionName: "distributeQuestPrizes",
        args: [
          submission.walletAddress as `0x${string}`,
          prizeAmountInWei,
          true,
        ],
        chainId: worldchainSepolia.id,
      });

      toast.info(
        "Prize distribution initiated. Please confirm in your wallet."
      );
    } catch (error) {
      console.error("Error sending prize:", error);
      toast.error("Failed to send prize. Please try again.");
    } finally {
      setIsSendingPrize(false);
    }
  };

  /**
   * 4. GET ALL PARTICIPANTS FUNCTION
   * Retrieves all participants from the smart contract
   */
  const getAllParticipants = async () => {
    try {
      const participants: User[] = [];

      // Note: Since Solidity doesn't have a built-in way to iterate over mappings,
      // we would need to maintain a separate array of participant addresses in the contract
      // For now, we'll use the mock data and show how it would work with the contract

      // This is a limitation of the current contract design
      // To get all participants, you would need to modify the contract to include:
      // - An array of participant addresses
      // - A function to return all participants

      console.log("Total participants from contract:", participantCount);

      // For demonstration, we'll use the mock submissions that match this quest
      const questParticipants = mockSubmissions.filter(
        (submission) =>
          submission.questContractAddress === quest.contractAddress
      );

      setAllParticipants(
        questParticipants.map((sub) => ({
          walletAddress: sub.walletAddress,
          username: sub.username,
          submission: sub.proofUrl,
          isParticipant: true,
        }))
      );
    } catch (error) {
      console.error("Error getting participants:", error);
      toast.error("Failed to get participants.");
    }
  };

  // Load participants when component mounts
  useEffect(() => {
    getAllParticipants();
  }, [quest.contractAddress]);

  return (
    <Card className="group w-full max-w-sm rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={quest.organizationLogo || "/placeholder.svg"}
              alt={quest.organization}
              width={35}
              height={35}
            />
            <div>
              <h6 className="font-semibold text-gray-900">
                {quest.organization}
              </h6>
              <p className="text-xs text-gray-500">Verified Company</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            <b> {quest.title}</b>
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {quest.description}
          </p>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span className="font-semibold text-gray-900">Prize Pool</span>
          </div>
          <div className="flex items-center gap-1">
            <Coins className="w-4 h-4 text-yellow-600" />
            <span className="font-bold text-lg text-gray-900">
              {quest.poolPrize} {quest.prizeCurrency}
            </span>
          </div>
        </div>

        {quest.maxParticipants > 0 && (
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Prize per Participant</span>
            </div>
            <span className="font-semibold text-gray-800">
              {(quest.poolPrize / quest.maxParticipants).toFixed(2)}{" "}
              {quest.prizeCurrency}
            </span>
          </div>
        )}

        <div className="space-y-2">
          {hasParticipated && (
            <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">
                You have joined this quest
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Participants</span>
            </div>
            <span className="font-medium text-gray-900">
              {contractParticipantCount || quest.currentParticipants}/
              {quest.maxParticipants}
            </span>
          </div>

          <Progress value={participationPercentage} className="h-2" />

          <div className="flex justify-between items-center text-xs">
            <span
              className={`font-medium ${
                isAlmostFull ? "text-orange-600" : "text-gray-500"
              }`}
            >
              {isFull ? "Quest Full" : `${spotsRemaining} spots remaining`}
            </span>
            <span className="text-gray-500">
              {participationPercentage.toFixed(0)}% filled
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          onClick={() => joinQuest(quest)}
          disabled={
            isJoining ||
            isWritePending ||
            hasParticipated ||
            isFull ||
            !isReadyToInteract ||
            isSwitchingNetwork
          }
          className="w-full !bg-gradient-to-r !from-yellow-500 !to-orange-500 border py-2 !text-white font-semibold rounded-lg flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!isAuthenticated
            ? "Authenticate with World ID"
            : !isConnected
            ? "Connect Wallet"
            : isSwitchingNetwork
            ? "Switching Network..."
            : !isCorrectNetwork
            ? "Switch to World Chain Sepolia"
            : isJoining || isWritePending
            ? "Joining..."
            : hasParticipated
            ? "Already Joined"
            : isFull
            ? "Quest Complete"
            : "Join Quest"}
        </Button>

        {hasParticipated && (
          <Drawer>
            <DrawerTrigger className="flex justify-center items-center gap-2 w-full border border-gray-200 rounded-lg p-2">
              <Send className="w-4 h-4" />
              <h6>Send Proof</h6>
            </DrawerTrigger>
            <DrawerContent className="flex flex-col justify-center items-center p-6">
              <DrawerHeader className="">
                <DrawerTitle className="flex flex-col justify-center items-center gap-2">
                  <div className="flex justify-center items-center gap-2 text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-2">
                    <Send className="w-6 h-6" />
                  </div>{" "}
                  Send Your Proof For "{quest.title}" Quest Of{" "}
                  {quest.organization}
                </DrawerTitle>
                <DrawerDescription>
                  Your proof will be sent to the organization for verification.
                  Once verified, you will receive your prize (min.{" "}
                  {(quest.poolPrize / quest.maxParticipants).toFixed(2)}{" "}
                  {quest.prizeCurrency}).
                </DrawerDescription>
              </DrawerHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitProofLink)}
                  className="space-y-8 my-4"
                >
                  <FormField
                    control={form.control}
                    name="proofLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Proof Link*
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/proof (image URL)"
                            className="px-4 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-gray-500">
                          Add a link of screenshot that includes your World App
                          username or/and your World App wallet address
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className="w-full !bg-gradient-to-r !from-yellow-500 !to-orange-500 border py-2 !text-white font-semibold rounded-lg flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                  >
                    {isSubmitting || isWritePending
                      ? "Submitting..."
                      : "Send Proof"}
                  </Button>
                </form>
              </Form>
            </DrawerContent>
          </Drawer>
        )}

        {hasParticipated && (
          <Drawer>
            <DrawerTrigger className="flex justify-center items-center gap-2 w-full border border-gray-200 rounded-lg p-2">
              <Eye className="w-4 h-4" />
              <h6>See Details</h6>
            </DrawerTrigger>
            <DrawerContent className="w-screen max-w-none rounded-none sm:rounded-2xl p-0 sm:p-6">
              <DrawerHeader>
                <DrawerTitle className="flex flex-col justify-center items-center gap-2">
                  <div className="flex justify-center items-center gap-2 text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-2">
                    <Eye className="w-6 h-6" />
                  </div>
                  Quest Details (Full DEMO)
                </DrawerTitle>
                <DrawerDescription>
                  {" "}
                  Test all the functionalities of the Quests here. Available for
                  ETHGlobal Cannes on testnet only.
                </DrawerDescription>
              </DrawerHeader>
              <Tabs
                defaultValue="individual"
                className="w-full flex justify-center items-center"
              >
                <TabsList className="w-[80%] mx-auto flex justify-center items-center gap-4">
                  <TabsTrigger className=" " value="individual">
                    Individual
                  </TabsTrigger>
                  <TabsTrigger value="organization">Organization</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="individual"
                  className="max-h-[400px] w-[80%] mx-auto overflow-y-auto py-4"
                >
                  <h6 className="text-sm font-medium">Quest ID</h6>
                  <p className="text-sm text-gray-500">{quest.id}</p>
                  <br />
                  <h6 className="text-sm font-medium">
                    Quest Contract Address
                  </h6>
                  <p className="text-sm text-gray-500">
                    {quest.contractAddress}
                  </p>
                  <br />
                  <h6 className="text-sm font-medium">Authentication Status</h6>
                  <p className="text-sm text-gray-500">
                    {isAuthenticated
                      ? "✅ Authenticated via World ID"
                      : "❌ Not Authenticated"}
                  </p>
                  <br />
                  <h6 className="text-sm font-medium">Wallet Connection</h6>
                  <p className="text-sm text-gray-500">
                    {isConnected
                      ? `✅ Connected: ${address?.slice(
                          0,
                          6
                        )}...${address?.slice(-4)}`
                      : "❌ Not Connected"}
                  </p>
                  <br />
                  <h6 className="text-sm font-medium">Network</h6>
                  <p className="text-sm text-gray-500">
                    {isCorrectNetwork
                      ? "✅ World Chain Sepolia"
                      : isConnected
                      ? `❌ Wrong Network: ${chain?.name}`
                      : "❌ Not Connected"}
                  </p>
                  <br />
                  <h6 className="text-sm font-medium">Contract Participants</h6>
                  <p className="text-sm text-gray-500">
                    {contractParticipantCount}
                  </p>
                  <br />
                  <h6 className="text-sm font-medium">Joined At</h6>
                  <p className="text-sm text-gray-500">
                    {hasParticipated
                      ? new Date().toLocaleDateString()
                      : "Not joined yet"}
                  </p>
                  <br />
                </TabsContent>
                <TabsContent className="py-4" value="organization">
                  <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                    {allParticipants.map((participant) => (
                      <div
                        key={participant.walletAddress}
                        className="border border-gray-200 rounded-lg p-3 flex flex-col gap-2"
                      >
                        <p>
                          <b>Username:</b> {participant.username}
                        </p>
                        <p>
                          <b>Wallet Address:</b>{" "}
                          {participant.walletAddress.slice(0, 6)}...
                          {participant.walletAddress.slice(-4)}
                        </p>
                        <p>
                          <b>Proof Link:</b>{" "}
                          <Link href={participant.submission} target="_blank">
                            <span className="text-sm text-blue-500 underline hover:text-blue-600">
                              {participant.submission}
                            </span>
                          </Link>
                        </p>
                        <div className="flex justify-between items-center">
                          {contractOwner &&
                          typeof contractOwner === "string" &&
                          contractOwner.toLowerCase() ===
                            address?.toLowerCase() ? (
                            <Button
                              onClick={() =>
                                sendPrize({
                                  id: "1",
                                  questId: quest.id.toString(),
                                  username: participant.username,
                                  walletAddress: participant.walletAddress,
                                  proofUrl: participant.submission,
                                  questContractAddress: quest.contractAddress,
                                  submittedAt: new Date().toISOString(),
                                  status: "pending",
                                })
                              }
                              disabled={isSendingPrize || isWritePending}
                              className="w-full !bg-gradient-to-r !from-yellow-500 !to-orange-500 border py-2 !text-white font-semibold rounded-lg flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSendingPrize || isWritePending
                                ? "Sending..."
                                : "Send Prize"}
                            </Button>
                          ) : (
                            <div className="w-full text-center p-2 bg-gray-100 rounded-lg text-sm text-gray-500">
                              Only contract owner can send prizes
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </DrawerContent>
          </Drawer>
        )}
      </CardFooter>
    </Card>
  );
}
