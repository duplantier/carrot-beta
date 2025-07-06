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
import { Button } from "./ui/button";
import { mockQuests } from "@/lib/mock-quests";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Trophy, Coins, Users } from "lucide-react";
import Image from "next/image";
import Safe, { hashSafeMessage } from "@safe-global/protocol-kit";
import { useState } from "react";

const verifyPayload: VerifyCommandInput = {
  action: "join-quest", // This is your action ID from the Developer Portal
  verification_level: VerificationLevel.Device, // Orb | Device
};

export default function QuestCard({
  quest,
  user,
}: {
  quest: (typeof mockQuests)[0];
  user: any;
}) {
  const participationPercentage =
    (quest.currentParticipants / quest.maxParticipants) * 100;
  const spotsRemaining = quest.maxParticipants - quest.currentParticipants;
  const isAlmostFull = participationPercentage > 80;
  const isFull = participationPercentage >= 100;
  const [messageHash, setMessageHash] = useState<string | null>(null);
  const [verifyProof, setVerifyProof] = useState<string | null>(null);

  const { writeContract } = useWriteContract();

  const joinQuest = async (quest: (typeof mockQuests)[0]) => {
    const contractAddressOfTheQuest = quest.contractAddress;
    // 1. Verify
    if (!MiniKit.isInstalled()) {
      return;
    }
    // World App will open a drawer prompting the user to confirm the operation, promise is resolved once user confirms or cancels
    const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);
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
      setVerifyProof(verifyResponseJson.verifyRes.proof);
    }

    // 2. Sign message
    const messageToSign: SignMessageInput = {
      message: `You are confirming that you are joining the "${quest.title}" of ${quest.organization}. This action does not mean any money transaction.`,
    };

    const { finalPayload: signMessagePayload }: any =
      await MiniKit.commandsAsync.signMessage(messageToSign);

    if (signMessagePayload.status === "success") {
      const messageHash = hashSafeMessage(messageToSign.message);
      setMessageHash(messageHash);
    }

    // 3. Interact with the smart contract address of the quest
    // 3.1. Send your walletAddress
    // 3.2. Send maxParticipants (will be used to check if the quest is full)

    // 4. If interaction is successful, update the currentParticipants + 1
    // 4.1. Show the returned hash, etc.
    const tx = writeContract({
      abi: [],
      address: contractAddressOfTheQuest as `0x${string}`,
      functionName: "joinQuest",
      args: [user.walletAddress, quest.maxParticipants],
    });

    console.log("Transaction", tx);

    // 5. Save the user's participation in a cookie as an object.
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
              <p className="text-xs text-gray-500">Verified</p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            Active
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {quest.title}
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
          className="w-full !bg-gradient-to-r !from-yellow-500 !to-orange-500 border  py-2 !text-white font-semibold rounded-lg flex justify-center items-center gap-2 cursor-pointer"
        >
          {isFull ? "Quest Complete" : "Join Quest"}
        </Button>
      </CardFooter>
    </Card>
  );
}
