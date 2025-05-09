"use client";
import React from "react";
import { useWallet } from "@lazorkit/wallet";
import { Button } from "./button";
import { Loader } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
function AuthButton() {
  const { setAuthenticate } = useAuthStore();
  const { connect, publicKey, isLoading, error, disconnect } = useWallet();
  const handleDisconnect = async () => {
    try {
      await disconnect();
      setAuthenticate(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handleConnect = async () => {
    try {
      await connect();
      if (!error) {
        setAuthenticate(true);
      } else setAuthenticate(false);
    } catch (error) {
      console.error(error);
    }
  };
  if (publicKey) {
    return (
      <Button
        className="bg-black text-white w-auto px-4 py-1"
        title="Disconnect"
        onClick={() => handleDisconnect()}
      >
        Disconnect
      </Button>
    );
  } else if (isLoading) {
    return (
      <Button className="bg-black/55 text-white w-auto px-4 py-1">
        <Loader className="animate-spin" />
        <p className="text-sm">Loading...</p>
      </Button>
    );
  }
  return (
    <Button
      title="Authenticate"
      className="bg-black text-white w-auto px-4 py-1"
      onClick={() => {
        handleConnect();
      }}
    >
      Authenticate
    </Button>
  );
}

export default AuthButton;
