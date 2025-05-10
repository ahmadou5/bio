import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import Image from "next/image";
import { useAppStore } from "@/store/appStore";

interface UpdatedTokenType {
  mint: string;
  amount: number;
  decimals: number;
  name: string;
  symbol: string;
  uri: string | null;
  image: string | null;
}

// Optional props interface for the component
interface TokenSelectorProps {
  tokens?: UpdatedTokenType[];
  onSelect?: (token: UpdatedTokenType) => void;
  defaultSelected?: UpdatedTokenType;
}

export default function TokenSelector({
  tokens = [],
  onSelect,
  defaultSelected,
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // Fix: Handle the possibility of defaultSelected being undefined
  const [selectedAccount, setSelectedAccount] = useState<UpdatedTokenType>(
    defaultSelected || ({} as UpdatedTokenType)
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { setSelectedToken, selectedToken } = useAppStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const getFisrtAccount = () => {
      if (selectedToken && tokens.length > 0) {
        const firstToken = tokens.filter(
          (token) => token.mint === selectedToken.mint
        );
        setSelectedAccount(firstToken[0]);
        if (onSelect) {
          onSelect(firstToken[0]);
        }
      }
    };
    getFisrtAccount();
  }, []);

  const selectAccount = (token: UpdatedTokenType) => {
    setSelectedAccount(token);
    setSelectedToken(token);
    setIsOpen(false);

    // Call the onSelect prop if provided
    if (onSelect) {
      onSelect(token);
    }

    console.log("Selected account:", token);
  };

  return (
    <div className="w-full rounded-sm">
      {/* Dropdown Button */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full rounded-sm py-0.5 px-2 border border-[#132236] shadow-sm hover:border-[#132236]/50 transition-colors"
        >
          <div className="flex items-center">
            <div className=" p-1  rounded-full mr-3">
              <Image
                src={
                  selectedToken?.image ||
                  "https://assets.infusewallet.xyz/assets/red.png"
                }
                alt="image"
                height={21}
                width={21}
              />
            </div>
            <div className="text-left">
              <p className="text-[13px] text-white/40 font-semibold">
                {`${selectedToken?.name}`}
              </p>
            </div>
          </div>
          <ChevronDown
            size={20}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute mt-1 w-full border border-[#132236] bg-[#132236] rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto scrollbar-hide">
            {tokens.map((token) => (
              <div
                key={token?.mint + token?.name}
                onClick={() => selectAccount(token)}
                className="flex items-center py-2 px-3 hover:bg-black/5 cursor-pointer transition-colors"
              >
                <div className=" rounded-full mr-3">
                  <Image
                    src={
                      token?.image ||
                      "https://assets.infusewallet.xyz/assets/red.png"
                    }
                    alt="image"
                    height={20}
                    width={20}
                  />
                </div>
                <div className="flex justify-between w-full">
                  <p className="text-[13px] text-white/40 font-semibold">
                    {`${token?.name}`}
                  </p>
                </div>
                {selectedAccount && selectedAccount?.mint === token?.mint && (
                  <Check size={12} className="text-blue-600 ml-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
