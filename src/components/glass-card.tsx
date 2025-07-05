"use client";

import type React from "react";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = true,
  gradient = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative backdrop-blur-xl bg-white/10  rounded-2xl shadow-xl border border-gray-200",
        gradient && "bg-gradient-to-br from-white/20 to-white/5",
        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-50",
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
