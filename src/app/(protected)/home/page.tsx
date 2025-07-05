import { Page } from "@/components/PageLayout";
import { Pay } from "@/components/Pay";
import { Transaction } from "@/components/Transaction";
import { UserInfo } from "@/components/UserInfo";
import { Verify } from "@/components/Verify";
import { ViewPermissions } from "@/components/ViewPermissions";

import { Marble, TopBar } from "@worldcoin/mini-apps-ui-kit-react";
import { ChevronRight, CircleUser, Hammer, Target, Trophy } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import Link from "next/link";
import Image from "next/image";
import ComingSoon from "@/components/coming-soon";
import ProtectedHeader from "@/components/protected-header";

const features = [
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
    title: "Stake & Build & Earn",
    description:
      "Participate in hackathon-style challenges, creating innovative projects and competing for prizes that showcase your skills.",
    href: "/challenges",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    title: "Live Quizzes",
    description:
      "Join real-time quiz games with live leaderboards. Compete with others and win WLD/USDC prizes!",
    href: "/quizzes",
    color: "from-yellow-500 to-orange-500",
  },
];

export default async function Home() {
  return (
    <main className=" mx-auto px-4 py-12 flex justify-center items-center flex-col">
      <div className="text-center mb-12">
        <div className="text-5xl tracking-tight leading-10  mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500">
          <h1 className="font-bold">Engage & Earn.</h1>
          <h4 className="font-light">Simple is that.</h4>
        </div>

        <div className="text-lg text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
          Join live quizzes, complete quests, and participate in challenges.
          <br />
          <p className="text-orange-500 ">
            Earn real WLD and USDC rewards!
          </p>{" "}
        </div>
        {/* Features Grid */}
        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index}>
              <GlassCard className="p-6 h-full" gradient hover>
                <div className="flex flex-col h-full ">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center text-white justify-center  mb-6 shadow-lg`}
                  >
                    {feature.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-extrabold flex items-center">
                        {feature.title}
                        {feature.title === "Live Quizzes" && (
                          <ComingSoon description="Live Quizzes are not available yet! When they are available, you will be able to join them and compete with others for prizes." />
                        )}
                      </h3>
                    </div>

                    <p className=" text-sm text-left text-gray-500 mb-8 leading-relaxed ">
                      {feature.description}
                    </p>
                  </div>

                  <Link
                    href={feature.title === "Live Quizzes" ? "#" : feature.href}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 border  backdrop-blur-sm py-2 text-white font-semibold rounded-xl flex justify-center items-center gap-2 cursor-pointer"
                  >
                    <span className="text-white">Get Started</span>
                    <div className="ml-0">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
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
    </main>
  );
}
