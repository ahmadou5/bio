"use client";

import TokenCard from "@/components/ui/TokenCard";
import { useAppStore } from "@/store/appStore";
import { Home } from "lucide-react";
import React, { useEffect } from "react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import Chart from "./Chart";
import { getNativePrice } from "@/lib/helpers.lib";
import { useWallet } from "@lazorkit/wallet";
import { ENV } from "@/lib/constant/env.constant";

function Dashboard() {
  const { toggleReceiveModal, toggleSendModal } = useAppStore();
  const { publicKey } = useWallet();
  const [nativePrice, setNativePrice] = React.useState<number>(0);
  const [nativeBalance, setNativeBalance] = React.useState<number>(0);
  const connection = new Connection(ENV.RPC_URL || "", {
    commitment: "confirmed",
  });
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const price = await getNativePrice("solana");
        setNativePrice(price);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSolBalance = async () => {
      try {
        if (!publicKey) {
          return;
        }
        const user = new PublicKey(publicKey);
        const balance = await connection.getBalance(user);
        setNativeBalance(balance / LAMPORTS_PER_SOL);
      } catch (error) {
        throw error;
      }
    };
    fetchSolBalance();
    fetchSolPrice();
  }, []);
  return (
    <div>
      {" "}
      {/* Balance display */}
      <div className="mb-6 px-4">
        <h3 className="text-4xl text-black/80 font-bold mb-1">{`${
          nativeBalance * nativePrice
        } $`}</h3>
      </div>
      {/* Action buttons */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => toggleSendModal()}
          className="bg-black text-white rounded-full px-5.5 py-2.5 text-sm font-medium flex items-center"
          aria-label="Deposit funds"
        >
          Send
        </button>
        <button
          onClick={() => toggleReceiveModal()}
          className="bg-gray-100 text-black rounded-full px-4 py-2 text-sm font-medium flex items-center"
          aria-label="Send funds"
        >
          Receive
        </button>
      </div>
      <TokenCard
        symbol="SOL"
        balance={nativeBalance}
        logoUrl="https://assets.infusewallet.xyz/assets/solana.png"
        price={nativePrice}
      />
      {/* Chart */}
      <Chart />
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white flex justify-center items-center py-4 px-6 border-t border-gray-100">
        <button
          className="flex flex-col items-center text-black"
          aria-label="Home"
          aria-current="page"
        >
          <Home size={22} />
          <span className="text-xs mt-1">Home</span>
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
