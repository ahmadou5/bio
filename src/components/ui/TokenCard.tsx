import React from "react";

function TokenCard({
  symbol,
  balance,
  logoUrl,
  price,
}: {
  symbol: string;
  balance: number;
  logoUrl: string;
  price: number;
}) {
  return (
    <div
      className="flex w-[99%] h-[62px]  items-center justify-between bg-black/95 py-2 px-4 rounded-2xl mt-1 mb-2"
      style={{
        background: "linear-gradient(145deg, #080808, #1a1a1a)",
        // boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="bg-red-500/0">
        <img
          src={logoUrl || "https://assets.infusewallet.xyz/assets/red.png"}
          className="h-10 w-10 rounded-full"
        />
      </div>
      <div className=" w-[85%] flex items-center justify-between">
        <div>
          <p>{symbol}</p>
        </div>
        <div className="text-end">
          <p>{`${price} $`}</p>
          <p>{`${balance.toFixed(2)} ${symbol}`}</p>
        </div>
      </div>
    </div>
  );
}

export default TokenCard;
