import { formatAddress, isValidSolanaAddress } from "@/lib/helpers.lib";
import { useAppStore } from "@/store/appStore";
import Image from "next/image";
import React from "react";

type Steps = "Verify" | "Sending" | "Preview" | "Sent";
function SendModal() {
  const { nativeBalance, nativePrice } = useAppStore();
  const [activeStep, setStep] = React.useState<Steps>("Verify");
  const [receiveAddress, setReceiveAddress] = React.useState<string>("");
  const [amount, setAmount] = React.useState<number>(0);
  const amountRef = React.useRef<HTMLInputElement>(null);
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    setReceiveAddress(e.target.value);
  };
  return (
    <div className="w-[100%] py-1 px-1 ml-auto mr-auto items-center rounded-xl h-auto ">
      {activeStep === "Verify" && (
        <>
          <p className="text-center font-semibold text-black">Receipent</p>

          <div className="w-[100%] py-0 px-0 h-auto bg-black/0">
            <div className="flex mt-[10px]">
              <div className="mr-1 ml-auto mt-1 h-8">
                {isValidSolanaAddress(receiveAddress) && (
                  <Image
                    src="https://solana-wallet-orcin.vercel.app/assets/good.svg"
                    alt="Valid address"
                    width={26}
                    height={26}
                  />
                )}
              </div>
            </div>

            <input
              className={`w-[100%] h-12 rounded-xl ml-auto mr-auto text-[15px] bg-black/90 py-1 px-2  outline-none ${
                receiveAddress.length > 0 &&
                !isValidSolanaAddress(receiveAddress)
                  ? " border-red-500 border"
                  : "border-none"
              }`}
              onChange={handleChange}
              type="text"
              placeholder="Address"
              value={receiveAddress}
            />

            <div>
              {receiveAddress.length > 0 &&
              !isValidSolanaAddress(receiveAddress) ? (
                <p className="text-[#FC4444] mt-1 px-1 text-[14px]">
                  Not a valid solana address
                </p>
              ) : null}
            </div>
          </div>
          <div className="w-[100%] flex flex-col py-2 px-1 h-[60%] bg-black/0">
            <div className="mt-[109px] w-[100%] ml-auto mr-auto">
              <button
                disabled={!isValidSolanaAddress(receiveAddress)}
                onClick={() => {
                  if (isValidSolanaAddress(receiveAddress)) {
                    setStep("Sending");
                  }
                }}
                className={`w-[100%] ml-auto mr-auto py-1 border rounded-xl ${
                  isValidSolanaAddress(receiveAddress)
                    ? "bg-black"
                    : "bg-black/70"
                } bg-black h-12`}
              >
                Continue
              </button>
            </div>
          </div>
        </>
      )}
      {activeStep === "Sending" && (
        <>
          <div>
            <div className="w-[100%] h-20 bg-slate-50/0 rounded-xl py-3 px-6">
              <p className="text-[14px] text-center text-black font-light">{`Address to : ${formatAddress(
                receiveAddress
              )}`}</p>
            </div>
            <div className="w-[100%] bg-black/40-300 ml-auto mr-auto text-black rounded-xl py-3 flex  h-20">
              <input
                ref={amountRef}
                type="number"
                id="pin"
                name="pin"
                //value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAmount(e.target.valueAsNumber)
                }
                placeholder="0"
                pattern="[0-9]*"
                inputMode="numeric"
                security="yes"
                maxLength={8}
                className="outline-none bg-transparent text-end text-3xl ml- w-[50%] h-12 "
              />
              <p className="mt-3 text-xl font-light ml-1 mr-auto">{"SOL"}</p>
            </div>
            <div className="bg-black/0 rounded-2xl w-[150px] border border-white h-9">
              <p className="text-white text-center py-1.5">
                {`$${
                  (amount || 0) * nativePrice // token price  tbd
                }`}
              </p>
            </div>
            <div>
              <div className="mt-10 w-[100%] ml-auto mr-auto">
                <div className="w-[98%] ml-auto mr-auto py-1 border border-[#448cff]/60 rounded-xl bg-black/90 h-14">
                  <button
                    onClick={() => {
                      if (amount < nativeBalance) {
                        setStep("Preview");
                        //handleTransfer()
                      } else {
                        alert("You dont have enought");
                      }
                    }}
                    className="outline-none bg-transparent w-[100%] h-[100%] text-white  py-2 px-4"
                  >
                    {" "}
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {activeStep === "Sent" && <></>}
    </div>
  );
}

export default SendModal;
