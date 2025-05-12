"use client";
import React, { useEffect, useState } from "react";

import { Settings, CopyIcon } from "lucide-react";
import { useWallet } from "@lazorkit/wallet";
import { useAuthStore } from "../store/authStore";
import Dashboard from "./core/Wallet/Dashboard";
import { formatAddress } from "../lib/helpers.lib";
import Modal from "./base/modals/Modal";
import { useAppStore } from "@/store/appStore";

import { getUserTokens } from "@/lib/assets.lib";
import TokenCard from "./ui/TokenCard";
import { ENV } from "@/lib/constant/env.constant";
import SendModal from "./base/modals/SendModal";
import ReceiveModal from "./base/modals/ReceiveModal";

// Define types

type TabType = "Dashboard" | "SPLs";

// Sample data for the chart

const WalletApp: React.FC = () => {
  const { disconnect, smartWalletAuthorityPubkey = useWallet();
  const [activeTab, setActiveTab] = useState<TabType>("Dashboard");
  const { setAuthenticate } = useAuthStore();
  const {
    isReceiveModal,
    toggleSendModal,
    isSendModal,
    toggleReceiveModal,
    tokens,

    setTokens,
  } = useAppStore();
  const handleTabChange = (tab: TabType): void => {
    setActiveTab(tab);
  };
  useEffect(() => {
    const fetchUserTokens = async () => {
      try {
        const assets = await getUserTokens(
          "BwY8CufbQMF7YPsPEfere1DhYPehTBPSpRJJKG2gTvDq",
          ENV.RPC_URL || ""
        );

        if (assets) {
          setTokens(assets);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserTokens();
  }, [activeTab, smartWalletAuthorityPubkey, setTokens]);

  return (
    <div className="bg-white min-h-screen sm:max-w-md w-full mx-auto">
      {/* App content */}
      <div className="p-5 bg-white">
        {/* Wallet header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="h-8 px-4 py-0.5 rounded-sm w-auto bg-black/30">
              <p className="font-semibold text-black/60 text-xl">
                {formatAddress(smartWalletAuthorityPubkey || "")}
              </p>
            </div>
            <div>
              <CopyIcon className="text-black ml-2 mr-2" size={19} />
            </div>
          </div>
          <button
            onClick={() => {
              disconnect();
              setAuthenticate(false);
            }}
            className="w-8 h-8 bg-black rounded-full flex items-center justify-center"
            aria-label="Add new"
          >
            <Settings size={16} color="white" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex space-x-4 mb-6">
          {(["Dashboard", "SPLs"] as TabType[]).map((tab) => (
            <button
              key={tab}
              className={`${
                activeTab === tab
                  ? "font-bold border-b-2 border-black"
                  : "text-gray-400"
              } pb-1`}
              onClick={() => handleTabChange(tab)}
              aria-selected={activeTab === tab}
              role="tab"
            >
              {tab}
            </button>
          ))}
        </div>
        {activeTab === "SPLs" && (
          <div className="h-auto items-center overflow-y-auto scrollbar-hide flex-row w-full">
            {tokens &&
              tokens?.map((token, i) => (
                <TokenCard
                  key={i}
                  symbol={token.symbol}
                  balance={token.amount}
                  logoUrl={token.image || ""}
                  price={1}
                />
              ))}
          </div>
        )}

        {activeTab === "Dashboard" && <Dashboard />}
        <Modal
          isOpen={isReceiveModal}
          className="w-[98%] bg-black"
          onClose={toggleReceiveModal}
        >
          <ReceiveModal />
        </Modal>
        <Modal
          isOpen={isSendModal}
          className="w-[98%] bg-black"
          onClose={toggleSendModal}
        >
          <SendModal />
        </Modal>

        {/* Bottom navigation */}
      </div>
    </div>
  );
};

export default WalletApp;
