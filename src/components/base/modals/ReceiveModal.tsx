import StyledQRCode from "@/components/ui/QrCode";
import { formatAddress } from "@/lib/helpers.lib";
import { useWallet } from "@lazorkit/wallet";
import { CopyIcon } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

function ReceiveModal() {
  const { smartWalletAuthorityPubkey } = useWallet();
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
    <div className="">
      <p className="px-2 text-xl text-black font-extrabold text-center mb-2">
        Send Solana and SPL tokens to this address only
      </p>
      <div className="bg-black/5 py-2 px-3 rounded-md">
        <StyledQRCode data={smartWalletAuthorityPubkey ? smartWalletAuthorityPubkey : "Empty"} />
      </div>
      <div
        onClick={() => handleCopytoClipboard(smartWalletAuthorityPubkey || "Nothing to copy")}
        className="mt-4 w-[60%] ml-auto bg-black/25 h-10 py-2 rounded-xl px-3 mr-auto flex items-center justify-between "
      >
        <p className="text-xl font-medium">
          {formatAddress(smartWalletAuthorityPubkey || "empty")}
        </p>
        <CopyIcon size={21} />
      </div>
    </div>
  );
}

export default ReceiveModal;
