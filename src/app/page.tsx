"use client";
import React from "react";
import WalletApp from "../components/wallet";

import Authentication from "../components/core/Auth/Authentication";
import { useAuthStore } from "../store/authStore";

export default function Home() {
  const { isAuthenticate } = useAuthStore();

  return (
    <div className="h-full lg:w-full w-full">
      {isAuthenticate ? <WalletApp /> : <Authentication />}
    </div>
  );
}
