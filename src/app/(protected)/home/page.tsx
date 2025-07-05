import { auth } from "@/auth";
import { Page } from "@/components/PageLayout";
import { Pay } from "@/components/Pay";
import { Transaction } from "@/components/Transaction";
import { UserInfo } from "@/components/UserInfo";
import { Verify } from "@/components/Verify";
import { ViewPermissions } from "@/components/ViewPermissions";
import { Marble, TopBar } from "@worldcoin/mini-apps-ui-kit-react";
import { MiniKit } from "@worldcoin/minikit-js";
import { ChevronRight, Hammer, Target, Trophy } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    icon: <Trophy className="w-8 h-8" />,
    title: "Live Quizzes",
    description:
      "Join real-time quiz games with live leaderboards. Compete with others and win WLD/USDC prizes!",
    href: "/quizzes",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Quests",
    description:
      "Complete engaging tasks and challenges. Each quest offers guaranteed payouts for completion.",
    href: "/quests",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: <Hammer className="w-8 h-8" />,
    title: "Build Challenges",
    description:
      "Participate in hackathon-style challenges, creating innovative projects and competing for prizes that showcase your skills.",
    href: "/challenges",
    color: "from-yellow-500 to-orange-500",
  },
];

export default async function Home() {
  const session = await auth();
  const user = await MiniKit.getUserInfo();

  return (
    <>
      <Page.Header className="p-0 bg-white">
        <TopBar
          logo={
            <Image
              src="/carrot-logo.svg"
              alt="logo"
              width={100}
              height={100}
              className="w-10 h-10 object-contain"
            />
          }
          endAdornment={
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold capitalize text-gray-900">
                {session?.user.username}
              </p>
              <Marble src={session?.user.profilePictureUrl} className="w-12" />
            </div>
          }
        />
      </Page.Header>
      <Page.Main className="container mx-auto px-4 py-6 md:py-8 flex justify-center items-center flex-col">
        <div className="text-center mb-12">
          <h1>test</h1>
          <p>Username from MiniKit: {user?.username}</p>
          <p>Wallet Address from MiniKit: {user?.walletAddress}</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500">
            Engage & Earn. Simple is that.
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto mb-8 leading-relaxed">
            Join live quizzes, complete quests, and participate in challenges.{" "}
            <span className="text-orange-600 font-semibold">
              Earn real WLD and USDC rewards
            </span>{" "}
            !
          </p>
          {/* Features Grid */}
          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={feature.title}>
                <GlassCard className="p-6 h-full" gradient hover>
                  <div className="flex flex-col h-full ">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center text-white justify-center  mb-6 shadow-lg`}
                    >
                      {feature.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold ">{feature.title}</h3>
                      </div>

                      <p className=" text-sm leading-relaxed mb-6">
                        {feature.description}
                      </p>
                    </div>

                    <Link
                      href={feature.href}
                      className="mt-auto cursor-pointer"
                    >
                      <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 border cursor-pointer  text-white backdrop-blur-sm py-3">
                        <span>Get Started</span>
                        <div className="ml-0">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </button>
                    </Link>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
        {/* 
        Kartları listele. Live Quiz kartı yönlendirme yapsın şimdilik sadece.
        */}
        {/* <UserInfo />
        <Verify />
        <Pay />
        <Transaction />
        <ViewPermissions /> */}
      </Page.Main>
    </>
  );
}
