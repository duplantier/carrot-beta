"use client";
import {
  MiniKit,
  SignMessageInput,
  VerificationLevel,
  VerifyCommandInput,
} from "@worldcoin/minikit-js";
import { useWriteContract } from "wagmi";
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
  type QuestParticipation,
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

const sendQuestProofSchema = z.object({
  proofLink: z.string().min(2).max(100),
});

const verifyPayload: VerifyCommandInput = {
  action: "join-quest",
  verification_level: VerificationLevel.Device,
};

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
    (quest.currentParticipants / quest.maxParticipants) * 100;
  const spotsRemaining = quest.maxParticipants - quest.currentParticipants;
  const isAlmostFull = participationPercentage > 80;
  const isFull = participationPercentage >= 100;
  const [messageHash, setMessageHash] = useState<string | null>(null);
  const [verifyProof, setVerifyProof] = useState<string | null>(null);
  const [hasParticipated, setHasParticipated] = useState<boolean>(false);
  const [isJoining, setIsJoining] = useState<boolean>(false);

  const form = useForm<z.infer<typeof sendQuestProofSchema>>({
    resolver: zodResolver(sendQuestProofSchema),
    defaultValues: {
      proofLink: "",
    },
  });

  async function onSubmitProofLink(
    values: z.infer<typeof sendQuestProofSchema>
  ) {
    console.log(values);
    // 1. Verify
    if (!MiniKit.isInstalled()) {
      toast.error("World App is not installed!");
      return;
    }

    const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

    if (finalPayload.status === "error") {
      toast.error("Error verifying proof!");
      return;
    }

    const verifyResponse = await fetch("/api/verify-proof", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const verifyResponseJson = await verifyResponse.json();

    if (verifyResponseJson.status === 200) {
      toast.success("Proof sent successfully!");
    } else {
      toast.error("Failed to send proof!");
    }

    // 2. Sign message
    const messageToSign: SignMessageInput = {
      message: `You are confirming that you are sending the proof for the "${quest.title}" of ${quest.organization}. This action does not mean any money transaction.`,
    };

    const { finalPayload: signMessagePayload }: any =
      await MiniKit.commandsAsync.signMessage(messageToSign);

    if (signMessagePayload.status === "error") {
      toast.error("Error signing message!");
      return;
    }

    const userMessageHash = hashSafeMessage(messageToSign.message);
    setMessageHash(userMessageHash);

    // 3. Interact with the smart contract address of the quest
    const tx = writeContract({
      abi: [],
      address: quest.contractAddress as `0x${string}`,
      functionName: "submitProof",
      args: [user.walletAddress, values.proofLink],
    });

    console.log("Transaction", tx);
  }

  const { writeContract } = useWriteContract();

  // Check if user has already participated in this quest
  useEffect(() => {
    setHasParticipated(hasUserParticipatedInQuest(quest.id.toString()));
  }, [quest.id]);

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

    setIsJoining(true);

    try {
      const contractAddressOfTheQuest = quest.contractAddress;
      // 1. Verify
      if (!MiniKit.isInstalled()) {
        toast.error("World App is not installed!");
        setIsJoining(false);
        return;
      }
      // World App will open a drawer prompting the user to confirm the operation, promise is resolved once user confirms or cancels
      const { finalPayload } = await MiniKit.commandsAsync.verify(
        verifyPayload
      );
      if (finalPayload.status === "error") {
        return console.log("Error payload", finalPayload);
      }

      // Verify the proof in the backend
      const verifyResponse = await fetch("/api/verify-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload, // Parses only the fields we need to verify
          action: "join-quest",
        }),
      });

      // TODO: Handle Success!
      const verifyResponseJson = await verifyResponse.json();
      if (verifyResponseJson.status === 200) {
        toast.success("Quest joined successfully!");
        const userVerifyProof = verifyResponseJson.verifyRes.proof;
        setVerifyProof(userVerifyProof);
      }

      // 2. Sign message
      const messageToSign: SignMessageInput = {
        message: `You are confirming that you are joining the "${quest.title}" of ${quest.organization}. This action does not mean any money transaction.`,
      };

      const { finalPayload: signMessagePayload }: any =
        await MiniKit.commandsAsync.signMessage(messageToSign);

      if (signMessagePayload.status === "success") {
        const userMessageHash = hashSafeMessage(messageToSign.message);
        setMessageHash(userMessageHash);
      }

      // 3. Interact with the smart contract address of the quest
      // 3.1. Send user's walletAddress
      // 3.2. Send username
      // 3.2. Send maxParticipants (will be used to check if the quest is full)

      // 4. If interaction is successful, update the currentParticipants + 1
      // 4.1. Show the returned hash, etc.

      const tx = writeContract({
        abi: questContractAbi as any,
        address: contractAddressOfTheQuest as `0x${string}`,
        functionName: "joinQuest",
        args: [user.walletAddress, quest.maxParticipants, username],
      });

      console.log("Transaction", tx);

      // 5. Save the user's participation in a cookie as an object
      const userParticipation: QuestParticipation = {
        questId: quest.id.toString(),
        questContractAddress: quest.contractAddress,
        messageHash: messageHash,
        verifyProof: verifyProof,
        transactionHash: "test-transaction-hash",
        joinedAt: new Date().toISOString(),
      };

      // 6. Save the user's participation in a cookie
      const saveSuccess = saveQuestParticipation(userParticipation);

      if (saveSuccess) {
        setHasParticipated(true);
        toast.success(
          "Quest joined successfully! Your participation has been saved."
        );
      } else {
        toast.error("Failed to save your participation. Please try again.");
      }
    } catch (error) {
      console.error("Error joining quest:", error);
      toast.error("Failed to join quest. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const acceptSubmission = (submission: (typeof mockSubmissions)[0]) => {
    console.log("Accepting submission", submission);
  };

  const sendPrize = (submission: (typeof mockSubmissions)[0]) => {
    console.log("Sending prize to", submission);
  };

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
              {quest.currentParticipants}/{quest.maxParticipants}
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
          disabled={isJoining || hasParticipated || isFull}
          className="w-full !bg-gradient-to-r !from-yellow-500 !to-orange-500 border py-2 !text-white font-semibold rounded-lg flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isJoining
            ? "Joining..."
            : hasParticipated
            ? "Already Joined"
            : isFull
            ? "Quest Complete"
            : "Join Quest"}
        </Button>

        {!hasParticipated && (
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
                          Add a link of screenshat that includes your World App
                          username or/and your World App wallet address
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className="w-full !bg-gradient-to-r !from-yellow-500 !to-orange-500 border py-2 !text-white font-semibold rounded-lg flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isJoining || hasParticipated || isFull}
                  >
                    Send Proof
                  </Button>
                </form>
              </Form>
            </DrawerContent>
          </Drawer>
        )}

        {!hasParticipated && (
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
                  className="max-h-[400px] overflow-y-auto py-4"
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
                  <h6 className="text-sm font-medium">Verify Proof</h6>
                  <p className="text-sm text-gray-500">{verifyProof}</p>
                  <br />
                  <h6 className="text-sm font-medium">Signed Message Hash</h6>
                  <p className="text-sm text-gray-500">{messageHash}</p>
                  <br />
                  <h6 className="text-sm font-medium">TX</h6>
                  <p className="text-sm text-gray-500">0x34dc3a...</p>
                  <br />
                  <h6 className="text-sm font-medium">Joined At</h6>
                  <p className="text-sm text-gray-500">2025-01-01</p>
                  <br />
                </TabsContent>
                <TabsContent className="py-4" value="organization">
                  <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                    {mockSubmissions.map(
                      (submission) =>
                        submission.questContractAddress ===
                          quest.contractAddress && (
                          <div
                            key={submission.id}
                            className="border border-gray-200 rounded-lg p-3 flex flex-col gap-2"
                          >
                            <p>
                              <b>Username:</b> {submission.username}
                            </p>
                            <p>
                              <b>Wallet Address:</b>{" "}
                              {submission.walletAddress.slice(0, 6)}...
                              {submission.walletAddress.slice(-4)}
                            </p>
                            <p>
                              <b>Proof Link:</b>{" "}
                              <Link href={submission.proofLink} target="_blank">
                                <span className="text-sm text-blue-500 underline hover:text-blue-600">
                                  {submission.proofLink}
                                </span>
                              </Link>
                            </p>
                            <div className="flex justify-between items-center">
                              <Button
                                onClick={() => acceptSubmission(submission)}
                                className="w-[50%] !bg-gradient-to-r !from-yellow-500 !to-orange-500 border py-2 !text-white font-semibold rounded-lg flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Accept
                              </Button>
                              <Button
                                onClick={() => sendPrize(submission)}
                                className="w-[50%] !bg-gradient-to-r !from-yellow-500 !to-orange-500 border py-2 !text-white font-semibold rounded-lg flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Send Prize
                              </Button>
                            </div>
                          </div>
                        )
                    )}
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
