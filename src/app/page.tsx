"use client";
import React from "react";
import { useAuthStore } from "../store/authStore";
import dynamic from "next/dynamic";

export default function Home() {
  const { isAuthenticate } = useAuthStore();
  const WalletNoSSR = dynamic(() => import("../components/wallet"), {
    ssr: false,
  });

  const AuthNoSSR = dynamic(
    () => import("../components/core/Auth/Authentication"),
    {
      ssr: false,
    }
  );

  return (
    <div className="h-full lg:w-full w-full">
      {isAuthenticate ? <WalletNoSSR /> : <AuthNoSSR />}
    </div>
  );
}
