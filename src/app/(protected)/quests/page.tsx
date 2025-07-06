import { Page } from "@/components/PageLayout";
import React from "react";
import { mockQuests } from "@/lib/mocks/mock-quests";
import QuestCard from "@/components/quest-card";
import { auth } from "@/auth";
import { MiniKit } from "@worldcoin/minikit-js";
import { WelcomeBanner } from "@/components/WelcomeBanner";

const QuestsPage = async () => {
  const session = await auth();
  let user;
  try {
    user = await MiniKit.getUserByUsername(session?.user?.username || "");
  } catch (error) {
    console.error("Error fetching user data: ", error);
    user = { walletAddress: "0x123456789" };
  }

  return (
    <Page.Main className="container mx-auto px-4 py-12 flex  items-center flex-col">
      {/* Welcome Banner */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <WelcomeBanner />
      </div>
      
      <h1 className="text-4xl from-yellow-500 to-orange-500 bg-clip-text text-transparent bg-gradient-to-r">
        <b>Quests</b>
      </h1>
      <p className="text-md text-gray-500 text-center">
        Help companies grow their community and increase their engagement. Earn
        rewards for your participation.
      </p>
      <div className="flex flex-col items-center justify-center gap-6 mt-8">
        {mockQuests.map((quest: any) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            user={user}
            username={session?.user?.username || ""}
          />
        ))}
      </div>
    </Page.Main>
  );
};

export default QuestsPage;
