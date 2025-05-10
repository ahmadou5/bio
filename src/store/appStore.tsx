import { create } from "zustand";

interface UpdatedTokenType {
  mint: string;
  amount: number;
  decimals: number;
  name: string;
  symbol: string;
  uri: string | null;
  image: string | null;
}

export interface nft {
  mint: string;
  amount: number;
  decimals: number;
  name: string;
  symbol: string;
  uri: string;
  image: string;
  attribute?: {
    trait_type: string;
    value: string;
  }[];
  description: string;
  external_url: string;
  collection?: {
    family: string;
    name: string;
  };
  [key: string]: unknown;
}

interface AppStore {
  nfts: nft[];
  tokens: UpdatedTokenType[];
  selectedToken: UpdatedTokenType | null;
  isReceiveModal: boolean;
  nativePrice: number;
  nativeBalance: number;
  isSendModal: boolean;
  setTokens: (tokens: UpdatedTokenType[]) => void;
  setSelectedToken: (token: UpdatedTokenType) => void;
  setNfts: (nfts: nft[]) => void;
  toggleSendModal: () => void;
  setNativePrice: (price: number) => void;
  setNativeBalance: (balance: number) => void;
  toggleReceiveModal: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  tokens: [],
  nfts: [],
  isSendModal: false,
  isReceiveModal: false,
  selectedToken: null,
  nativeBalance: 0,
  nativePrice: 0,
  setSelectedToken: (token) => set({ selectedToken: token }),
  setNativeBalance: (balance: number) => set({ nativeBalance: balance }),
  setNativePrice: (price: number) => set({ nativePrice: price }),
  setTokens: (tokens) => set({ tokens: tokens }),
  setNfts: (nfts) => set({ nfts: nfts }),
  toggleSendModal: () => {
    set((state) => ({ isSendModal: !state.isSendModal }));
  },
  toggleReceiveModal: () => {
    set((state) => ({ isReceiveModal: !state.isReceiveModal }));
  },
}));
