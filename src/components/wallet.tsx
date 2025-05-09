"use client";
import React, { useEffect, useState } from "react";

import { Settings, Clipboard, CopyIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useWallet } from "@lazorkit/wallet";
import { useAuthStore } from "../store/authStore";
import Dashboard from "./core/Wallet/Dashboard";
import { formatAddress } from "../lib/helpers.lib";
import Modal from "./base/modals/Modal";
import { useAppStore } from "@/store/appStore";
import StyledQRCode from "./ui/QrCode";
import { getUserTokens } from "@/lib/assets.lib";

// Define types

type TabType = "Dashboard" | "SPLs";

// Sample data for the chart

const WalletApp: React.FC = () => {
  const { disconnect, publicKey } = useWallet();
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
          "https://mainnet.helius-rpc.com/?api-key=e5fc821c-2b64-4d66-9d88-7cf162a5ffc8"
        );
        //console.log("...tokens", assets);
        if (assets) {
          setTokens(assets);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserTokens();
  }, [activeTab, publicKey, setTokens]);
  const handleCopytoClipboard = (value: string) => {
    navigator.clipboard?.writeText(value).then(
      () => {
        toast.success("address copied");
      },
      (err) => {
        // Failed to copy to clipboard
        toast.error("Could not copy: ", err);
      }
    );
  };

  return (
    <div className="bg-white min-h-screen sm:max-w-md w-full mx-auto">
      {/* App content */}
      <div className="p-5 bg-white">
        {/* Wallet header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="h-8 px-4 py-0.5 rounded-sm w-auto bg-black/30">
              <p className="font-semibold text-black/60 text-xl">
                {formatAddress(publicKey || "")}
              </p>
            </div>
            <div>
              <Clipboard className="text-black" />
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
          <div className="h-auto items-center flex-row w-full">
            {tokens &&
              tokens?.map((token, i) => (
                <div
                  className=" bg-black h-16 py-2 mt-2 mb-2 rounded-xl px-3 ml-auto mr-auto"
                  key={i}
                >
                  {token.mint}
                  <p>{token.name}</p>
                  <img
                    src={token?.image || "/solana"}
                    alt="hey Solana"
                    className="h-8 w-8"
                  />
                </div>
              ))}
          </div>
        )}

        {activeTab === "Dashboard" && <Dashboard />}
        <Modal
          isOpen={isReceiveModal}
          className="w-[95%] bg-black"
          onClose={toggleReceiveModal}
        >
          <div className="">
            <p className="px-2 text-xl font-extrabold text-center mb-2">
              Send Solana and SPL tokens to this address only
            </p>
            <div className="bg-black/5 py-2 px-3 rounded-md">
              <StyledQRCode data={publicKey ? publicKey : "Empty"} />
            </div>
            <div
              onClick={() =>
                handleCopytoClipboard(publicKey || "Nothing to copy")
              }
              className="mt-4 w-[60%] ml-auto bg-black/25 h-10 py-2 rounded-xl px-3 mr-auto flex items-center justify-between "
            >
              <p className="text-xl font-medium">
                {formatAddress(publicKey || "empty")}
              </p>
              <CopyIcon size={21} />
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={isSendModal}
          className="w-[98%]"
          onClose={toggleSendModal}
        >
          <p>This is Send Modal</p>
        </Modal>

        {/* Bottom navigation */}
      </div>
    </div>
  );
};

export default WalletApp;
