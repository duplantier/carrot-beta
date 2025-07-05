import { auth } from "@/auth";
import { MiniKit } from "@worldcoin/minikit-js";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProtectedHeader = async () => {
  const session = await auth();
  let user;
  try {
    user = (await MiniKit.getUserByUsername(session?.user?.username || "")) || {
      walletAddress: "0x123456789",
    };
  } catch (error) {
    console.error("Error fetching user data: ", error);
    user = { walletAddress: "0x123456789" };
  }
  return (
    <header className="px-6 py-4  flex justify-between items-center">
      <Link href="/home">
        <Image
          src="/carrot-logo.svg"
          alt="logo"
          width={120}
          height={120}
          className=" object-contain"
        />
      </Link>
      <div className="flex items-center flex-col">
        <p className="text-sm text-gray-600">
          @{session?.user.username || "undefined"}
        </p>
        <p className="text-xs text-gray-300">
          {user.walletAddress
            ? `${user.walletAddress?.substring(
                0,
                6
              )}...${user.walletAddress?.substring(
                user.walletAddress.length - 4
              )}`
            : "0x123456789"}
        </p>
        {/*  {session?.user.profilePictureUrl ? (
        <Marble src={session?.user.profilePictureUrl} className="w-12" />
      ) : (
        <CircleUser className="w-8 h-8 text-gray-500" />
      )} */}
      </div>
    </header>
  );
};

export default ProtectedHeader;
