"use client";
import React, { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import {
  Home,
  BarChart2,
  Settings,
  Wallet,
  ChevronDown,
  Plus,
  TrendingUp,
  Clipboard,
  ClipboardCopy,
  CopyIcon,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useWallet } from "@lazorkit/wallet";
import { useAuthStore } from "../store/authStore";
import Dashboard from "./core/Wallet/Dashboard";
import { formatAddress } from "../lib/helpers.lib";
import Modal from "./base/modals/Modal";
import { useAppStore } from "@/store/appStore";
import StyledQRCode from "./ui/QrCode";
import { getUserTokens } from "@/lib/assets.lib";
import { ENV } from "@/lib/constant/env.constant";

// Define types
interface ChartDataPoint {
  name: string;
  value: number;
}

// Custom hook for window size
const useWindowSize = () => {
  // Initialize with undefined for server-side rendering
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Only execute on client side
    if (typeof window !== "undefined") {
      // Handler to call on window resize
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      // Add event listener
      window.addEventListener("resize", handleResize);

      // Call handler right away
      handleResize();

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return windowSize;
};

type TabType = "Dashboard" | "Coins" | "NFTs";

// Sample data for the chart
const data: ChartDataPoint[] = [
  { name: "Jan", value: 195000 },
  { name: "Feb", value: 200000 },
  { name: "Mar", value: 190000 },
  { name: "Apr", value: 205000 },
  { name: "May", value: 210000 },
  { name: "Jun", value: 208000 },
  { name: "Jul", value: 991089 },
];

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
          publicKey || "BwY8CufbQMF7YPsPEfere1DhYPehTBPSpRJJKG2gTvDq",
          ENV.RPC_URL ||
            "https://mainnet.helius-rpc.com/?api-key=e5fc821c-2b64-4d66-9d88-7cf162a5ffc8"
        );
        console.log("...tokens", assets?.data.tokens);
        setTokens(assets?.data.tokens);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserTokens();
  }, [activeTab]);
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
            <Plus size={16} color="white" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex space-x-4 mb-6">
          {(["Dashboard", "Coins", "NFTs"] as TabType[]).map((tab) => (
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
        {activeTab === "Coins" && (
          <p>{tokens && tokens?.map((token) => <>{token.name}</>)}</p>
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
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white flex justify-between items-center py-4 px-6 border-t border-gray-100">
          <button
            className="flex flex-col items-center text-black"
            aria-label="Home"
            aria-current="page"
          >
            <Home size={22} />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            className="flex flex-col items-center text-gray-400"
            aria-label="Stats"
          >
            <BarChart2 size={22} />
            <span className="text-xs mt-1">Stats</span>
          </button>
          <button
            className="flex flex-col items-center text-gray-400"
            aria-label="Wallet"
          >
            <Wallet size={22} />
            <span className="text-xs mt-1">Wallet</span>
          </button>
          <button
            className="flex flex-col items-center text-gray-400"
            aria-label="Settings"
          >
            <Settings size={22} />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletApp;
