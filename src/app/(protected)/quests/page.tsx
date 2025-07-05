import { Page } from "@/components/PageLayout";
import Image from "next/image";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Coins, Users } from "lucide-react";
import { mockQuests } from "@/lib/mock-quests";

const QuestsPage = () => {
  return (
    <Page.Main className="container mx-auto px-4 py-12 flex  items-center flex-col">
      <h1 className="text-2xl font-bold from-yellow-500 to-orange-500 bg-clip-text text-transparent bg-gradient-to-r">
        Quests
      </h1>
      <p className="text-sm text-gray-500 text-center">
        Help companies grow their community and increase their engagement. Earn
        rewards for your participation.
      </p>
      <div className="flex flex-col items-center justify-center gap-6 mt-8">
        {mockQuests.map((quest: any) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </Page.Main>
  );
};

const QuestCard = ({ quest }: { quest: (typeof mockQuests)[0] }) => {
  const participationPercentage =
    (quest.currentParticipants / quest.maxParticipants) * 100;
  const spotsRemaining = quest.maxParticipants - quest.currentParticipants;
  const isAlmostFull = participationPercentage > 80;
  const isFull = participationPercentage >= 100;
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
        <Button className="w-full !bg-gradient-to-r !from-yellow-500 !to-orange-500 border  py-2 !text-white font-semibold rounded-lg flex justify-center items-center gap-2 cursor-pointer">
          {isFull ? "Quest Complete" : "Join Quest"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestsPage;
